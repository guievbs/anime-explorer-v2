import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import Header from './Header';
import SearchBar from './SearchBar';
import AnimeList from './AnimeList';
import Footer from './Footer';

export default function App() {
  const { state } = useContext(AppContext);
  return (
    <div>
      <Header />
      <main className="container">
        <SearchBar />
        {state.error && <div style={{color:'red'}}>{state.error}</div>}
        {state.results.length ? <AnimeList /> : <div style={{textAlign:'center',marginTop:40}}>Bem-vindo ao Anime Explorer</div>}
      </main>
      <Footer />
    </div>
  );
}
