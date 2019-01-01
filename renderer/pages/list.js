import { Component } from 'react'
import electron from 'electron'
import { FileList } from '../components/file-list'

export default class List extends Component {
  state = {
    error: null,
    files: []
  }

  async componentDidMount () {
    let files

    try {
      files = await resolveFileList()
    } catch (error) {
      console.error(error)
      this.setState({ error })
      return
    }

    this.setState({ files })
  }

  render () {
    return this.state.error
      ? <span>{this.state.error.message}</span>
      : <FileList files={this.state.files} />
  }
}

function resolveFileList () {
  return new Promise((resolve, reject) => {
    if (!electron.ipcRenderer) {
      return reject(null)
    }

    const { ipcRenderer } = electron

    ipcRenderer.on('file-list', (_, files) => resolve(files))
    ipcRenderer.send('list-files')
  })
}
