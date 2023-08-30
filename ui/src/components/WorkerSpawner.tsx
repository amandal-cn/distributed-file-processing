import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ChangeEvent, useState } from 'react';
import Alert from '@mui/material/Alert';
import { spawnWorkers } from '../services/api';

const WorkerSpawner = () => {
    const [numWorkers, setNumWorkers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNumWorkers(Number(event.target.value));
      };

    const handleButtonClick = async() => {
        setLoading(true);
        try {
            await spawnWorkers({max_workers: numWorkers});
            setLoading(false);
            setShowSuccessMessage(true);
        } catch (err) {
            console.log(err);
            setLoading(false);
            setShowErrorMessage(true);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1, width: "50%", margin: "auto"}}>
            <TextField 
                label="Number of workers" 
                type="number" 
                value={numWorkers} 
                onChange={handleInputChange}
            />
            <Button 
                variant="contained" 
                color="primary"
                disabled={loading} 
                onClick={handleButtonClick}
                >
                {loading ? <CircularProgress size={24} /> : "Spawn Workers"}
            </Button>
            {showSuccessMessage && <Alert severity='success' onClose={() => {setShowSuccessMessage(false)}}> Successfully spawned {numWorkers} workers. You can now start processing files.</Alert>}
            {showErrorMessage && <Alert severity='error' onClose={() => {setShowErrorMessage(false)}}> Internal Error - Failed to spawn workers.</Alert>}
        </Box>
    );
}

export default WorkerSpawner;