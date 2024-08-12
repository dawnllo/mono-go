import type { DLCHttpError as DLCHttpErrorConstructor } from '@/config/error'

declare global {
  /**
   * @description: 全局DLCHttp错误类
   */
  const DLCHttpError: typeof DLCHttpErrorConstructor
}
