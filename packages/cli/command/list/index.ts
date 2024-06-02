import { cwd } from 'node:process'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import prompts from 'prompts'
import chalk from 'chalk'
import { download, generateCatalog, http, log, oraWrapper } from '../../utils'

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
  const promptsConfig = [{
    type: 'autocompleteMultiselect',
    name: 'files',
    instructions: false,
    message: 'please input filter keyword, then press enter to select!',
    choices: catalog.map((item) => {
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
    }),
    async suggest(input, choices) {
      return choices.filter((choice) => {
        return choice.title.toLowerCase().includes(input.toLowerCase())
      })
    },
    onState(state) {
      select = state.value.filter((element) => {
        return element.selected
      })
    },

    initial: 0,
    fallback: 'no template exists in this repository!',
  }, {
    type: (items) => {
      return (items && items.length > 0) ? 'toggle' : null
    },
    name: 'confirm',
    initial: false,
    clearFirst: true,
    active: 'yes',
    inactive: 'no',
    // TODO config rename template
    message: `${chalk.green('Download path:')}
    ${chalk.yellow(`${cwd()}/template`)}
    can you confirm download!`,
  }, {
    type: (confirm, prevs) => {
      return prevs.confirm ? 'list' : null
    },
    name: 'renames',
    separator: ',',
    message: `enter rename and must separate with comma!`,
    validate(input) {
      if (input.trim() === '')
        return true
      const inputArr = input.split(',')
      return inputArr.length === select.length ? true : 'Keep the mapping relationship with the selected!'
    },
  }]

  // 交互
  const result = await prompts(promptsConfig)

  const { files, confirm, renames } = result
  if (!confirm)
    return log.green('download canceled!')

  // 重命名
  const renameMap = files.map((file, index) => {
    return {
      ...file,
      path: renames[index]?.trim() || file.path,
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
