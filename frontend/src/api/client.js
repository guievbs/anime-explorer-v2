export async function apiFetch(path, options = {}) {
  const res = await fetch(`http://localhost:4000/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const json = await res.json().catch(()=>null);
  if (!res.ok) throw { status: res.status, ...json };
  return json;
}
