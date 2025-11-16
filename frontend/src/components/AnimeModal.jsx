import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function AnimeModal({ open, onClose, anime }) {
  const [details, setDetails] = useState(anime || null);
  useEffect(() => { setDetails(anime || null); }, [anime]);

  if (!open) return null;
  const img = details?.images?.jpg?.large_image_url || details?.image_url || details?.images?.jpg?.image_url || '';
  const title = details?.title_english || details?.title || details?.name || 'Título desconhecido';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <div style={{ display:'flex', gap:16 }}>
          {img && <img src={img} alt={title} style={{ width:200, height:300, objectFit:'cover', borderRadius:8 }} />}
          <div>
            <Typography variant="body2"><strong>Nota:</strong> {details?.score ?? 'N/A'}</Typography>
            <Typography variant="body2"><strong>Tipo:</strong> {details?.type ?? 'N/A'}</Typography>
            <Typography variant="body2"><strong>Temporada:</strong> {details?.season ? `${details.season} ${details.year ?? ''}` : 'N/A'}</Typography>
            <Typography variant="body2" sx={{ mt:2 }}>{details?.synopsis || details?.description || 'Sinopse não disponível.'}</Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
