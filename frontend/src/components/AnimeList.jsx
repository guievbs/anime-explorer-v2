import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AnimeCard from './AnimeCard';

export default function AnimeList() {
  const { state } = useContext(AppContext);
  const results = state.results || [];

  // DEBUG: mostra no console os resultados atuais
  console.log('AnimeList - state.results:', results);

  if (!results.length) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <p><strong>Nenhum anime encontrado</strong></p>
        <pre style={{ textAlign: 'left', maxWidth: 800, margin: '0 auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {/* mostra o JSON cru para inspeção */}
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      alignItems: 'start'
    }}>
      {results.map((a, i) => {
        // detecta id único: mal_id (Jikan) ou id (local). Se nenhum, usa índice.
        const key = a.mal_id ?? a.id ?? `r-${i}`;
        return (
          <div key={key} style={{ display: 'flex', justifyContent: 'center' }}>
            <AnimeCard anime={a} />
          </div>
        );
      })}
    </div>
  );
}

