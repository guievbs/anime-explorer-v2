import React from 'react';
import Grid from '@mui/material/Grid';
import AnimeCard from './AnimeCard';

export default function AnimeList({ results }) {
  const items = Array.isArray(results) ? results : [];

  if (!items.length) {
    return <div style={{ textAlign:'center', marginTop:20 }}>Nenhum anime encontrado</div>;
  }

  return (
    <Grid container spacing={3}>
      {items.map((a, i) => {
        // fallback para formato inesperado: se a não for objeto, mostramos json
        if (!a || typeof a !== 'object') {
          return (
            <Grid item xs={12} key={`bad-${i}`}>
              <pre style={{ whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{JSON.stringify(a, null, 2)}</pre>
            </Grid>
          );
        }
        const key = a.mal_id ?? a.id ?? `idx-${i}`;
        return (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <AnimeCard anime={a} />
          </Grid>
        );
      })}
    </Grid>
  );
}
