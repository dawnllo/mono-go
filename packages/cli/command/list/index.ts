import { cwd } from 'node:process'
import { download, generateCatalog, http, log, oraWrapper, pro } from '../../utils'

export default async function getListAction() {
  const config = {
    owner: 'Dofw',
    repo: 'vs-theme',
    type: _Global.GitFetchType.trees,
    sha: 'master',
    recursive: false,
  }

  const json = await oraWrapper(async () => {
    const res = await http.git(config)
    return await res.json()
  })

  const catalog = generateCatalog(json.tree)

  // 重命名使用
  let select: any = []
  const choices = catalog.map((item) => {
    return {
      title: item.path,
      value: {
        url: item.url,
        path: item.path,
        size: item.size,
        type: item.type,
        sha: item.sha,
      } as _Global.CatalogItem,
    }
  })
  const suggest = async (input, choices) => {
    return choices.filter((choice) => {
      return choice.title.toLowerCase().includes(input.toLowerCase())
    })
  }
  const onState = (state) => {
    select = state.value.filter((element) => {
      return element.selected
    })
  }

  const step1 = await pro.autoMultiselect(choices, '', suggest, onState)

  const downloadPath = `${cwd()}/template`
  const step2 = step1.selects?.length > 0
    ? await pro.confirm(`Download path: ${downloadPath}
  can you confirm ?`)
    : { confirm: false }

  const validate = (input) => {
    if (input.trim() === '')
      return true
    const inputArr = input.split(',')
    return inputArr.length === select.length ? true : 'Keep the mapping relationship with the selected!'
  }
  const step3 = step2.confirm ? await pro.list(validate) : { names: [] }

  // 交互结果
  const result = {
    ...step1,
    ...step2,
    ...step3,
  }

  const { selects, confirm, names } = result
  if (!confirm)
    return log.green('download canceled!')

  // 重命名
  const renameMap = selects.map((file, index) => {
    return {
      ...file,
      path: names[index]?.trim() || file.path,
    }
  })

  // 下载
  for (const fileOption of renameMap)
    dowanloadFunc(fileOption)

  async function dowanloadFunc(fileOption) {
    const { type } = fileOption
    if (type === 'file') {
      await download.fileBlob(fileOption)
      return
    }
    if (type === 'dir')
      await download.trees(fileOption)
  }
}
