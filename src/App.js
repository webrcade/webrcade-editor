import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Paper } from '@mui/material/';

function App() {
  return (
    <Container maxWidth="sm" className="App">
      <Paper>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Typography variant="h1" component="h1" gutterBottom>Create React App + Material-UI</Typography>
        <Button variant="contained" color="primary">
          Primary Button
        </Button>
        <Button variant="contained" color="secondary">
          Secondary Button
        </Button>
      </Paper>
    </Container>
  );
}
export default App;