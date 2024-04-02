import path from 'node:path'
import chalk from 'chalk'
import ora from 'ora'

import * as file from '../core/file.js'
import config from '../core/config_remote.js'
import { http } from '../core/http.js'

/**
 * 解析template, ctx.src
 * 1. 本地只需要将src赋值。
 * 2. 远程需要先下载，然后将下载后的路径赋值给src。
 * @param {*} ctx 上下文
 */
export default async function parse(ctx) {
  // 1.本地
  const local = await isLocal(ctx.template)
  if (local) {
    ctx.src = local
    return
  }

  // 2.远端
  const remote = await isRemote(ctx.template)

  // 3.抛错
  if (!remote) {
    throw new Error(
      chalk.red(
        'ctx.template, is not comply with the rules of Local or Remote. ',
      ),
    )
  }

  // 4.下载
  const url = remote

  // 生成url 对应的 hash
  const hash = crypto.createHash('md5').update(url).digest('hex').substr(8, 16)

  // 拼接缓存路径
  ctx.src = path.join(config.paths.cache, hash)
  const exists = await file.isDirectory(ctx.src)

  // 设计为每次都获取新的。如果要使用缓存，添加参数
  if (ctx.options.offline) {
    if (exists) {
      // found cached template
      return console.log(
        `Using cached template: \`${file.tildify(ctx.src)}\`.`,
      )
    }
    console.log(`Cache not found: \`${file.tildify(ctx.src)}\`.`)
  }

  // 删缓存对应资源
  exists && (await file.remove(ctx.src))

  // 下载资源，保存在 ctx.src
  const spinner = ora('Downloading template...').start()
  // try {
  //   // 下载zip
  //   const temp = await http.download(url);
  //   // 解压到ctx.src
  //   await file.extract(temp, ctx.src, 1);
  //   // 删除zip
  //   await file.remove(temp);
  //   spinner.succeed("Download template complete.");
  // } catch (e) {
  //   spinner.stop();
  //   throw new Error(
  //     `Failed to pull \`${ctx.template}\` template: ${e.message}.`
  //   );
  // }
}

/**
 * 是否是local
 * @param {*} template
 * @returns dir or false
 * @example
 * 1. relative path, e.g. './foo', '../foo'
 * 2. absolute path, e.g. '/foo', 'C:\\foo'
 * 3. tildify path in windows, e.g. '~/foo'
 */
async function isLocal(template) {
  if (!/^[./]|^[a-zA-Z]:|^~[/\\]/.test(template))
    return false

  const localStr = path.resolve(file.untildify(template))
  const type = await file.exists(localStr)

  // 暂考虑dir
  if (type === 'dir') {
    return localStr
  }
  else {
    throw new Error(
      `Local template not found: \`${template}\` is not a directory`,
    )
  }
}

/**
 * 是否是remote
 * @param {*} template
 * 1. short name, e.g. 'nm'
 * 2. full name, e.g. 'zce/nm'
 * 3. with branch, e.g. 'zce/nm#next'
 * 4. full url, e.g. 'https://github.com/zce/nm/archive/master.zip'
 */
async function isRemote(template) {
  // 4
  if (/^https?:/.test(template))
    return template

  // 1.2.3
  if (
    /^https?:/.test(template)
    || /^https?:/.test(template)
    || /^https?:/.test(template)
  ) {
    const [fullname, maybeBranch] = template.split('#')
    const [maybeOwner, maybeName] = fullname.split('/')

    const isEmpty = input => input == null || input === ''

    const owner = isEmpty(maybeName) ? config.official : maybeOwner
    const branch = isEmpty(maybeBranch) ? config.branch : maybeBranch
    const name = isEmpty(maybeName) ? maybeOwner : maybeName

    const data = { owner, name, branch }

    // config.registry = "https://github.com/{owner}/{name}/archive/refs/heads/{branch}.zip"
    return config.registry.replace(/{(\w+)}/g, (_, key) => data[key])
  }

  return false
}
