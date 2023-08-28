import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

const FileProcessor: React.FC = () => {
  const [numFiles, setNumFiles] = useState<number | null>(null);
  const [numIntegers, setNumIntegers] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (numFiles && numIntegers) {
      console.log(`Number of Files: ${numFiles}, Number of Integers: ${numIntegers}`);
      // Processing to be done here...
    }
  };

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
    </Box>
  );
};

export default FileProcessor;