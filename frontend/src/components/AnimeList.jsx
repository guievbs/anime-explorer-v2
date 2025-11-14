import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AnimeCard from './AnimeCard';

export default function AnimeList() {
  const { state } = useContext(AppContext);
  const results = state.results || [];

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
      {results.map((a, i) => <AnimeCard key={(a.mal_id||a.id||i)} anime={a} />)}
    </div>
  );
}
