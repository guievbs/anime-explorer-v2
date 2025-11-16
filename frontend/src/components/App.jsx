import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import Header from './Header';
import AuthPage from './AuthPage';
import SearchPage from './SearchPage';
import FavoritesPage from './FavoritesPage';
import Footer from './Footer';
import Container from '@mui/material/Container';

export default function App() {
  const { state } = useContext(AppContext);

  if (!state.auth) {
    // show auth screen (login/signup)
    return <AuthPage />;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <SearchPage />
      </Container>
      <Footer />
    </>
  );
}
