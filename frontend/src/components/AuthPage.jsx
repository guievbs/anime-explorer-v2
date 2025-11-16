import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { apiFetch } from '../api/client';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';

export default function AuthPage() {
  const { dispatch } = useContext(AppContext);
  const [mode, setMode] = useState('login'); // login | signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleLogin = async () => {
    setError(null); setInfo(null);
    try {
      const res = await apiFetch('/auth/login', { method: 'POST', body: { username, password } });
      dispatch({ type: 'SET_AUTH', payload: res.user });
    } catch (err) {
      setError(err.error || 'Erro ao autenticar');
    }
  };

  const handleSignup = async () => {
    setError(null); setInfo(null);
    try {
      // tenta chamar endpoint de registro (pode não existir no backend)
      const res = await apiFetch('/auth/register', { method: 'POST', body: { username, password, name } });
      setInfo('Cadastro realizado. Faça login.');
      setMode('login');
    } catch (err) {
      // se 404 ou não implementado, avisa o usuário
      if (err.status === 404) setError('Registro via frontend não habilitado no servidor. Use usuário seed.');
      else setError(err.error || 'Erro no cadastro');
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={false} sm={4} md={7} sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1517705008125-6b8a4c3d1d5a?auto=format&fit=crop&w=1350&q=80)',
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div style={{ margin: '64px 32px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <Avatar sx={{ m:1, bgcolor:'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">{mode === 'login' ? 'Entrar' : 'Criar conta'}</Typography>

          {error && <Alert severity="error" sx={{ width:'100%', mt:2 }}>{error}</Alert>}
          {info && <Alert severity="info" sx={{ width:'100%', mt:2 }}>{info}</Alert>}

          <TextField margin="normal" required fullWidth label="Usuário" value={username} onChange={e=>setUsername(e.target.value)} />
          {mode === 'signup' && <TextField margin="normal" fullWidth label="Nome" value={name} onChange={e=>setName(e.target.value)} />}
          <TextField margin="normal" required fullWidth label="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

          <Button fullWidth variant="contained" sx={{ mt:3, mb:2 }} onClick={mode==='login'?handleLogin:handleSignup}>
            {mode==='login' ? 'Entrar' : 'Cadastrar'}
          </Button>

          <Grid container>
            <Grid item xs>
              <Button onClick={() => { setMode(mode==='login'?'signup':'login'); setError(null); setInfo(null); }}>
                {mode==='login' ? 'Criar conta' : 'Já tenho conta'}
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="caption">Usuário seed: <strong>student1</strong> / senha: <strong>senha123</strong></Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}
