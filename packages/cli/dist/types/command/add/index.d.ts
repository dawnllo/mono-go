import type { PRepeatConfirmText } from '../../utils';
export interface Context {
    args: any[];
    configFile: _Global.ConfigFile;
    answers: {
        confirm: PRepeatConfirmText;
    };
}
declare const _default: (this: any, ...args: any[]) => Promise<any>;
export default _default;
