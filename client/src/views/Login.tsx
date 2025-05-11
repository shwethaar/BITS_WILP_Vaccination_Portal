import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography } from '@mui/material';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [logintries, setLogintries] = useState(0);

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setAuthenticated(true);
      navigate('/dashboard');
    } else {
      setAuthenticated(false);
      setLogintries(logintries + 1);
    }
  };

  return (
    <div style={{ backgroundColor: '#e6eeff', display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" fontFamily="Cambria" gutterBottom>Paatshala High School Health Portal</Typography>
        <Typography variant="h6" gutterBottom>Login</Typography>
        {logintries > 0 && (
          <Typography variant="body2" color="red" gutterBottom>Invalid credentials</Typography>
        )}
        <TextField  fullWidth margin="normal" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth margin="normal" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>Login</Button>
      </Container>
    </div>
  );
}

export default Login;