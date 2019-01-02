import { Component } from 'react'
import electron from 'electron'
import { withRouter } from 'next/router'
import { FileDraggable } from '../components/file-draggable'

class File extends Component {
  state = {
    error: null,
    file: {
      name: null,
      id: null,
      path: null
    }
  }

  async componentDidMount () {
    let file
    const { name, data } = this.props.router.query

    if (!data) {
      this.setState({ error: new Error('No data found.') })
      return
    }

    try {
      if (name) {
        file = await resolveFile({ data, name })
      } else {
        file = await resolveFile({ data })
      }
    } catch (err) {
      console.error(err)
      this.setState({ error: err })
      return
    }

    this.setState({ file })
  }

  render () {
    return this.state.error
      ? <span>{this.state.error.message}</span>// <Error statusCode={500} /> // TODO: Custom error component
      : <FileDraggable filePath={this.state.file.path} name={this.state.file.name} />
  }
}

export default withRouter(File)

function resolveFile ({ data, name }) {
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
