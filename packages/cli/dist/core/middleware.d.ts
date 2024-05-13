type GeneratorType = Generator<(content: any, middleware: MiddleWare) => void | Promise<void>, string, void>;
export default class MiddleWare {
    #private;
    context: any;
    construction(): void;
    use(fn: any): this;
    run(context: any): Promise<void>;
    cancle(str: any, color: any): IteratorResult<(content: any, middleware: MiddleWare) => void | Promise<void>, string>;
    generator(): GeneratorType;
}
export {};
