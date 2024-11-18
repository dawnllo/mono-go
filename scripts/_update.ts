import yaml from 'js-yaml'
import fs from 'fs-extra'

/**
 * TODO 构建前,通过脚本解决一些问题.
 *  1. 约定式文件结构, 建立 meta 映射关系, 利于脚本处理.
 *  note：后期需要像 anthony fu 那样管理项目的时候，再考虑这个.
 */

const pnpmWorkspace = await fs.readFile('pnpm-workspace.yaml', 'utf8')
// parse yaml
const workspaces = yaml.load(pnpmWorkspace) as { packages: string[] }

console.log(workspaces)
