import { ipcRenderer } from 'electron'
import { Component } from 'react'
import { FileDraggable } from '../components/file-draggable'
import Error from 'next/error'

export default class File extends Component {
  static async getInitialProps ({ query }) {
    let filePath

    try {
      if (query.name) {
        filePath = await resolveFilePath({ data: query.data, name: query.name })
      } else {
        filePath = await resolveFilePath({ data: query.data })
      }
    } catch (err) {
      console.error(err)
      return { error: 'Failed to save file.' }
    }

    return { filePath, data: query.data, name: query.name }
  }

  render () {
    return this.props.error
      ? <Error statusCode={500} /> // TODO: Custom error component
      : <FileDraggable filePath={this.props.filePath} name={this.props.name} />
  }
}

function resolveFilePath ({ data, name }) {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('data', { data, name })
    ipcRenderer.on('file', (_, filePath) => resolve(filePath))
    ipcRenderer.on('error', err => reject(err))
  })
}
