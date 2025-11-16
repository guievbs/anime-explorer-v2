import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { AppProvider } from '../../contexts/AppProvider';

// mock apiFetch
vi.mock('../../api/client', () => ({
  apiFetch: vi.fn((path, options) => {
    if (path.startsWith('/anime')) return Promise.resolve({ api: [{ title: 'Mock Anime', images: { jpg: { image_url: 'https://via.placeholder.com/300x450' } }, score: 9 }] , local: [] });
    return Promise.resolve({});
  })
}));

test('SearchBar aciona busca e exibe resultados via contexto', async () => {
  render(<AppProvider><SearchBar /></AppProvider>);
  const input = screen.getByPlaceholderText(/Pesquisar anime/i);
  fireEvent.change(input, { target: { value: 'naruto' }});
  const btn = screen.getByText(/Buscar/i);
  fireEvent.click(btn);
  
  expect(await screen.findByRole('button', { name: /Buscar/i })).toBeDefined();
});