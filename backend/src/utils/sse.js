// Simple in-memory SSE hub
const clients = new Set();

export const subscribe = (res) => {
  clients.add(res);
  // Send initial comment to open stream
  try { res.write(":ok\n\n"); } catch {}
  return () => {
    clients.delete(res);
    try { res.end(); } catch {}
  };
};

export const publish = (event, data) => {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data || {})}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch {}
  }
};

// Optional heartbeat to keep connections alive
setInterval(() => {
  const beat = `event: heartbeat\n` + `data: {}\n\n`;
  for (const res of clients) {
    try { res.write(beat); } catch {}
  }
}, 25000);

