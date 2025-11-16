import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AnimeCard from './AnimeCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function FavoritesPage() {
  const { state } = useContext(AppContext);
  const favs = state.favorites || [];

  if (!favs.length) return <Typography align="center" sx={{ mt:4 }}>Você não tem favoritos ainda.</Typography>;

  return (
    <Grid container spacing={3}>
      {favs.map((a, i) => (
        <Grid item xs={12} sm={6} md={4} key={(a.mal_id ?? a.id ?? i)}>
          <AnimeCard anime={a} />
        </Grid>
      ))}
    </Grid>
  );
}
