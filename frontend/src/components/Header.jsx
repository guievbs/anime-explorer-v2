import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { apiFetch } from '../api/client';
import Button from '@mui/material/Button';

export default function Header() {
  const { state, dispatch } = useContext(AppContext);
  const [openFav, setOpenFav] = useState(false);

  const logout = async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch(e) {}
    dispatch({ type: 'CLEAR_AUTH' });
  };

  const removeFavorite = (anime) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: anime });
  };

  const deleteLocal = async (id) => {
    if (!confirm('Deseja realmente excluir este anime local?')) return;
    try {
      await apiFetch(`/anime/${id}`, { method: 'DELETE' });
      // refresh list if current query is 'random' or others - simplest: clear results
      dispatch({ type: 'SET_RESULTS', payload: state.results.filter(r => (r.id ?? r.mal_id) !== id) });
    } catch (err) {
      alert(err.error || 'Erro ao excluir');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
          <Box sx={{ display: 'flex', alignItems:'center', gap:2 }}>
            <Typography variant="h6">Anime Explorer</Typography>
          </Box>

          <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr:2 }}>Olá, {state.auth?.name ?? state.auth?.username}</Typography>

            <IconButton color="inherit" onClick={() => setOpenFav(true)} aria-label="Favoritos">
              <FavoriteIcon />
            </IconButton>

            <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Sair</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={openFav} onClose={() => setOpenFav(false)}>
        <Box sx={{ width: 360, p:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:2 }}>
            <Avatar /> 
            <Typography variant="h6">Favoritos</Typography>
          </Box>

          <List>
            {state.favorites.length === 0 && <Typography variant="body2">Sem favoritos</Typography>}
            {state.favorites.map((a, i) => (
              <ListItem key={(a.mal_id ?? a.id ?? i)} secondaryAction={
                <>
                  {a.__source === 'local' && a.id && (
                    <Button onClick={() => deleteLocal(a.id)} variant="text" color="error">Excluir</Button>
                  )}
                  <Button onClick={() => removeFavorite(a)} variant="text">Remover</Button>
                </>
              }>
                <ListItemText primary={a.title || a.title_english || a.name} secondary={a.score ? `Nota: ${a.score}` : null} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
