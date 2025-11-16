import React, { useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { AppContext } from '../contexts/AppProvider';
import AnimeModal from './AnimeModal';

export default function AnimeCard({ anime }) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const uid = anime?.mal_id ?? anime?.id ?? Math.random().toString(36).slice(2,9);
  const isFav = state.favorites.some(f => (f.mal_id ?? f.id) === uid);

  const toggleFav = (e) => {
    e.stopPropagation();
    dispatch({ type:'TOGGLE_FAVORITE', payload: anime });
  };

  const image = anime?.image_url || anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || 'https://via.placeholder.com/300x450?text=Sem+imagem';
  const title = anime?.title_english || anime?.title || anime?.name || 'Título desconhecido';
  const score = (anime && (anime.score !== undefined && anime.score !== null)) ? anime.score : 'N/A';
  const type = anime?.type || 'N/A';
  const season = anime?.season ? `${anime.season} ${anime.year ?? ''}` : 'N/A';

  return (
    <>
      <Card onClick={() => setOpen(true)} sx={{ width: '100%', maxWidth: 360, height: 480, display:'flex', flexDirection:'column', justifyContent:'space-between', ':hover': { boxShadow: 6 } }}>
        <CardMedia component="img" image={image} alt={title} sx={{ height: 260, objectFit: 'cover' }} />
        <CardContent sx={{ flexGrow:1 }}>
          <Typography variant="h6" component="div" sx={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">Nota: {score}</Typography>
          <Typography variant="body2" color="text.secondary">Tipo: {type} • {season}</Typography>
        </CardContent>

        <CardActions>
          <Box sx={{ display:'flex', gap:1, width:'100%', px:1 }}>
            <Button variant={isFav ? 'outlined' : 'contained'} color={isFav ? 'error' : 'primary'} onClick={toggleFav} fullWidth>{isFav ? 'Remover' : 'Favoritar'}</Button>
            <Button variant="text" onClick={() => setOpen(true)}>Ver</Button>
          </Box>
        </CardActions>
      </Card>

      <AnimeModal open={open} onClose={() => setOpen(false)} anime={anime} />
    </>
  );
}
