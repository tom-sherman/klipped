import { ipcRenderer } from 'electron'
import { Component } from 'react'

export class FileDraggable extends Component {
  handleDrag = event => {
    event.dataTransfer.effectAllowed = 'copy'
    event.preventDefault()
    ipcRenderer.send('ondragstart', this.props.filePath)
  }

  render () {
    return <span onDragStart={this.handleDrag} draggable={true}>{this.props.filePath}</span>
  }
}
