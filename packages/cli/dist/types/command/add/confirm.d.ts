import type MiddleWare from './middleware';
import type { Context } from './index';
/**
 * 确定文件目标
 * 存在：用户交互，是否重写、或取消重新输入。
 * 不存在：进行下一步。
 */
export default function confirm(this: MiddleWare, ctx: Context): Promise<void>;
