import { Request, Response } from 'express';
import { SubmitJobInput, JobStatusOutput } from "../types/Jobs";
import { generateTasks } from '../utils/TaskGenerator';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from '../utils/Redis';
import { sendTaskToQueue } from '../utils/RabbitMQ';

export function submitJob(req: Request<{}, {}, SubmitJobInput>, res: Response) {
    const { num_files, num_entries_per_file } = req.body;
    console.log(`num_files: ${num_files}, num_entries_per_file: ${num_entries_per_file}`);

    const job_id = uuidv4();

    const tasks = generateTasks(job_id, num_files, num_entries_per_file);

    set(`num_tasks-${job_id}`, tasks.length);

    // send tasks to queue
    for(let i = 0; i < tasks.length; i += 1) {
        sendTaskToQueue(tasks[i], "task_queue");
    }

    res.status(201).send({job_id});
}

export async function getJobStatus(req: Request<{job_id: string}>, res: Response) {
    const job_id = req.params.job_id;
    console.log(`job_id: ${job_id}`);

    const num_completed_tasks = Number(get(`completed_tasks-${job_id}`) || 0);
    const jobStatusOutput: JobStatusOutput = {
        job_id,
        num_completed_tasks, 
        num_enqueued_tasks: Number(get(`num_tasks-${job_id}`)) - num_completed_tasks
    };
    
    res.status(200).send(jobStatusOutput);
}
