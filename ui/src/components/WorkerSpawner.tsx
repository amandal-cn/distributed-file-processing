import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ChangeEvent, useState } from 'react';
import Alert from '@mui/material/Alert';

const WorkerSpawner = () => {
    const [numWorkers, setNumWorkers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNumWorkers(Number(event.target.value));
      };

    const handleButtonClick = () => {
        setLoading(true);
        for (let i = 0; i < numWorkers; i++) {
            console.log('Worker spawned');
        }
        setInterval(() => {setOpen(true); setLoading(false);}, 3000)
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
            {open && <Alert onClose={() => {setOpen(false)}}> Successfully spawned {numWorkers} workers. You can now start processing files.</Alert>}
        </Box>
    );
}

export default WorkerSpawner;