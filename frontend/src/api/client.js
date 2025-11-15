export async function apiFetch(path, options = {}) {
  // path SEMPRE deve começar com "/" — exemplo: "/auth/login", "/anime?q=naruto"
  const res = await fetch(`/api${path}`, {
    credentials: 'include', // NECESSÁRIO para enviar e receber cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw { status: res.status, ...json };
  }

  return json;
}
