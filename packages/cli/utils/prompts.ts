import prompts from 'prompts'
import { log } from '../utils'

// confirm
interface PConfirm {
  confirm: boolean
}
export async function confirm(message?: string): Promise<PConfirm> {
  message = message || `file or directory already exists, rename?`
  return await prompts({
    type: 'toggle',
    name: 'confirm',
    message: log._yellow(message),
    initial: false,
    active: 'yes',
    inactive: 'no',
  })
}

// text
interface PText {
  name: string
}
export async function text(message?): Promise<PText> {
  message = message || 'please input'
  return await prompts({
    type: 'text',
    name: 'name',
    validate(input) {
      return !input ? log._yellow('name is required') : true
    },
    message,
  })
}

/**
 * 输入列表, 已 , 分割.
 * @param validate 可选, 一般需要和多选组合,保持重命名关系一一对应.
 * @param message 可选
 * @returns Promise<string[]>
 */
interface PList {
  names: string[]
}
export async function list(validate?, message?: string): Promise<PList> {
  message = message || log._yellow(`input rename and must separate with comma!`)
  validate = validate || (() => true)
  return await prompts({
    type: 'list',
    name: 'names',
    separator: ',',
    message,
    validate,
  })
}

// autocompleteMultiselect
interface PAutocompleteMultiselect {
  selects: any[]
}
export async function autoMultiselect(choices, message?, suggest?: (input, choices) => Promise<any[]>, onState?: (state: any) => void): Promise<PAutocompleteMultiselect> {
  suggest = suggest || (async (input, choices) => {
    return choices.filter((choice) => {
      return choice.title.toLowerCase().includes(input.toLowerCase())
    })
  })
  onState = onState || (() => {})
  message = message || 'please select'
  return await prompts({
    type: 'autocompleteMultiselect',
    name: 'selects',
    initial: 0,
    limit: 50,
    fallback: 'no match!',
    message,
    choices,
    suggest,
    onState,
  })
}
// 组合 confirm + text
async function confirm_text(confirmMsg?: string, textMsg?: string): Promise<PConfirm & PText> {
  const step1 = await confirm(confirmMsg)
  const step2 = step1.confirm ? await text(textMsg) : { name: '' }

  return {
    ...step1,
    ...step2,
  }
}

// 导出
interface Pro {
  confirm: (message?: string) => Promise<PConfirm>
  text: (message?: string) => Promise<PText>
  list: (validate?, message?: string) => Promise<PList>
  autoMultiselect: (choices, message?, suggest?: (input, choices) => Promise<any[]>, onState?: (state: any) => void) => Promise<PAutocompleteMultiselect>
  confirm_text: (confirmMsg?: string, textMsg?: string) => Promise<PConfirm & PText>
}

export const pro: Pro = {
  confirm,
  text,
  list,
  autoMultiselect,
  confirm_text,
}
