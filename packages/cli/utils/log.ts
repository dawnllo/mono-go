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
] as const

type FuncKeys = keyof typeof colors

interface Log {
  [key: FuncKeys]: (...strs: any[]) => void
}

const log: Log = {} as Log

colors.forEach((item) => {
  log[item] = (...strs) => {
    console.log(chalk[item](...strs))
  }
})

export default log
