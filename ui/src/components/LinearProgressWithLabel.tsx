import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/joy/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, message?: any}) {
  console.log(props.message);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress determinate thickness={10} {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>`
      <Box sx={{ display: 'flex' }}>
          <Typography variant="body1" color="text.primary">{props.message}</Typography>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel;