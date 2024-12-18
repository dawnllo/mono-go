// packages/components/[pkg].paths.js
import fs from 'fs-extra'
import { packageIndexMd } from '../../utils/createPackageLinksSide'

export default {
  async paths() {
    const indexArr = await packageIndexMd('element-v3')
    return indexArr.map((index) => {
      return {
        params: { index: 'index' },
        content: index._targetPath && fs.readFileSync(index._targetPath, 'utf-8'),
      }
    })
  },
}
