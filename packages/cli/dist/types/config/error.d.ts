export declare enum ENUM_ERROR_TYPE {
    HTTP = "git_http_error",
    SYNTAX = "syntax_error"
}
export declare class DLCHttpError extends Error {
    type: ENUM_ERROR_TYPE;
    constructor(type: ENUM_ERROR_TYPE, message: string);
}
export declare function errorInit(): void;
export declare function errorWrapper(fn: Function): (this: any, ...args: any[]) => Promise<any>;
