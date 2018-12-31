const fse = require('fs-extra')
const path = require('path')
const uuid = require('uuid/v1')
const os = require('os')

module.exports.KlipFile = class {
  constructor ({
    name,
    dir,
    data = null,
    id = uuid()
  }) {
    /** @type {string} */
    this.name = name
    this._dir = dir
    this.data = data
    this.id = id
  }

  get path () {
    return path.join(this._dir, this.id, this.name)
  }

  async save () {
    fse.outputFile(this.path, data, { encoding: 'utf8' })
  }

  async rename (newName) {
    const newPath = path.join(this._dir, this.id, newName)
    await fse.rename(this.path, newPath)
    this.name = newName
  }

  async update (newData) {
    if (!this.saved) {
      throw new Error(`File at ${ this.path } has not been saved.`)
    }
    fse.outputFile(this.path, newData, { encoding: 'utf8' })
    this.data = newData
  }

  async getName () {
    const fileDir = path.join(this.dir, this.id)
    const [ name ] = await fse.readdir(fileDir)
    this.name = name
    return name
  }

  static isValidId (string) {
    const reUuidv1 = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    return reUuidv1.test(string)
  }
}
