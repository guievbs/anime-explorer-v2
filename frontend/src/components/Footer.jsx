import React from 'react';
export default function Footer() {
  return (
    <footer style={{textAlign:'center',padding:20,borderTop:'1px solid #eee',marginTop:40}}>
      © {new Date().getFullYear()} Anime Explorer — V2
    </footer>
  );
}
