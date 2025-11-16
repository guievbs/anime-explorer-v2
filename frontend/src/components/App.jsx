import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import Header from './Header';
import AuthPage from './AuthPage';
import SearchPage from './SearchPage';
import Footer from './Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function App() {
  const { state } = useContext(AppContext);

  if (!state.auth) {
    return <AuthPage />;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <SearchPage />
      </Container>
      <Box sx={{ mt: 4 }}><Footer /></Box>
    </>
  );
}
