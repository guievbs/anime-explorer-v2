import React from 'react';
import Grid from '@mui/material/Grid';
import AnimeCard from './AnimeCard';

export default function AnimeList({ results }) {
  // read results either from prop or from global state
  // but our SearchPage passes state.results via context; to keep API simple, try to obtain from context if not passed
  const items = results || [];
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
