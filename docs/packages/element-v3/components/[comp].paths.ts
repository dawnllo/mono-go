// packages/components/[pkg].paths.js
import fs from 'fs-extra'
import { packageCategoryMds } from '../../../utils/createPackageLinksSide'

export default {
  async paths() {
    const compoennts = await packageCategoryMds('element-v3', 'components')
    const compsPaths = compoennts.map((link) => {
      return {
        params: { comp: link.text },
        content: link._targetPath && fs.readFileSync(link._targetPath, 'utf-8'),
      }
    })
    return compsPaths
  },
}
