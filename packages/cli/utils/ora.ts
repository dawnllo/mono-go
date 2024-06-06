import ora from 'ora'
import { log } from './log'

export async function oraWrapper(cb, param?, start = log._yellow('loading...'), end = log._green('success')) {
  const spinner = ora(start).start()
  let result
  cb && (result = await cb(param))
  spinner.succeed(end)
  return result
}
