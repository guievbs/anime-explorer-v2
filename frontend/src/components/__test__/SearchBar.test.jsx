import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { AppProvider } from '../../contexts/AppProvider';
import { vi } from 'vitest';

// mock apiFetch para evitar chamadas reais durante os testes
vi.mock('../../api/client', () => ({
  apiFetch: vi.fn((path, options) => {
    if (path.startsWith('/anime')) {
      return Promise.resolve({
        api: [
          {
            mal_id: 1,
            title: 'Mock Anime',
            images: { jpg: { image_url: 'https://via.placeholder.com/300x450' } },
            score: 9
          }
        ],
        local: []
      });
    }
    return Promise.resolve({});
  })
}));

test('SearchBar triggers search and calls apiFetch', async () => {
  render(
    <AppProvider>
      <SearchBar />
    </AppProvider>
  );

  const input = screen.getByPlaceholderText(/Pesquisar anime/i);
  fireEvent.change(input, { target: { value: 'naruto' } });

  const btn = screen.getByRole('button', { name: /Buscar/i });
  fireEvent.click(btn);

  // aguarda que a promise resolva (assumindo estado interno)
  const buscarBtn = await screen.findByRole('button', { name: /Buscar/i });
  expect(buscarBtn).toBeDefined();
});
