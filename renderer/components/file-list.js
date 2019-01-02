import { Component } from 'react'
import { FileDraggable } from './file-draggable'
import electron from 'electron'

export class FileList extends Component {
  state = {
    files: this.props.files,
    error: null
  }

  componentWillReceiveProps (newProps) {
    this.setState({ files: newProps.files })
  }

  handleRemove = async id => {
    const { files } = this.state
    const removeIndex = files.findIndex(file => file.id === id)
    try {
      console.log('removing ' + id)
      await removeFile(id)
      console.log('removed ' + id)
      files.splice(removeIndex, 1)
      this.setState({ files })
    } catch (error) {
      console.error(error)
      this.setState({ error })
      return
    }
  }

  render () {
    return (this.state.error ? <span>{this.state.error.message}</span>
    : <ul>
      {this.state.files.map((file, i) => (
        <li key={i}>
          <FileDraggable filePath={file.path} />
          <button type='button' onClick={() => this.handleRemove(file.id)}>Remove</button>
        </li>
      ))}
    </ul>)
  }
}

async function removeFile (id) {
  return new Promise((resolve, reject) => {
    if (!electron.ipcRenderer) {
      return reject(null)
    }

    const { ipcRenderer } = electron

    ipcRenderer.send('remove-file', id)
    ipcRenderer.on('removed-file', (_, deletedId) => resolve(deletedId))
    ipcRenderer.on('error', err => reject(err))
  })
}
