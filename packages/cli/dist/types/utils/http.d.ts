/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
declare function init(configFile: _Global.ConfigFile): void;
declare function git(option: _Global.GitHttpOption): Promise<any>;
declare function gitUrl(url: any): Promise<any>;
interface HttpMethods {
    init: (...args: Parameters<typeof init>) => ReturnType<typeof init>;
    git: (...args: Parameters<typeof git>) => ReturnType<typeof git>;
    gitUrl: (...args: Parameters<typeof gitUrl>) => ReturnType<typeof gitUrl>;
}
export declare const http: HttpMethods;
export {};
