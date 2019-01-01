const fse = require('fs-extra')
const { KlipFile } = require('./klip-file')

module.exports.KlipStore = class {
  constructor ({ dir, defaultName }) {
    this.dir = dir
    this.defaultName = defaultName
    /** @type {Map<string, KlipFile>} */
    this._store = new Map()
  }

  async init () {
    const dirEnts = await fse.readdir(this.dir, { withFileTypes: true })
    const files = dirEnts
      .filter(dirEnt => dirEnt.isDirectory() && KlipFile.isValidId(dirEnt.name))
      .map(dirEnt => new KlipFile({ id: dirEnt.name, dir: this.dir }))

    const names = await Promise.all(files.map(file => file.getName()))

    for (const file of files) {
      this._store.set(file.id, file)
    }
  }

  async addFile (options) {
    let file
    if (options instanceof KlipFile) {
      file = options
    } else {
      const data = options.data
      const name = options.name || this.defaultName
      file = new KlipFile({ name, data, dir: this.dir })
    }
    await file.save()
    this._store.set(file.id, file)
    return file
  }

  async removeFile (id) {
    if (!this._store.has(id)) {
      throw new Error(`File with id of ${ id } is not in the store.`)
    }

    await fse.remove(this._store.get(id).path)
    this._store.delete(id)
  }

  async renameFile ({ id, newName }) {
    if (!this._store.has(id)) {
      throw new Error(`File with id of ${ id } is not in the store.`)
    }

    return this._store.get(id).rename(newName)
  }

  async clear () {
    await fse.emptyDir(this.dir)
    this._store.clear()
  }

  serialize () {
    const list = Array.from(this._store.values()).map(file => file.serialize())
    return list
  }
}
