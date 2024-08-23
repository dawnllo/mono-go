import { ChalkInstance } from 'chalk';
import fs from 'node:fs';

declare const colors: readonly ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "redBright", "greenBright", "yellowBright", "blueBright", "magentaBright", "cyanBright", "whiteBright", "bgBlack", "bgRed", "bgGreen", "bgYellow", "bgBlue", "bgMagenta", "bgCyan", "bgWhite", "bgBlackBright", "bgRedBright", "bgGreenBright", "bgYellowBright", "bgBlueBright", "bgMagentaBright", "bgCyanBright", "bgWhiteBright"];
type FuncKeys = typeof colors[number];
type Log = {
    [key in FuncKeys]: (...strs: any[]) => void;
};
type Chalk<T> = {
    -readonly [K in keyof T as `_${string & K}`]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never;
};
declare const log: Log & Chalk<ChalkInstance>;

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
declare function init$1(configFile: UserConfig): void;
declare function git(option: GitHttpOption): Promise<any>;
declare function gitUrl(url: any): Promise<any>;
interface HttpMethods {
    init: (...args: Parameters<typeof init$1>) => ReturnType<typeof init$1>;
    git: (...args: Parameters<typeof git>) => ReturnType<typeof git>;
    gitUrl: (...args: Parameters<typeof gitUrl>) => ReturnType<typeof gitUrl>;
}
declare const http: HttpMethods;

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
declare function init(configFile: UserConfig): void;
/**
 * 生成文件
 * @param input 绝对路径
 * @param content
 * @returns 返回完整绝对路径,或则重名后的绝对路径
 */
declare function writeFileSync(input: string, restParams: WriteFileSyncRestParams): Promise<string>;
/**
 *
 * @param input
 * @param name
 * @returns
 */
declare function pathRename(input: string, name: string): string;
/**
 * 删除文件
 * @param input 绝对路径
 * @returns
 */
declare function rmSyncFile(input: string): Promise<void>;
/**
 * 删除空文件夹
 * @param input绝对路径
 * @returns
 */
declare function rmSyncEmptyDir(input: string): Promise<void>;
interface FileMethods {
    init: (...args: Parameters<typeof init>) => ReturnType<typeof init>;
    writeFileSync: (...args: Parameters<typeof writeFileSync>) => ReturnType<typeof writeFileSync>;
    rmSyncFile: (...args: Parameters<typeof rmSyncFile>) => ReturnType<typeof rmSyncFile>;
    rmSyncEmptyDir: (...args: Parameters<typeof rmSyncEmptyDir>) => ReturnType<typeof rmSyncEmptyDir>;
    pathRename: (...args: Parameters<typeof pathRename>) => ReturnType<typeof pathRename>;
}
declare const file: FileMethods;

interface PConfirm {
    confirm: boolean;
}
declare function confirm(message?: string): Promise<PConfirm>;
interface PText {
    name: string;
}
declare function text(message?: any): Promise<PText>;
/**
 * 输入列表, 已 , 分割.
 * @param validate 可选, 一般需要和多选组合,保持重命名关系一一对应.
 * @param message 可选
 * @returns Promise<string[]>
 */
interface PList {
    names: string[];
}
declare function list(validate?: any, message?: string): Promise<PList>;
interface PAutocompleteMultiselect {
    selects: any[];
}
declare function autoMultiselect(choices: any, message?: any, suggest?: (input: any, choices: any) => Promise<any[]>, onState?: (state: any) => void): Promise<PAutocompleteMultiselect>;
declare function confirm_text(confirmMsg?: string, textMsg?: string): Promise<PConfirm & PText>;
interface PRepeatConfirmText {
    confirm: boolean;
    isRenamed: boolean;
    name: string;
}
declare function repeatFactory(confirmMsg?: string, textMsg?: string): (name: string, count?: number) => Promise<PRepeatConfirmText>;
interface Pro {
    confirm: (...args: Parameters<typeof confirm>) => ReturnType<typeof confirm>;
    text: (...args: Parameters<typeof text>) => ReturnType<typeof text>;
    list: (...args: Parameters<typeof list>) => ReturnType<typeof list>;
    autoMultiselect: (...args: Parameters<typeof autoMultiselect>) => ReturnType<typeof autoMultiselect>;
    confirm_text: (...args: Parameters<typeof confirm_text>) => ReturnType<typeof confirm_text>;
    repeatFactory: (...args: Parameters<typeof repeatFactory>) => ReturnType<typeof repeatFactory>;
    repeat_confirm_text: ReturnType<typeof repeatFactory>;
}
declare const pro: Pro;

