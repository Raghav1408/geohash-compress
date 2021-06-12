import fs from 'fs'
import { dirname as getDirName } from 'path'

export const writeFile = (file, content) => {
  const dir = getDirName(file)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(file, content)
}
