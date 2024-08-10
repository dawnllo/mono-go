declare function repeatEmptyStr(num: number): string;
interface Tools {
    repeatEmptyStr: (...args: Parameters<typeof repeatEmptyStr>) => ReturnType<typeof repeatEmptyStr>;
}
export declare const tools: Tools;
export {};
