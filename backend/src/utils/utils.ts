import * as fs from 'fs';

/**
 * Returns duration in secondes
 * @param duration string like 00:00:00.00
 */
export function ffmpegDurationToSeconds(duration: string): number {
    const [hours, minutes, secondes]: number[] = duration.split(":").map(s=>parseFloat(s));
    return 3600*hours + 60*minutes + secondes;
}

/**
 * Create temp and save folder if doesn't exist
 */
export function createUtilsFolder(): void {
    if(!fs.existsSync(process.env.TEMP_FOLDER))
        fs.mkdirSync(process.env.TEMP_FOLDER);
}

/**
 * Remove temp folder
 */
export function removeUtilsFolder(): void {
    fs.rmSync(process.env.TEMP_FOLDER, {recursive: true});
}