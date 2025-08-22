export function formatSongTime(sec: number) {
    const seconds = Math.floor(Math.abs(sec));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const t = [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
        .filter(Boolean)
        .join(':');
    return sec < 0 && seconds ? `-${t}` : t;
}
