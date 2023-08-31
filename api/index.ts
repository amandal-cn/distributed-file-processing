import express, { Express, Request, Response  } from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import cors from 'cors';

import { SpawnWorkersInput } from './types/Workers';
import { SubmitJobInput } from './types/Jobs';

import { spawnWorkers, getWorkers } from './handlers/Workers';
import { submitJob, getJobStatus } from './handlers/Jobs';
import { set } from "./utils/Redis";

dotenv.config();

const app: Express = express();
app.use(json());
app.use(cors());

set("max_workers", 0);
set("num_busy_workers", 0);

// spawn workers
app.post('/workers', (req: Request<{}, {}, SpawnWorkersInput>, res: Response) => {
  spawnWorkers(req, res);
})

// GET busy workers
app.get('/workers', (req: Request, res: Response) => {
  getWorkers(req, res);
})

// submit job
app.post('/jobs', (req: Request<{}, {}, SubmitJobInput>, res: Response) => {
  submitJob(req, res);
})

// GET job status
app.get('/jobs/:job_id', (req: Request<{job_id: string}>, res: Response) => {
  getJobStatus(req, res);
})

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:8000`);
});