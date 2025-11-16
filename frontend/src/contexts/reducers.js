export const initialState = {
  auth: null,
  query: '',
  results: [],
  favorites: JSON.parse(localStorage.getItem('favorites')||'[]'),
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
      localStorage.setItem('favorites', JSON.stringify(updated));
      return { ...state, favorites: updated };
    }
    case 'REMOVE_FAVORITE': {
      const updated = state.favorites.filter(a => (a.mal_id ?? a.id) !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(updated));
      return { ...state, favorites: updated };
    }
    case 'CLEAR_FAVORITES': {
      localStorage.removeItem('favorites');
      return { ...state, favorites: [] };
    }
    default:
      return state;
  }
}
