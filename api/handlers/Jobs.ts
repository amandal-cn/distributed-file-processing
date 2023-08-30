import { Request, Response } from 'express';
import { SubmitJobInput, SubmitJobOutput, JobStatusOutput, JobStatus } from "../types/Jobs";

export function submitJob(req: Request<{}, {}, SubmitJobInput>, res: Response) {
    const { num_files, num_entries_per_file } = req.body;
    console.log(`num_files: ${num_files}, num_entries_per_file: ${num_entries_per_file}`);

    const submitJobOutput: SubmitJobOutput = {
        job_id: "job-id-1"
    };

    res.status(201).send(submitJobOutput);
}

export function getJobStatus(req: Request<{job_id: string}>, res: Response) {
    const job_id = req.params.job_id;
    console.log(`job_id: ${job_id}`);

    const jobStatusOutput: JobStatusOutput = {
        job_id,
        status: JobStatus.Running,
        num_completed_tasks: 5,
        num_enqueued_tasks: 2,
        execution_history: {}
    };
    
    res.status(200).send(jobStatusOutput);
}
