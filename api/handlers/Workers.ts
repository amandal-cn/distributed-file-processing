import { Request, Response } from 'express';
import { SpawnWorkersInput, SpawnWorkersOutput, GetWorkersOutput } from '../types/Workers';

export function spawnWorkers(req: Request<{}, {}, SpawnWorkersInput>, res: Response) {
    const { max_workers } = req.body;
    console.log(`max_workers: ${max_workers}`);
  
    // Some processing code
    
    const spawnWorkersOutput: SpawnWorkersOutput = {
        message: `Successfully spawned ${max_workers} workers`
    };

    // Once the workers are started and processing is done return status code 201
    res.status(201).send(spawnWorkersOutput);
}

export function getWorkers(req: Request, res: Response) {

    const workersOutput: GetWorkersOutput = {
        total_num_workers: 5,
        num_busy_workers: 2
    };

    res.status(200).send(workersOutput);
}