import type MiddleWare from './middleware';
import type { Context } from './index';
export default function load(this: MiddleWare, _ctx: Context): Promise<void>;
