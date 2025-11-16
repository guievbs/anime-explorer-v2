// leitura defensiva de localStorage para não quebrar em ambientes de teste
function safeGetFavorites() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('favorites');
      return raw ? JSON.parse(raw) : [];
    }
  } catch (e) {
    // ignorar erros de parsing ou acesso
  }
  return [];
}

export const initialState = {
  auth: null,
  query: '',
  results: [],
  favorites: safeGetFavorites(),
  error: null
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH': return { ...state, auth: action.payload, error: null };
    case 'CLEAR_AUTH': return { ...state, auth: null };
    case 'SET_QUERY': return { ...state, query: action.payload, error: null };
    case 'SET_RESULTS': return { ...state, results: action.payload, error: null };
    case 'SET_ERROR': return { ...state, error: action.payload };
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.find(a => (a.mal_id ?? a.id) === (action.payload.mal_id ?? action.payload.id));
      const updated = exists ? state.favorites.filter(a => (a.mal_id ?? a.id) !== (action.payload.mal_id ?? action.payload.id))
                             : [...state.favorites, action.payload];
      try { if (typeof window !== 'undefined' && window.localStorage) localStorage.setItem('favorites', JSON.stringify(updated)); } catch(e) {}
      return { ...state, favorites: updated };
    }
    case 'REMOVE_FAVORITE': {
      const updated = state.favorites.filter(a => (a.mal_id ?? a.id) !== action.payload);
      try { if (typeof window !== 'undefined' && window.localStorage) localStorage.setItem('favorites', JSON.stringify(updated)); } catch(e) {}
      return { ...state, favorites: updated };
    }
    case 'CLEAR_FAVORITES': {
      try { if (typeof window !== 'undefined' && window.localStorage) localStorage.removeItem('favorites'); } catch(e) {}
      return { ...state, favorites: [] };
    }
    default:
      return state;
  }
}
