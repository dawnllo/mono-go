import { errorWrapper } from '@/common/error'
import { download, http, log, oraWrapper, pro, tools } from '@/utils/index'
import type { CatalogItem } from '@/types'
import { GitFetchEnum } from '@/utils/http'

let coutLevel = 0

/**
 * 查看件结构
 * @param configFile 配置文件
 * @param _args
 * @returns
 */

async function getListAction(configFile, _args?: any) {
  const [repPath, branch, { level }] = _args // level 默认为 3

  // 通过content获取目录时,如果传入path,那么第一层自动会带上path
  const config = {
    type: GitFetchEnum.contents,
    sha: repPath,
    branch,
  }

  const catalog = await oraWrapper(async () => {
    const json = await http.git(config)
    console.log(json)
    return await download.treeLayerCatalog(json, GitFetchEnum.contents, +level)
  })

  const choices = mapChoices(catalog, level)

  const suggest = async (input, choices) => {
    return choices.filter((choice) => {
      return choice.title.toLowerCase().includes(input.toLowerCase())
    })
  }

  const { selects } = await pro.autoMultiselect(choices, `show ${level} layer catalog.`, suggest)
  const selects2: ChoiceValue[] = selects || []

  if (selects2.length === 0)
    return

  log.yellow(`note: the path is relative to root of repository. selected:`)
  for (let i = 0; i < selects2.length; i++) {
    const element = selects2[i]!
    log.green(element.relativeInputPath)
  }
}

interface ChoiceItem {
  title: string
  value: {
    path: string
    type: string
    relativeInputPath: string
  }
}
type ChoiceValue = ChoiceItem['value']
function mapChoices(data: CatalogItem[], level) {
  const result: ChoiceItem[] = []

  for (let i = 0; i < data.length; i++) {
    const element = data[i]!
    const markStr = element.type === 'dir' ? '📂' : '📄'
    const relativeInputPath = element.relativeInputPath ? element.relativeInputPath : element.path

    result.push({
      title: `${tools.repeatEmptyStr(coutLevel * 3)}${markStr} ${element.path}`,
      value: {
        path: element.path,
        type: element.type,
        relativeInputPath,
      },
    })

    if (element.children && coutLevel < level - 1) {
      coutLevel++
      const childResult = mapChoices(element.children, level)
      coutLevel--
      result.push(...childResult)
    }
  }
  return result
}

export default errorWrapper(getListAction)
