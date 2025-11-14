import React from 'react';

export default function AnimeModal({ open, onClose, anime }) {
  if (!open) return null;
  const img = anime?.images?.jpg?.large_image_url || anime?.image_url || anime?.images?.jpg?.image_url || '';
  const title = anime?.title_english || anime?.title || 'Sem título';

  return (
    <div onClick={onClose} style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',padding:20,maxWidth:800,width:'90%',borderRadius:8}}>
        <div style={{display:'flex',gap:16}}>
          {img && <img src={img} alt={title} style={{width:200,height:300,objectFit:'cover'}} />}
          <div>
            <h2>{title}</h2>
            <p><strong>Nota:</strong> {anime.score ?? 'N/A'}</p>
            <p><strong>Tipo:</strong> {anime.type ?? 'N/A'}</p>
            <p><strong>Temporada:</strong> {anime.season ? `${anime.season} ${anime.year ?? ''}` : 'N/A'}</p>
            <p><strong>Classificação:</strong> {anime.rating ?? 'N/A'}</p>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <p>{anime.synopsis || anime.description || 'Sinopse não disponível.'}</p>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
