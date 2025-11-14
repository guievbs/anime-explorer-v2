import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { apiFetch } from '../api/client';

export default function Login({ onClose }) {
  const { dispatch } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/auth/login', { method: 'POST', body: { username, password } });
      dispatch({ type: 'SET_AUTH', payload: res.user });
      dispatch({ type: 'SET_ERROR', payload: null });
      if (onClose) onClose();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.error || 'Erro no login' });
    }
  };

  return (
    <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
      <input placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <div style={{display:'flex',gap:8}}>
        <button type="submit">Entrar</button>
        <button type="button" onClick={onClose}>Fechar</button>
      </div>
    </form>
  );
}
