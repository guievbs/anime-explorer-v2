import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box sx={{ py:4, mt:6, borderTop: '1px solid #eee', textAlign:'center' }}>
      <Typography variant="body2">© {new Date().getFullYear()} Anime Explorer</Typography>
    </Box>
  );
}
