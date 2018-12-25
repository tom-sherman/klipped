const fse = require('fs-extra')
const path = require('path')

const TEMP_DIR = path.join(require('os').tmpdir(), 'klipped')

module.exports.saveTempFile = async ({ name = 'untitled.txt', data }) => {
  const filePath = path.join(TEMP_DIR, name)
  await fse.outputFile(filePath, data, { encoding: 'utf8' })
  return filePath
}

module.exports.renameTempFile = async ({ currentName, newName }) => {
  const currentPath = path.join(TEMP_DIR, currentName)
  const newPath = path.join(TEMP_DIR, newName)

  await fse.rename(currentPath, newPath)

  return newPath
}
