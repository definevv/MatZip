// 전역 fetch를 감싸 pending 요청을 추적
let __reqId = 0;
const __pending = new Map<number, { url: string; startedAt: number }>();

// @ts-ignore
window.__pendingFetch = __pending;

const origFetch = window.fetch;
window.fetch = async (...args: any[]) => {
  const id = ++__reqId;
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url ?? 'unknown';
  __pending.set(id, { url, startedAt: Date.now() });
  console.log('[fetch:start]', id, url);

  try {
    const res = await origFetch(...args);
    return res;
  } finally {
    const info = __pending.get(id);
    console.log('[fetch:end]', id, url, info ? (Date.now() - info.startedAt) + 'ms' : '');
    __pending.delete(id);
  }
};
