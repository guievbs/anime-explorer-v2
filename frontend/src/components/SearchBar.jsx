import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { apiFetch } from '../api/client';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const doSearch = async (query) => {
    const trimmed = String(query||'').trim();
    if (!trimmed) { dispatch({ type:'SET_ERROR', payload:'Digite algo para buscar' }); return; }
    if (!state.auth) { dispatch({ type:'SET_ERROR', payload:'Faça login para buscar' }); return; }
    setLoading(true);
    dispatch({ type:'SET_ERROR', payload:null });
    try {
      const res = await apiFetch(`/anime?q=${encodeURIComponent(trimmed)}`, { method:'GET' });
      // backend returns { api: [...], local: [...] }
      const merged = [...(res.local || []), ...(res.api || [])];
      dispatch({ type:'SET_RESULTS', payload: merged });
      dispatch({ type:'SET_QUERY', payload: trimmed });
    } catch (err) {
      dispatch({ type:'SET_ERROR', payload: err.error || 'Erro ao buscar' });
    } finally { setLoading(false); }
  };

  const doRandom = async () => {
    if (!state.auth) { dispatch({ type:'SET_ERROR', payload:'Faça login para buscar' }); return; }
    setLoading(true);
    try {
      const res = await apiFetch('/anime/random', { method:'GET' });
      const merged = [...(res.local || []), ...(res.api || [])];
      dispatch({ type:'SET_RESULTS', payload: merged });
      dispatch({ type:'SET_QUERY', payload: 'random' });
    } catch (err) {
      dispatch({ type:'SET_ERROR', payload: err.error || 'Erro ao buscar aleatório' });
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ display:'flex', gap:2, mb:3, alignItems:'center' }}>
      <TextField fullWidth value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar anime (ex.: made in abyss)" onKeyDown={(e)=>{ if(e.key==='Enter') doSearch(q); }} />
      <Button variant="contained" onClick={()=>doSearch(q)} disabled={loading}>Buscar</Button>
      <Button variant="outlined" onClick={doRandom} disabled={loading}>Aleatório</Button>
    </Box>
  );
}
