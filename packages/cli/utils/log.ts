import chalk from 'chalk'

const colors = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',

  // bg
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',
  'bgBlackBright',
  'bgRedBright',
  'bgGreenBright',
  'bgYellowBright',
  'bgBlueBright',
  'bgMagentaBright',
  'bgCyanBright',
  'bgWhiteBright',
] as const // as const 它告诉 TypeScript 将数组中的元素视为字面量类型，而不是普通的 string 类型。

type FuncKeys = typeof colors[number]

type Log = {
  [key in FuncKeys]: (...strs: any[]) => void
}

const log: Log = {} as Log

colors.forEach((item) => {
  log[item] = (...strs) => {
    console.log(chalk[item](...strs))
  }
})

export default log
