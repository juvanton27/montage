"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.ffmpegDurationToSeconds = void 0;
function ffmpegDurationToSeconds(duration) {
    const [hours, minutes, secondes] = duration.split(":").map(s => parseFloat(s));
    return 3600 * hours + 60 * minutes + secondes;
}
exports.ffmpegDurationToSeconds = ffmpegDurationToSeconds;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map