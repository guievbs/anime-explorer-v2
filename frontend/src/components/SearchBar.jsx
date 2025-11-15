import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { apiFetch } from '../api/client';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleError = (msg) => {
    dispatch({ type: 'SET_ERROR', payload: msg });
  };

  const doSearch = async (query) => {
    const trimmed = String(query || '').trim();
    if (trimmed.length === 0) {
      handleError('Digite algo para buscar');
      return;
    }

    // evita chamadas duplicadas
    setLoading(true);
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // note: apiFetch já faz fetch('/api' + path)
      const res = await apiFetch(`/anime?q=${encodeURIComponent(trimmed)}`, { method: 'GET' });
      const merged = [...(res.local || []), ...(res.api || [])];
      dispatch({ type: 'SET_RESULTS', payload: merged });
      dispatch({ type: 'SET_QUERY', payload: trimmed });
    } catch (err) {
      // se backend usar express-validator, err.errors pode existir
      if (err && err.errors && Array.isArray(err.errors)) {
        handleError(err.errors.map(e => e.msg).join('; '));
      } else {
        handleError(err.error || err.message || 'Erro ao buscar');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSearchClick = () => {
    if (!state.auth) return handleError('Faça login para buscar');
    doSearch(q);
  };

  const onRandomClick = async () => {
    if (!state.auth) return handleError('Faça login para buscar');
    setLoading(true);
     try {
      const res = await apiFetch(`/anime?q=${encodeURIComponent(trimmed)}`, { method: 'GET' });
      console.log('BUSCA - resposta do backend:', res); // <-- DEBUG
      const merged = [...(res.local || []), ...(res.api || [])];
      console.log('BUSCA - merged results length:', merged.length, merged); // <-- DEBUG
      dispatch({ type: 'SET_RESULTS', payload: merged });
      dispatch({ type: 'SET_QUERY', payload: trimmed });
    } catch (err) {
      handleError(err.error || 'Erro ao buscar aleatório');
    } finally {
      setLoading(false);
    }
  };

  // allow Enter key
  const onKeyDown = (e) => {
    if (e.key === 'Enter') onSearchClick();
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Buscar anime (ex.: made in abyss)"
        style={{ padding: 8, minWidth: 260 }}
        aria-label="Buscar anime"
      />
      <button onClick={onSearchClick} disabled={loading}>
        {loading ? '...' : 'Buscar'}
      </button>
      <button onClick={onRandomClick} disabled={loading}>
        Aleatório
      </button>
    </div>
  );
}