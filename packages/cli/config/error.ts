import { log } from '../utils'

export enum ENUM_ERROR_TYPE {
  // 请求错误
  HTTP = 'git_http_error',
  // 语法错误
  SYNTAX = 'syntax_error',
}

export class DLCHttpError extends Error {
  type: ENUM_ERROR_TYPE
  constructor(type: ENUM_ERROR_TYPE, message: string) {
    super(message)
    this.type = type
  }
}
export function errorInit() {
  // @ts-expect-error TODO: 不知道如何搞定了
  globalThis.DLCHttpError = DLCHttpError
}

export function handlerHttpError(error: DLCHttpError) {
  typeof error === 'string' ? log.red(error) : log.red(error.message)
}

export function errorWrapper(fn: Function) {
  return async function (this: any, ...args: any[]) {
    try {
      return await fn.apply(this, args)
    }
    catch (error: any) {
      if (typeof error === 'string') {
        log.red(error)
      }
      else {
        if (error.type === ENUM_ERROR_TYPE.HTTP

        )
          handlerHttpError(error)
      }
    }
  }
}
