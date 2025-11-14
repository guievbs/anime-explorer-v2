import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AnimeModal from './AnimeModal';

export default function AnimeCard({ anime }) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const uid = anime.mal_id ?? anime.id;

  const isFav = state.favorites.some(f => (f.mal_id ?? f.id) === uid);

  const toggleFav = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: anime });
  };

  const img = anime?.images?.jpg?.image_url || anime?.image_url || 'https://via.placeholder.com/300x450';
  const title = anime?.title_english || anime?.title || 'Sem título';

  return (
    <>
      <div style={{width:280, cursor:'pointer'}} onClick={() => setOpen(true)}>
        <img src={img} alt={title} style={{width:'100%',height:200,objectFit:'cover',borderRadius:6}} />
        <h4 style={{margin:'8px 0'}}>{title}</h4>
        <p style={{margin:0}}>Nota: {anime.score ?? 'N/A'}</p>
        <div style={{display:'flex',justifyContent:'center',marginTop:8}}>
          <button onClick={toggleFav}>{isFav ? 'Remover' : 'Favoritar'}</button>
        </div>
      </div>
      {open && <AnimeModal open={open} onClose={() => setOpen(false)} anime={anime} />}
    </>
  );
}
