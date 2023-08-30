export type SubmitJobInput = {
    num_files: number;
    num_entries_per_file: number;
}

export type SubmitJobOutput = {
    job_id: string;
}

export enum JobStatus {
    Running = "Running",
    Completed = "Completed",
    Failed = "Failed"
}

export type JobStatusOutput = {
    job_id: string;
    status: JobStatus;
    num_completed_tasks: number;
    num_enqueued_tasks: number;
    execution_history: object;
}