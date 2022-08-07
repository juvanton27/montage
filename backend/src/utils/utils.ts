
/**
 * Returns duration in secondes
 * @param duration string like 00:00:00.00
 */
export function ffmpegDurationToSeconds(duration: string): number {
    const [hours, minutes, secondes]: number[] = duration.split(":").map(s=>parseFloat(s));
    return 3600*hours + 60*minutes + secondes;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}