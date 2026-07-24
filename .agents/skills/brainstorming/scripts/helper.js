(function() {
  const MIN_RECONNECT_MS = 500;
  const MAX_RECONNECT_MS = 30000;
  const TOMBSTONE_AFTER_MS = 15000; // mostrar overlay de "pausado" tras este tiempo desconectado

  // Función pura: siguiente delay de reconexión (doble, con tope).
  function nextReconnectDelay(current, max) {
    return Math.min(current * 2, max);
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { nextReconnectDelay, MIN_RECONNECT_MS, MAX_RECONNECT_MS, TOMBSTONE_AFTER_MS };
  }

  // Todo lo siguiente es sólo para navegador.
  if (typeof window === 'undefined') return;

  let ws = null;
  let eventQueue = [];
  let reconnectDelay = MIN_RECONNECT_MS;
  let reconnectTimer = null;
  let disconnectedSince = null;
  let everConnected = false;
  let tombstoneShown = false;

  function sessionKey() {
    try {
      return window.sessionStorage && window.sessionStorage.getItem('brainstorm-session-key');
    } catch (e) {}
    return null;
  }

  function websocketUrl() {
    const key = sessionKey();
    return 'ws://' + window.location.host + (key ? '/?key=' + encodeURIComponent(key) : '');
  }

  function reloadAfterRecovery() {
    const key = sessionKey();
    if (key) {
      window.location.replace('/?key=' + encodeURIComponent(key));
    } else {
      window.location.reload();
    }
  }

  // Actualiza estado visual en la pill de status (C.R.O.W.N. UI).
  function setStatus(state) {
    const el = document.querySelector('.status');
    if (!el) return;

    const map = {
      connecting:   { label: 'CONNECTING',   mode: 'Kernel · Linking',   color: '#9ca3af' },
      connected:    { label: 'KERNEL ACTIVE', mode: 'Design · Audit · Memory', color: '#22d3ee' },
      reconnecting: { label: 'RECONNECTING', mode: 'Awaiting Sentinel', color: '#f97316' },
      disconnected: { label: 'PAUSED',       mode: 'Ask agent to resume', color: '#ef4444' }
    };

    const info = map[state] || map.disconnected;
    const pill = el.querySelector('.status-label');
    const mode = el.querySelector('.status-mode');
    const dot = el.querySelector('.status-pill');

    if (pill) pill.textContent = info.label;
    if (mode) mode.textContent = info.mode;
    if (dot) dot.style.backgroundColor = info.color;
    if (dot) dot.style.boxShadow = `0 0 0 5px ${info.color}33`;
  }

  // Overlay de “companion pausado”.
  function showTombstone() {
    if (tombstoneShown) return;
    tombstoneShown = true;
    const el = document.createElement('div');
    el.id = 'bs-tombstone';
    el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;' +
      'align-items:center;justify-content:center;padding:2rem;text-align:center;' +
      'background:rgba(5,8,22,0.95);color:#f9fafb;font-family:system-ui,sans-serif;';
    el.innerHTML = '<div style="max-width:520px">' +
      '<h2 style="margin:0 0 .75rem;font-weight:600;font-size:1.25rem">Companion paused</h2>' +
      '<p style="margin:0;opacity:.9;font-size:.9rem">Este tablero C.R.O.W.N. se ha detenido. ' +
      'Pide a tu agente de código que lo reactive; esta página intentará reconectar automáticamente.</p></div>';
    if (document.body) document.body.appendChild(el);

    // Marcar visualmente el cuerpo como “modo crítico”.
    document.body.classList.add('kernel-paused');
  }

  function connect() {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    setStatus(everConnected ? 'reconnecting' : 'connecting');
    ws = new WebSocket(websocketUrl());

    ws.onopen = () => {
      const recovered = tombstoneShown;
      everConnected = true;
      disconnectedSince = null;
      reconnectDelay = MIN_RECONNECT_MS;
      tombstoneShown = false;
      setStatus('connected');
      document.body.classList.remove('kernel-paused');

      eventQueue.forEach(e => ws.send(JSON.stringify(e)));
      eventQueue = [];

      // Si veníamos de un tombstone y el servidor volvió, recargar con key.
      if (recovered) reloadAfterRecovery();
    };

    ws.onmessage = (msg) => {
      let data;
      try { data = JSON.parse(msg.data); } catch (e) { return; }
      if (data.type === 'reload') window.location.reload();
      // Aquí podrías extender para actualizar métricas visuales:
      // if (data.type === 'metrics') actualizar barras/colores en el tablero.
    };

    ws.onclose = () => {
      ws = null;
      if (disconnectedSince === null) disconnectedSince = Date.now();
      if (Date.now() - disconnectedSince >= TOMBSTONE_AFTER_MS) {
        setStatus('disconnected');
        showTombstone();
      } else {
        setStatus('reconnecting');
      }
      reconnectTimer = setTimeout(connect, reconnectDelay);
      reconnectDelay = nextReconnectDelay(reconnectDelay, MAX_RECONNECT_MS);
    };

    ws.onerror = () => {
      try { ws.close(); } catch (e) {}
    };
  }

  function sendEvent(event) {
    event.timestamp = Date.now();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    } else {
      eventQueue.push(event);
    }
  }

  // Captura clicks en elementos con data-choice (opciones/cards).
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-choice]');
    if (!target) return;

    sendEvent({
      type: 'click',
      text: target.textContent.trim(),
      choice: target.dataset.choice,
      id: target.id || null
    });
  });

  // Selección visual en el frame
  window.selectedChoice = null;

  window.toggleSelect = function(el) {
    const container = el.closest('.options') || el.closest('.cards');
    const multi = container && container.dataset.multiselect !== undefined;
    if (container && !multi) {
      container.querySelectorAll('.option, .card').forEach(o => o.classList.remove('selected'));
    }
    if (multi) {
      el.classList.toggle('selected');
    } else {
      el.classList.add('selected');
    }
    window.selectedChoice = el.dataset.choice;
  };

  // API pública para el companion
  window.brainstorm = {
    send: sendEvent,
    choice: (value, metadata = {}) => sendEvent({ type: 'choice', value, ...metadata })
  };

  connect();
})();
