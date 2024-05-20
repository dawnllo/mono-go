import log from '../../utils/log'

export default async function parse(ctx: _Global.Context) {
  try {
    const temp = await fetch('http://baidu.com')
    log.green(temp)
  }
  catch (e: any) {
    throw new Error(
      `Failed to pull \`${ctx.template}\` template: ${e.message}.`,
    )
  }
}

// async function isLocal(template) {
//   if (!/^[./]|^[a-zA-Z]:|^~[/\\]/.test(template))
//     return false

//   const localStr = path.resolve(file.untildify(template))
//   const type = await file.exists(localStr)

//   // 暂考虑dir
//   if (type === 'dir') {
//     return localStr
//   }
//   else {
//     throw new Error(
//       `Local template not found: \`${template}\` is not a directory`,
//     )
//   }
// }

// async function isRemote(template) {
//   // 4
//   if (/^https?:/.test(template))
//     return template

//   // 1.2.3
//   if (
//     /^https?:/.test(template)
//     || /^https?:/.test(template)
//     || /^https?:/.test(template)
//   ) {
//     const [fullname, maybeBranch] = template.split('#')
//     const [maybeOwner, maybeName] = fullname.split('/')

//     const isEmpty = input => input == null || input === ''

//     const owner = isEmpty(maybeName) ? config.official : maybeOwner
//     const branch = isEmpty(maybeBranch) ? config.branch : maybeBranch
//     const name = isEmpty(maybeName) ? maybeOwner : maybeName

//     const data = { owner, name, branch }

//     // config.registry = "https://github.com/{owner}/{name}/archive/refs/heads/{branch}.zip"
//     return config.registry.replace(/{(\w+)}/g, (_, key) => data[key])
//   }

//   return false
// }
