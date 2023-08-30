import { Request, Response } from 'express';
import { SubmitJobInput, JobStatusOutput } from "../types/Jobs";
import { generateTasks } from '../utils/TaskGenerator';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from '../utils/Redis';

export function submitJob(req: Request<{}, {}, SubmitJobInput>, res: Response) {
    const { num_files, num_entries_per_file } = req.body;
    console.log(`num_files: ${num_files}, num_entries_per_file: ${num_entries_per_file}`);

    const job_id = uuidv4();
    
    set(`completed_tasks-${job_id}`, 0);
    set(`num_tasks-${job_id}`, 0);
    set(`status-${job_id}`, "INITIATING");
    set(`num_files-${job_id}`, num_files);
    set(`num_entries_per_file-${job_id}`, num_entries_per_file);
    set(`num_files_generated-${job_id}`, 0);

    generateTasks(job_id, num_files, num_entries_per_file);

    res.status(201).send({job_id});
}

export async function getJobStatus(req: Request<{job_id: string}>, res: Response) {
    const job_id = req.params.job_id;
    console.log(`job_id: ${job_id}`);

    const num_completed_tasks = Number(await get(`completed_tasks-${job_id}`));
    const num_tasks = Number(await get(`num_tasks-${job_id}`));
    console.log(`num_completed_tasks: ${num_completed_tasks}, num_tasks: ${num_tasks}`);

    const status = await get(`status-${job_id}`);
    const num_files = Number(await get(`num_files-${job_id}`));
    const num_entries_per_file = Number(await get(`num_entries_per_file-${job_id}`));
    const num_files_generated = Number(await get(`num_files_generated-${job_id}`));
    const result_path = await get(`result_path-${job_id}`);

    const jobStatusOutput: JobStatusOutput = {
        job_id,
        status,
        num_tasks,
        num_completed_tasks: Number(num_completed_tasks),
        num_enqueued_tasks: Number(num_tasks) - Number(num_completed_tasks),
        num_files,
        num_entries_per_file,
        num_files_generated
    };

    if(result_path){
        jobStatusOutput.result_path = result_path;
    }
    
    res.status(200).send(jobStatusOutput);
}
