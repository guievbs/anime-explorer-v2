import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { apiFetch } from '../api/client';
import SearchPage from './SearchPage';
import FavoritesPage from './FavoritesPage';

export default function Header() {
  const { state, dispatch } = useContext(AppContext);
  const [view, setView] = useState('home'); // 'home' | 'favorites'

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (e) { /* ignore */ }
    dispatch({ type: 'CLEAR_AUTH' });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" component="div">Anime Explorer</Typography>
            <Button color="inherit" startIcon={<HomeIcon />} onClick={() => setView('home')}>Home</Button>
            <Button color="inherit" startIcon={<FavoriteIcon />} onClick={() => setView('favorites')}>Favoritos</Button>
          </Box>

          <Box sx={{ display:'flex', alignItems:'center', gap: 2 }}>
            <Typography variant="body2">Olá, {state.auth?.name ?? state.auth?.username}</Typography>
            <IconButton color="inherit" onClick={logout}><LogoutIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 3 }}>
        {view === 'home' ? <SearchPage /> : <FavoritesPage />}
      </Box>
    </>
  );
}
