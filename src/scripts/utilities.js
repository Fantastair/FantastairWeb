/**
 * 睡眠指定毫秒数
 * @param {number} ms 毫秒数
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}