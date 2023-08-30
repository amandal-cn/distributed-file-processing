export type SubmitJobInput = {
    num_files: number;
    num_entries_per_file: number;
}

export type SubmitJobOutput = {
    job_id: string;
}

export type JobStatusOutput = {
    job_id: string;
    status: string | null | undefined;
    num_tasks: number;
    num_completed_tasks: number;
    num_enqueued_tasks: number;
    num_files: number;
    num_entries_per_file: number;
    num_files_generated: number;
}