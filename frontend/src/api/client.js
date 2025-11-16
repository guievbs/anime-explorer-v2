export async function apiFetch(path, options = {}) {
  // sempre path começa com "/" — ex: "/auth/login" ou "/anime?q=..."
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const json = await res.json().catch(()=>null);
  if (!res.ok) throw { status: res.status, ...json };
  return json;
}
