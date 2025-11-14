import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { apiFetch } from '../api/client';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const { state, dispatch } = useContext(AppContext);

  const search = async () => {
    if (!state.auth) { dispatch({ type: 'SET_ERROR', payload: 'Faça login para buscar' }); return; }
    if (!q) { dispatch({ type: 'SET_ERROR', payload: 'Digite algo' }); return; }
    try {
      const res = await apiFetch(`/anime?q=${encodeURIComponent(q)}`);
      const merged = [...(res.local || []), ...(res.api || [])];
      dispatch({ type: 'SET_RESULTS', payload: merged });
      dispatch({ type: 'SET_QUERY', payload: q });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.error || 'Erro ao buscar' });
    }
  };

  const random = async () => {
    if (!state.auth) { dispatch({ type: 'SET_ERROR', payload: 'Faça login para buscar' }); return; }
    try {
      const res = await apiFetch('/anime/random');
      const merged = [...(res.local || []), ...(res.api || [])];
      dispatch({ type: 'SET_RESULTS', payload: merged });
      dispatch({ type: 'SET_QUERY', payload: 'random' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.error || 'Erro' });
    }
  };

  return (
    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:16}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar anime" />
      <button onClick={search}>Buscar</button>
      <button onClick={random}>Aleatório</button>
    </div>
  );
}
