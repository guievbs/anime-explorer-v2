import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AnimeModal from './AnimeModal';

export default function AnimeCard({ anime }) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(AppContext);

  const uid = anime?.mal_id ?? anime?.id ?? Math.random().toString(36).slice(2,9);
  const isFav = state.favorites.some(f => (f.mal_id ?? f.id) === uid);

  const toggleFav = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: anime });
  };

  // image fallback
  const img = anime?.images?.jpg?.image_url
            || anime?.images?.jpg?.large_image_url
            || anime?.image_url
            || 'https://via.placeholder.com/300x450?text=No+Image';

  // title fallback
  const title = anime?.title_english || anime?.title || anime?.name || 'Título desconhecido';

  // score safe
  const score = (anime?.score !== undefined && anime?.score !== null) ? anime.score : 'N/A';

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          width: 300,
          height: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          background: '#fff'
        }}
      >
        <div style={{ height: 260, overflow: 'hidden' }}>
          <img
            src={img}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
          />
        </div>

        <div style={{ padding: 12, flexGrow: 1 }}>
          <h4 style={{
            margin: 0,
            fontSize: 16,
            lineHeight: '1.2',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{title}</h4>

          <p style={{ margin: '8px 0 0', color: '#555' }}>
            Nota: {score}
          </p>

          <p style={{ margin: '6px 0 0', color: '#777', fontSize: 13 }}>
            Tipo: {anime?.type ?? 'N/A'} • Temporada: {anime?.season ?? 'N/A'}
          </p>
        </div>

        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <button onClick={toggleFav} style={{ flex: 1 }}>
            {isFav ? 'Remover' : 'Favoritar'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
            Ver
          </button>
        </div>
      </div>

      {open && <AnimeModal open={open} onClose={() => setOpen(false)} anime={anime} />}
    </>
  );
}
