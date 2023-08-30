import axios, { AxiosResponse } from 'axios';

import { GetWorkersOutput, SpawnWorkersInput, SpawnWorkersOutput  } from '../types/Workers';
import { SubmitJobInput, SubmitJobOutput, JobStatusOutput } from '../types/Jobs';

const BASE_API_URL = 'http://localhost:8000';
const MAX_RETRIES = 3;

async function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

const retryAxios = async <T>(request: () => Promise<AxiosResponse<T>>, retries: number = 0): Promise<AxiosResponse<T>> => {
  try {
    return await request();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      // Exponential backoff delay
      const delay = Math.pow(2, retries) * 1000;
      await sleep(delay);
      return retryAxios(request, retries + 1);
    } else {
      throw error;
    }
  }
}

const spawnWorkers = async (input: SpawnWorkersInput) => {
  return axios.post<SpawnWorkersOutput>(`${BASE_API_URL}/workers`, input);
}

const getWorkers = async () => {
  return retryAxios(() => axios.get<GetWorkersOutput>(`${BASE_API_URL}/workers`));
}

const submitJob = async (input: SubmitJobInput) => {
  return axios.post<SubmitJobOutput>(`${BASE_API_URL}/jobs`, input);
}

const getJobStatus = async (jobId: string) => {
  return retryAxios(() => axios.get<JobStatusOutput>(`${BASE_API_URL}/jobs/${jobId}`));
}

export { spawnWorkers, getWorkers, submitJob, getJobStatus };