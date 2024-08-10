interface PConfirm {
    confirm: boolean;
}
declare function confirm(message?: string): Promise<PConfirm>;
interface PText {
    name: string;
}
declare function text(message?: any): Promise<PText>;
/**
 * 输入列表, 已 , 分割.
 * @param validate 可选, 一般需要和多选组合,保持重命名关系一一对应.
 * @param message 可选
 * @returns Promise<string[]>
 */
interface PList {
    names: string[];
}
declare function list(validate?: any, message?: string): Promise<PList>;
interface PAutocompleteMultiselect {
    selects: any[];
}
declare function autoMultiselect(choices: any, message?: any, suggest?: (input: any, choices: any) => Promise<any[]>, onState?: (state: any) => void): Promise<PAutocompleteMultiselect>;
declare function confirm_text(confirmMsg?: string, textMsg?: string): Promise<PConfirm & PText>;
export interface PRepeatConfirmText {
    confirm: boolean;
    isRenamed: boolean;
    name: string;
}
declare function repeatFactory(confirmMsg?: string, textMsg?: string): (name: string, count?: number) => Promise<PRepeatConfirmText>;
interface Pro {
    confirm: (...args: Parameters<typeof confirm>) => ReturnType<typeof confirm>;
    text: (...args: Parameters<typeof text>) => ReturnType<typeof text>;
    list: (...args: Parameters<typeof list>) => ReturnType<typeof list>;
    autoMultiselect: (...args: Parameters<typeof autoMultiselect>) => ReturnType<typeof autoMultiselect>;
    confirm_text: (...args: Parameters<typeof confirm_text>) => ReturnType<typeof confirm_text>;
    repeatFactory: (...args: Parameters<typeof repeatFactory>) => ReturnType<typeof repeatFactory>;
    repeat_confirm_text: ReturnType<typeof repeatFactory>;
}
export declare const pro: Pro;
export {};
