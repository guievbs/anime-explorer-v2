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
      {Array.isArray(state.results) && state.results.length ? (
        <AnimeList results={state.results} />
      ) : (
        <Typography sx={{ mt:4, textAlign:'center' }}>Faça uma busca para ver resultados</Typography>
      )}
    </Box>
  );
}
