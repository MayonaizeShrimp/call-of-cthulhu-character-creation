// 7e success levels: hard is half the value, extreme a fifth, both rounded down.
export const hardValue = (value: number): number => Math.floor(value / 2);

export const extremeValue = (value: number): number => Math.floor(value / 5);
