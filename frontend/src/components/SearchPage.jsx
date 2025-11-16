import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import SearchBar from './SearchBar';
import AnimeList from './AnimeList';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function SearchPage() {
  const { state } = useContext(AppContext);

  return (
    <Box>
      <SearchBar />
      {state.error && <Typography color="error" sx={{ mb:2 }}>{state.error}</Typography>}
      {state.results.length ? <AnimeList /> : <Typography sx={{ mt:4 }} align="center">Faça uma busca para ver resultados</Typography>}
    </Box>
  );
}
