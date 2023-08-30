import { Request, Response } from 'express';
import { SpawnWorkersInput, SpawnWorkersOutput, GetWorkersOutput } from '../types/Workers';
import { spawn } from 'child_process';
import { get, set } from '../utils/Redis';

export function startTaskManager(max_workers: number) {
    const python = spawn('python', ["../workers/main.py", `${max_workers}`]);
    
    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

export function spawnWorkers(req: Request<{}, {}, SpawnWorkersInput>, res: Response) {
    const { max_workers } = req.body;
    console.log(`max_workers: ${max_workers}`);
  
    // Some processing code
    startTaskManager(max_workers);
    set("max_workers", max_workers);

    const spawnWorkersOutput: SpawnWorkersOutput = {
        message: `Successfully spawned ${max_workers} workers`
    };

    // Once the workers are started and processing is done return status code 201
    res.status(201).send(spawnWorkersOutput);
}

export async function getWorkers(req: Request, res: Response) {
    const workersOutput: GetWorkersOutput = {
        total_num_workers: Number(await get('max_workers')),
        num_busy_workers: Number(await get("num_busy_workers"))
    };

    res.status(200).send(workersOutput);
}