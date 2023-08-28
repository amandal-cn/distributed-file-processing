import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WorkerSpawner from './components/WorkerSpawner';
import FileProcessor from './components/FileProcessor';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Distributed File Processing
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 2, ml: 1, mr: 1}}>
          <WorkerSpawner />
      </Box>
      <Box sx={{ mt: 5, ml: 1, mr: 1}}>
          <FileProcessor />
      </Box>
    </Box>
  );
}

export default App;
