export type SpawnWorkersInput = {
    max_workers: number;
}

export type SpawnWorkersOutput = {
    message: string;
}

export type GetWorkersOutput = {
    total_num_workers: number;
    num_busy_workers: number;
}