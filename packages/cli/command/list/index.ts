import { cwd } from 'node:process'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import prompts from 'prompts'
import chalk from 'chalk'
import { generateCatalog, http, log, oraWrapper } from '../../utils'

export default async function getListAction() {
  const config = {
    owner: 'Dofw',
    repo: 'vs-theme',
    type: _Global.GitFetchType.trees,
    branch: 'master',
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
        title: item.fileName,
        value: {
          url: item.url,
          fileName: item.fileName,
          size: item.size,
          type: item.type,
        },
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
    message: `${chalk.green('Download path:')}
    ${chalk.yellow(cwd())}
    can you confirm download!`,
  }, {
    type: (confirm, prevs) => {
      return prevs.confirm ? 'list' : null
    },
    name: 'renames',
    separator: ',',
    message: `enter rename and must separate with commas!`,
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
      fileName: renames[index]?.trim() || file.fileName,
    }
  })
  // 下载
  for (const fileOption of renameMap)
    oraWrapper(dowanloadSingle, fileOption)

  async function dowanloadSingle(fileOption) {
    const { url, fileName } = fileOption
    const res = await http.gitUrl(url)
    // 生成文件
    const filePath = `${cwd()}/${fileName}`
    const blob = await res.blob()
    // 将blob转换为 buffer
    const buf = Buffer.from(await blob.arrayBuffer())
    fs.writeFileSync(filePath, buf)
  }
}
