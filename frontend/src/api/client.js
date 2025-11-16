export async function apiFetch(path, options = {}) {
  // path deve começar com "/" — ex: "/auth/login" os "/anime?q=..."
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // coletar texto cru para debug (útil quando res.json() falha)
  const text = await res.text().catch(() => null);

  // log para dev — remova/controle em produção
  try { console.debug('[apiFetch] %s %s -> status=%d body=', options.method || 'GET', `/api${path}`, res.status, text); } catch(e) {}

  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      // não é JSON — manter null
      json = null;
    }
  }

  // se o endpoint retornar ok mas body vazio, retornamos objeto vazio
  if (!res.ok) {
    // tentar devolver o json se existir, senão message com status
    throw { status: res.status, ...(json || { error: `HTTP ${res.status}` }) };
  }

  // Normalizar formatos possíveis:
  // 1) backend já devolve { api: [...], local: [...] } -> retorna assim
  if (json && (json.api || json.local)) {
    return { api: json.api || [], local: json.local || [], raw: json };
  }

  // 2) backend devolve diretamente a resposta da Jikan: { data: [...] }
  if (json && Array.isArray(json.data)) {
    return { api: json.data, local: [], raw: json };
  }

  // 3) backend devolve um array diretamente (ex: [...])
  if (Array.isArray(json)) {
    return { api: json, local: [], raw: json };
  }

  // 4) corpo vazio ou formato desconhecido -> retorna objeto com raw=text para inspeção
  return { api: [], local: [], raw: json ?? text ?? null };
}
