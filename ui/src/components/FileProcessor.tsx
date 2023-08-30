import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { getJobStatus, getWorkers, submitJob } from "../services/api";
import Alert from '@mui/material/Alert';


const FileProcessor: React.FC = () => {
  const [numFiles, setNumFiles] = useState<number>(0);
  const [numEntriesPerFile, setNumEntriesPerFile] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [numTasks, setNumTasks] = React.useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = React.useState(0);
  const [numEnqueuedTasks, setNumEnqueuedTasks] = React.useState(0);
  const [numBusyWorkers, setNumBusyWorkers] = React.useState(0);
  const [numIdleWorkers, setNumIdleWorkers] = React.useState(0);
  const [numTotalWorkers, setNumTotalWorkers] = React.useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [status, setStatus] = React.useState<string | null | undefined>("Unknown");
  const [numFilesGenerated, setNumFilesGenerated] = React.useState(0);
  const [showLogs, setShowLogs] = React.useState(false);
  const [resultPath, setResultPath] = React.useState<undefined | string>(undefined);

  useEffect(() => {    
    return () => {
      if(intervalId) {
        clearInterval(intervalId);
      }
    }
  }, []);

  const onSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    
    setLoading(true);
    setShowLogs(true);
    setNumCompletedTasks(0);
    setNumEnqueuedTasks(0);
    setNumBusyWorkers(0);
    setNumIdleWorkers(0);
    setStatus("GENERATING FILES");
    setNumFilesGenerated(0);
    setProgress(0);

    if (numFiles && numEntriesPerFile) {
      console.log(`Number of Files: ${numFiles}, Number of entries per file: ${numEntriesPerFile}`);
      try {
        const response = await submitJob({num_files: numFiles, num_entries_per_file: numEntriesPerFile});
        setShowSuccessMessage(true);
        if(intervalId) {
          clearInterval(intervalId);
        }
        const id = setInterval(async() => {
          try {
            const jobStatusResponse = await getJobStatus(response.data.job_id);
            const getWorkersResponse = await getWorkers();
            
            const jobStatusOutput = jobStatusResponse.data;
            const workersOutput = getWorkersResponse.data;
            
            console.log(jobStatusOutput);
            console.log(workersOutput);

            setStatus(jobStatusOutput.status);
            setNumTasks(jobStatusOutput.num_completed_tasks + jobStatusOutput.num_enqueued_tasks);
            setNumCompletedTasks(jobStatusOutput.num_completed_tasks);
            setNumEnqueuedTasks(jobStatusOutput.num_enqueued_tasks);
            setNumFilesGenerated(jobStatusOutput.num_files_generated);
            setResultPath(jobStatusOutput?.result_path);

            setNumBusyWorkers(workersOutput.num_busy_workers);
            setNumIdleWorkers(workersOutput.total_num_workers - workersOutput.num_busy_workers);
            setNumTotalWorkers(workersOutput.total_num_workers);
            
            const currentProgress = Math.round((jobStatusOutput.num_completed_tasks * 100) / (jobStatusOutput.num_completed_tasks + jobStatusOutput.num_enqueued_tasks));
            setProgress(currentProgress);

            const status = jobStatusOutput.status;
            if(status == "COMPLETED" || status == "FAILED") {
              clearInterval(id);
              setLoading(false);
              setResultPath(`api/data/${jobStatusOutput.job_id}/aggregate_result.json`) // temporary - it should be fetched from backend
            }
          } catch(err) {
            console.error(err);
          }
          
        }, 3000);
        setIntervalId(id);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setShowErrorMessage(true);
        if(intervalId) {
          clearInterval(intervalId);
        }
      }
    }
  };

  const getProgressMessage = () => {
    return <>
        Status: <b>{status}</b>
        <br/>
        Files Generated: <b>{numFilesGenerated}</b>
        <br/>
        Tasks: <b>{numTasks}</b>
        <br/>
        Tasks Completed: <b>{numCompletedTasks}</b>
        <br/>
        Task in Queue: <b>{numEnqueuedTasks}</b>
        <br/>
        <br/>
        Workers: <b>{numTotalWorkers}</b>
        <br/>
        Busy Workers: <b>{numBusyWorkers}</b>
        <br/>
        Idle Workers: <b>{numIdleWorkers}</b>
        <br/>
        <br></br>
        {resultPath && <>
        Aggregated result can be found at {resultPath} in your local system.
        </>}
        </>
  }
  
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1, width: "50%", margin: "auto" }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="Number of Files"
        type="number"
        onChange={(event) => setNumFiles(parseInt(event.target.value, 10))}
        required
      />
      <TextField
        label="Number of Integers in Each File"
        type="number"
        onChange={(event) => setNumEntriesPerFile(parseInt(event.target.value, 10))}
        required
      />
      <Button type="submit" variant="contained" disabled={loading} >
        {loading ? <CircularProgress size={24} /> : "Start Processing"}
      </Button>
      {showSuccessMessage && <Alert severity='success' onClose={() => {setShowSuccessMessage(false)}}> Successfully submitted job.</Alert>}
      {showErrorMessage && <Alert severity='error' onClose={() => {setShowErrorMessage(false)}}> Internal Error - Failed to submit job.</Alert>}
      {showLogs && <LinearProgressWithLabel value={progress} message={getProgressMessage()} /> }
    </Box>
  );
};

export default FileProcessor;