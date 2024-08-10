import { type FuncKeys } from '../../utils';
import type { Context } from './index';
type UseFunction = (content: Context) => void | Promise<void>;
type GeneratorType = Generator<UseFunction, string, void> | null;
/**
 * 先注册功能函数串联起来, 每次run从头迭代.
 */
export default class MiddleWare {
    private queues;
    private iterator;
    context: Context | null;
    construction(): void;
    use(fn: UseFunction): this;
    run(context: Context): Promise<void>;
    cancel(str?: string, color?: FuncKeys): IteratorResult<UseFunction, string>;
    generator(): GeneratorType;
}
export {};
