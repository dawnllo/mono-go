export type ParseFunc = (path: string, data: any) => Promise<WriteFileSyncRestParams>;
declare function oneLayerCatalog(data: any[], type: _Global.GitFetchType.trees | _Global.GitFetchType.contents): _Global.CatalogItem[];
declare function treeLayerCatalog(data: any, type: _Global.GitFetchType.trees | _Global.GitFetchType.contents, level: number): Promise<_Global.CatalogItem[]>;
declare function fileBlob(catalogItem: _Global.CatalogItem, configFile: _Global.ConfigFile, parse: ParseFunc): Promise<string>;
/**
 * 递归调用fileBlob, 传递parse
 * @param catalogItem 单个目录信息
 * @param configFile 全局配置文件
 * @returns
 */
declare function recursiveFileBlob(catalogItem: _Global.CatalogItem, configFile: _Global.ConfigFile, parse: ParseFunc): Promise<string[]>;
interface DownloadType {
    fileBlob: (...args: Parameters<typeof fileBlob>) => ReturnType<typeof fileBlob>;
    recursiveFileBlob: (...args: Parameters<typeof recursiveFileBlob>) => ReturnType<typeof recursiveFileBlob>;
    oneLayerCatalog: (...args: Parameters<typeof oneLayerCatalog>) => ReturnType<typeof oneLayerCatalog>;
    treeLayerCatalog: (...args: Parameters<typeof treeLayerCatalog>) => ReturnType<typeof treeLayerCatalog>;
}
export declare const download: DownloadType;
export {};
