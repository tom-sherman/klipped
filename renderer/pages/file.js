import { Component } from 'react'
import electron from 'electron'
import { FileDraggable } from '../components/file-draggable'

export default class File extends Component {
  state = {
    error: null,
    filePath: null
  }

  static getInitialProps ({ query }) {
    return { name: query.name, data: query.data }
  }

  async componentDidMount () {
    let filePath
    const { name, data } = this.props

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

function resolveFilePath ({ data, name }) {
  return new Promise((resolve, reject) => {
    if (!electron.ipcRenderer) {
      return reject(null)
    }

    const { ipcRenderer } = electron

    ipcRenderer.send('data', { data, name })
    ipcRenderer.on('file', (_, filePath) => resolve(filePath))
    ipcRenderer.on('error', err => reject(err))
  })
}
