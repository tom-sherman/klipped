import { Component } from 'react'
import electron from 'electron'
import { withRouter } from 'next/router'
import { FileDraggable } from '../components/file-draggable'

class File extends Component {
  state = {
    error: null,
    filePath: null
  }

  async componentDidMount () {
    let filePath
    const { name, data } = this.props.router.query

    if (!data) {
      this.setState({ error: new Error('No data found.') })
    }

    try {
      if (name) {
        filePath = await resolveFilePath({ data, name })
      } else {
        filePath = await resolveFilePath({ data })
      }
    } catch (err) {
      console.error(err)
      this.setState({ error: err })
      return
    }

    this.setState({ filePath })
  }

  render () {
    return this.state.error
      ? <span>{this.state.error.message}</span>// <Error statusCode={500} /> // TODO: Custom error component
      : <FileDraggable filePath={this.state.filePath} name={this.props.name} />
  }
}

export default withRouter(File)

function resolveFilePath ({ data, name }) {
  return new Promise((resolve, reject) => {
    if (!electron.ipcRenderer) {
      return reject(null)
    }

    const { ipcRenderer } = electron

    ipcRenderer.send('newfile', { data, name })
    ipcRenderer.on('file', (_, filePath) => resolve(filePath))
    ipcRenderer.on('error', err => reject(err))
  })
}
