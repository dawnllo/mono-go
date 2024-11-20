import process from 'node:process'
import { log } from '@/utils/index'

export enum ERROR_TYPE_ENUM {
  // 请求错误
  HTTP = 'git_http_error',
  // 语法错误
  SYNTAX = 'syntax_error',
}

export class DLCHttpError extends Error {
  type: ERROR_TYPE_ENUM
  constructor(type: ERROR_TYPE_ENUM, message: string) {
    super(message)
    this.type = type
  }
}
export function errorInit() {
  // @ts-expect-error globalThis.DLCHttpError
  globalThis.DLCHttpError = DLCHttpError
}

function handlerHttpError(error: DLCHttpError) {
  log.red(`gitApi request error: ${error.message}`)
}
const errorHandler = {
  [ERROR_TYPE_ENUM.HTTP]: handlerHttpError,
  [ERROR_TYPE_ENUM.SYNTAX]: handlerHttpError,
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
