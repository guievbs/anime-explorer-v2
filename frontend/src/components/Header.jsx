import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppProvider';
import Login from './Login';
import { apiFetch } from '../api/client';

export default function Header() {
  const { state, dispatch } = useContext(AppContext);
  const [showLogin, setShowLogin] = useState(false);

  const logout = async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }); dispatch({ type: 'CLEAR_AUTH' }); }
    catch(e){ dispatch({ type:'SET_ERROR', payload:'Erro ao deslogar' }); }
  };

  return (
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,background:'#1976d2',color:'#fff'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button onClick={() => dispatch({ type: 'RESET_SEARCH' })}>Home</button>
        <h3 style={{margin:0}}>Anime Explorer</h3>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {state.auth ? <span>Olá, {state.auth.name}</span> : <button onClick={() => setShowLogin(s => !s)}>Login</button>}
        {state.auth && <button onClick={logout}>Logout</button>}
      </div>

      {showLogin && <div style={{position:'absolute',right:16,top:64,background:'#fff',padding:12}}><Login onClose={() => setShowLogin(false)} /></div>}
    </header>
  );
}
