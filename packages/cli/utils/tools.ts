function repeatEmptyStr(num: number) {
  let str = ''
  for (let i = 0; i < num; i++)
    str += ' '
  return str
}

interface Tools {
  repeatEmptyStr: (num: number) => string
}

export const tools: Tools = {
  repeatEmptyStr,
}
