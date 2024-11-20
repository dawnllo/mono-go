function repeatEmptyStr(num: number) {
  let str = ''
  for (let i = 0; i < num; i++)
    str += ' '
  return str
}

interface Tools {
  repeatEmptyStr: (...args: Parameters<typeof repeatEmptyStr>) => ReturnType<typeof repeatEmptyStr>
}

export const tools: Tools = {
  repeatEmptyStr,
}
