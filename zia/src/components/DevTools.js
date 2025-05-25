import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { initializeSampleData } from '../utils/sampleData';

const DevTools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleInitializeData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await initializeSampleData();
      setMessage('Sample data initialized successfully! Check console for details.');
      setMessageType('success');
    } catch (error) {
      setMessage(`Error initializing data: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 250,
        zIndex: 1000
      }}
    >
      <Typography variant="h6" gutterBottom>
        🛠️ Dev Tools
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleInitializeData}
        disabled={isLoading}
        fullWidth
        sx={{ mb: 1 }}
      >
        {isLoading ? <CircularProgress size={20} /> : 'Initialize Sample Data'}
      </Button>
      
      <Typography variant="caption" color="text.secondary" display="block">
        Creates sample admins & teachers
      </Typography>
      
      {message && (
        <Alert severity={messageType} sx={{ mt: 1, fontSize: '0.75rem' }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default DevTools;
