import type { DLCHttpError as DLCHttpErrorConstructor } from '@/config/error'

declare global {
  /**
   * @description: global 上定义 DLCHttpError 属性
   */
  const DLCHttpError: typeof DLCHttpErrorConstructor
}
