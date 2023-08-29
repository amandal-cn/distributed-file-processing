import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgressWithLabel from "./LinearProgressWithLabel";

const FileProcessor: React.FC = () => {
  const [numFiles, setNumFiles] = useState<number>(0);
  const [numIntegers, setNumIntegers] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = React.useState(10);
  const [numProcessedFiles, setNumProcessedFiles] = React.useState(0);
  const [numBusyWorkers, setNumBusyWorkers] = React.useState(0);
  const [numIdleWorkers, setNumIdleWorkers] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      setNumProcessedFiles((prev) => (prev+1));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (numFiles && numIntegers) {
      console.log(`Number of Files: ${numFiles}, Number of Integers: ${numIntegers}`);
      // Processing to be done here...
    }
  };

  const getProgressMessage = () => {
    const numTaskInQueue = numFiles | 0 - numProcessedFiles;
    return <>
        Number of tasks completed: <b>{numProcessedFiles}</b>
        <br/>
        Number of tasks in the queue: <b>{numTaskInQueue}</b>
        <br/>
        Number of busy workers: <b>{numBusyWorkers}</b>
        <br/>
        Number of idle workers: <b>{numIdleWorkers}</b>
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
        onChange={(event) => setNumIntegers(parseInt(event.target.value, 10))}
        required
      />
      <Button type="submit" variant="contained" disabled={loading} >
        {loading ? <CircularProgress size={24} /> : "Start Processing"}
      </Button>
      {loading && <LinearProgressWithLabel value={progress} message={getProgressMessage()} /> }
    </Box>
  );
};

export default FileProcessor;