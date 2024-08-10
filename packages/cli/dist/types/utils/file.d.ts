/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
declare function init(configFile: _Global.ConfigFile): void;
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
export declare const file: FileMethods;
export {};