type ParseFunc = (path: string, data: any) => Promise<WriteFileSyncRestParams>;
declare function oneLayerCatalog(data: any[], type: GitFetchEnum.trees | GitFetchEnum.contents): CatalogItem[];
declare function treeLayerCatalog(data: any, type: GitFetchEnum.trees | GitFetchEnum.contents, level: number): Promise<CatalogItem[]>;
declare function fileBlob(catalogItem: CatalogItem, configFile: UserConfig, parse: ParseFunc): Promise<string>;
/**
 * 递归调用fileBlob, 传递parse
 * @param catalogItem 单个目录信息
 * @param configFile 全局配置文件
 * @returns
 */
declare function recursiveFileBlob(catalogItem: CatalogItem, configFile: UserConfig, parse: ParseFunc): Promise<string[]>;
interface DownloadType {
    fileBlob: (...args: Parameters<typeof fileBlob>) => ReturnType<typeof fileBlob>;
    recursiveFileBlob: (...args: Parameters<typeof recursiveFileBlob>) => ReturnType<typeof recursiveFileBlob>;
    oneLayerCatalog: (...args: Parameters<typeof oneLayerCatalog>) => ReturnType<typeof oneLayerCatalog>;
    treeLayerCatalog: (...args: Parameters<typeof treeLayerCatalog>) => ReturnType<typeof treeLayerCatalog>;
}
declare const download: DownloadType;

declare function oraWrapper(cb: any, param?: any, start?: string, end?: string): Promise<any>;

declare function repeatEmptyStr(num: number): string;
interface Tools {
    repeatEmptyStr: (...args: Parameters<typeof repeatEmptyStr>) => ReturnType<typeof repeatEmptyStr>;
}
declare const tools: Tools;

interface UserConfig{
    root: string;
    rootResolvePath: string;
    file: UserConfigFileOption;
    git: UserConfigGitOption;
}
interface UserConfigGitOption {
    owner: string;
    repo: string;
    pafg_token: string;
    defaultBranch: string;
}
interface UserConfigFileOption {
    removeWhitePath: string[];
    downloadRelativePath: string;
    parse: (path: string, data: any) => Promise<WriteFileSyncRestParams>;
}
declare const enum GitFetchEnum {
    branches = "branches",
    contents = "contents",
    trees = "trees",
    blobs = "blobs"
}
interface GitHttpOption {
    type: keyof typeof GitFetchEnum;
    sha?: string;
    branch?: string;
    recursive?: boolean;
}
interface CatalogItem {
    path: string;
    url: string;
    type: 'file' | 'dir';
    size: number;
    sha: string;
    relativeInputPath?: string;
    children?: CatalogItem[];
}
type ExcludeFirstParams<T extends any[]> = T extends [any, ...rest: infer R] ? R : never;
type WriteFileSyncRestParams = ExcludeFirstParams<Parameters<typeof fs.writeFileSync>>;

export { type CatalogItem, type UserConfig, type UserConfigFileOption, type UserConfigGitOption, type ExcludeFirstParams, type FuncKeys, GitFetchEnum, type GitHttpOption, type PRepeatConfirmText, type ParseFunc, type WriteFileSyncRestParams, download, file, http, log, oraWrapper, pro, tools };
