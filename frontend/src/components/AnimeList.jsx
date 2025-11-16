import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import AnimeCard from './AnimeCard';
import { AppContext } from '../contexts/AppProvider';

export default function AnimeList({ results: propResults }) {
  const { state } = useContext(AppContext);
  const items = propResults ?? state.results ?? [];

  if (!items || items.length === 0) {
    return <div style={{ textAlign:'center', marginTop:20 }}>Nenhum anime encontrado</div>;
  }

  return (
    <Grid container spacing={3}>
      {items.map((a, i) => (
        <Grid item xs={12} sm={6} md={4} key={(a.mal_id ?? a.id ?? i)}>
          <AnimeCard anime={a} />
        </Grid>
      ))}
    </Grid>
  );
}
