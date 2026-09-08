const GameTools = (() => {
  const GAMES = {
    valorant: { name: 'VALORANT', yaw: 0.07 },
    cs2: { name: 'Counter-Strike 2', yaw: 0.022 },
    apex: { name: 'Apex Legends', yaw: 0.022 },
    overwatch2: { name: 'Overwatch 2', yaw: 0.0066 },
  };

  function validPositive(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function format(value, max = 4) {
    return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: max }).format(value);
  }

  function edpi(dpi, sens) { return dpi * sens; }

  function cm360(gameId, dpi, sens) {
    const game = GAMES[gameId];
    if (!game) return null;
    return 2.54 * 360 / (dpi * sens * game.yaw);
  }

  function sensitivityForCm360(gameId, dpi, cm) {
    const game = GAMES[gameId];
    if (!game) return null;
    return 2.54 * 360 / (dpi * cm * game.yaw);
  }

  function convert(sourceId, targetId, sourceDpi, sourceSens, targetDpi) {
    const source = GAMES[sourceId];
    const target = GAMES[targetId];
    if (!source || !target) return null;
    return (sourceDpi * sourceSens * source.yaw) / (targetDpi * target.yaw);
  }

  async function copy(text, button, success='복사됨') {
    try {
      await navigator.clipboard.writeText(text);
      const old = button.textContent;
      button.textContent = success;
      setTimeout(() => button.textContent = old, 1200);
    } catch {
      button.textContent = '복사 실패';
      setTimeout(() => button.textContent = '다시 시도', 1200);
    }
  }

  return { GAMES, validPositive, format, edpi, cm360, sensitivityForCm360, convert, copy };
})();
