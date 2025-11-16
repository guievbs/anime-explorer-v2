import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { apiFetch } from '../api/client';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function normalizeJikanItem(item) {
  // transforma um item da Jikan (ou raw API) em formato usado pelo frontend
  return {
    __source: 'api',
    mal_id: item.mal_id ?? item.malId ?? null,
    title: item.title ?? (item.titles && item.titles[0] && item.titles[0].title) ?? null,
    title_english: item.title_english ?? null,
    type: item.type ?? null,
    season: item.season ?? null,
    year: item.year ?? null,
    score: item.score ?? null,
    synopsis: item.synopsis ?? item.description ?? null,
    image_url: item.images?.jpg?.image_url ?? item.images?.jpg?.large_image_url ?? item.image_url ?? null,
    raw: item
  };
}

export default function SearchBar() {
  const [q, setQ] = useState('');
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const showRawIfEmpty = (payload) => {
    // se não houver resultados, mostramos o payload cru no estado de erro para inspeção
    const total = (payload.api?.length || 0) + (payload.local?.length || 0);
    if (total === 0) {
      dispatch({ type: 'SET_ERROR', payload: `Nenhum resultado. payload raw: ${JSON.stringify(payload.raw)}` });
    } else {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  };

  const doSearch = async (query) => {
    const trimmed = String(query||'').trim();
    if (!trimmed) { dispatch({ type:'SET_ERROR', payload:'Digite algo para buscar' }); return; }
    if (!state.auth) { dispatch({ type:'SET_ERROR', payload:'Faça login para buscar' }); return; }

    setLoading(true);
    dispatch({ type:'SET_ERROR', payload:null });

    try {
      console.log('[SearchBar] buscando:', trimmed);
      const res = await apiFetch(`/anime?q=${encodeURIComponent(trimmed)}`, { method:'GET' });
      console.log('[SearchBar] apiFetch returned:', res);

      // caso backend devolva raw.data (Jikan) em res.api ser raw items, normalize
      let apiItems = [];
      if (res.api && Array.isArray(res.api) && res.api.length && res.api[0] && res.api[0].raw) {
        // já está normalizado pelo backend — use diretamente
        apiItems = res.api;
      } else if (res.api && Array.isArray(res.api) && res.api.length && res.api[0] && res.api[0].title) {
        // array de objetos Jikan no res.api — normalize
        apiItems = res.api;
      } else if (res.raw && Array.isArray(res.raw.data)) {
        
        apiItems = res.raw.data.map(normalizeJikanItem);
      } else if (Array.isArray(res.raw)) {
        apiItems = res.raw.map(normalizeJikanItem);
      } else if (res.api && Array.isArray(res.api)) {
        apiItems = res.api;
      }

      const localItems = Array.isArray(res.local) ? res.local : [];
      const merged = [...localItems, ...apiItems];

      console.log('[SearchBar] merged length:', merged.length);
      dispatch({ type:'SET_RESULTS', payload: merged });
      dispatch({ type:'SET_QUERY', payload: trimmed });

      // Se não houver resultados, mostrar raw para inspeção
      showRawIfEmpty({ api: apiItems, local: localItems, raw: res.raw });
    } catch (err) {
      console.error('[SearchBar] erro fetch:', err);
      dispatch({ type:'SET_ERROR', payload: err.error || err.message || 'Erro ao buscar' });
      dispatch({ type:'SET_RESULTS', payload: [] });
    } finally {
      setLoading(false);
    }
  };

  const doRandom = async () => {
    if (!state.auth) { dispatch({ type:'SET_ERROR', payload:'Faça login para buscar' }); return; }
    setLoading(true);
    dispatch({ type:'SET_ERROR', payload:null });
    try {
      console.log('[SearchBar] buscando aleatório');
      const res = await apiFetch('/anime/random', { method:'GET' });
      console.log('[SearchBar] random resposta:', res);
      const apiItems = (res.api && Array.isArray(res.api)) ? res.api : (res.raw && Array.isArray(res.raw.data) ? res.raw.data.map(normalizeJikanItem) : []);
      const localItems = Array.isArray(res.local) ? res.local : [];
      const merged = [...localItems, ...apiItems];
      dispatch({ type:'SET_RESULTS', payload: merged });
      dispatch({ type:'SET_QUERY', payload: 'random' });

      showRawIfEmpty({ api: apiItems, local: localItems, raw: res.raw });
    } catch (err) {
      console.error('[SearchBar] erro random:', err);
      dispatch({ type:'SET_ERROR', payload: err.error || 'Erro ao buscar aleatório' });
      dispatch({ type:'SET_RESULTS', payload: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display:'flex', gap:2, mb:3, alignItems:'center' }}>
      <TextField fullWidth value={q} onChange={e=>setQ(e.target.value)}
                 onKeyDown={(e)=>{ if (e.key==='Enter') doSearch(q); }}
                 placeholder="Pesquisar anime (ex.: made in abyss)" />
      <Button variant="contained" onClick={()=>doSearch(q)} disabled={loading}>Buscar</Button>
      <Button variant="outlined" onClick={doRandom} disabled={loading}>Aleatório</Button>
    </Box>
  );
}
