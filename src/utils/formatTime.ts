/**
 * Formats seconds into a user-friendly string (e.g., "3:45" or "1:02:15")
 */
export const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const sStr = s.toString().padStart(2, '0');

    if (h > 0) {
        const mStr = m.toString().padStart(2, '0');
        return `${h}:${mStr}:${sStr}`;
    }

    return `${m}:${sStr}`;
};
