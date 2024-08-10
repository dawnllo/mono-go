import type { ChalkInstance } from 'chalk';
declare const colors: readonly ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "redBright", "greenBright", "yellowBright", "blueBright", "magentaBright", "cyanBright", "whiteBright", "bgBlack", "bgRed", "bgGreen", "bgYellow", "bgBlue", "bgMagenta", "bgCyan", "bgWhite", "bgBlackBright", "bgRedBright", "bgGreenBright", "bgYellowBright", "bgBlueBright", "bgMagentaBright", "bgCyanBright", "bgWhiteBright"];
export type FuncKeys = typeof colors[number];
type Log = {
    [key in FuncKeys]: (...strs: any[]) => void;
};
type Chalk<T> = {
    -readonly [K in keyof T as `_${string & K}`]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never;
};
declare const log: Log & Chalk<ChalkInstance>;
export { log, };
