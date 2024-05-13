/**
 *
 * @param {*} template add <template> 模板名
 * @param {*} project [rename] 项目重命名
 * @param {*} options option 对象
 * @param {*} Command Command 对象
 */
declare function excuteQueues(template: any, project: any, options: any): Promise<void>;
export default excuteQueues;
