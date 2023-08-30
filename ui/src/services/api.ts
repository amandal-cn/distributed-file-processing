import axios from 'axios';

import { GetWorkersOutput, SpawnWorkersInput, SpawnWorkersOutput  } from '../types/Workers';
import { SubmitJobInput, SubmitJobOutput, JobStatusOutput } from '../types/Jobs';

const BASE_API_URL = 'http://localhost:8000';

const spawnWorkers = async (input: SpawnWorkersInput) => {
  return axios.post<SpawnWorkersOutput>(`${BASE_API_URL}/workers`, input);
}

const getWorkers = async () => {
  return axios.get<GetWorkersOutput>(`${BASE_API_URL}/workers`);
}

const submitJob = async (input: SubmitJobInput) => {
  return axios.post<SubmitJobOutput>(`${BASE_API_URL}/jobs`, input);
}

const getJobStatus = async (jobId: string) => {
  return axios.get<JobStatusOutput>(`${BASE_API_URL}/jobs/${jobId}`);
}

export { spawnWorkers, getWorkers, submitJob, getJobStatus };