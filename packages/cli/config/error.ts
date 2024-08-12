import process from 'node:process'
import { log } from '@/utils/index'

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
  // @ts-ignore
  globalThis.DLCHttpError = DLCHttpError
}

function handlerHttpError(error: DLCHttpError) {
  log.red(`gitApi request error: ${error.message}`)
}
const errorHandler = {
  [ENUM_ERROR_TYPE.HTTP]: handlerHttpError,
  [ENUM_ERROR_TYPE.SYNTAX]: handlerHttpError,
}

export function errorWrapper(fn: Function) {
  return async function (this: any, ...args: any[]) {
    try {
      return await fn.apply(this, args)
    }
    catch (error: any) {
      if (typeof error === 'string')
        log.red(error)

      else
        if (errorHandler[error.type])
          errorHandler[error.type]?.(error)

        else
          log.red(error)

      process.exit(0)
    }
  }
}
