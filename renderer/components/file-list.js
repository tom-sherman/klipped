import { Component } from 'react'
import { FileDraggable } from './file-draggable'
import electron from 'electron'

export class FileList extends Component {
  state = {
    files: this.props.files
  }

  componentWillReceiveProps (newProps) {
    this.setState({ files: newProps.files })
  }

  handleRemove = id => {
    const { files } = this.state
    const removeIndex = files.findIndex(file => file.id === id)
    files.splice(removeIndex, 1)
    // TODO: Persist to store on main thread
    this.setState({ files })
  }

  render () {
    return (<ul>
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

    ipcRenderer.send('add-file', { data, name })
    ipcRenderer.on('file-created', (_, file) => resolve(file))
    ipcRenderer.on('error', err => reject(err))
  })
}
