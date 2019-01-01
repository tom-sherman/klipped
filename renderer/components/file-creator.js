import { Component } from 'react'
import Router from 'next/router'
import electron from 'electron'

export class FileCreator extends Component {
  state = {
    text: null,
    name: null
  }

  componentDidMount () {
    if (!electron.remote) {
      return
    }

    this.setState({ name: electron.remote.getGlobal('DEFAULT_FILE_NAME') })
  }

  handleTextChange = event => {
    this.setState({ text: event.target.value })
  }

  handleNameChange = event => {
    if (event.target.value) {
      this.setState({ name: event.target.value })
    } else {
      this.setState({ name: null })
    }
  }

  handleSubmit = () => {
    Router.push({
      pathname: '/file',
      query: {
        data: this.state.text,
        name: this.state.name
      }
    })
  }

  submitOnKeyPress = (event, { withControl = false } = {}) => {
    if (event.key !== '\n' && event.key !== 'Enter') {
      return
    }

    if (withControl && !event.ctrlKey) {
      return
    }

    this.handleSubmit()
  }

  render () {
    return (
      <>
        <textarea
          value={this.state.text || ''}
          onChange={this.handleTextChange}
          onKeyPress={e => this.submitOnKeyPress(e, { withControl: true })}
        ></textarea>
        <input
          type='text'
          value={this.state.name || ''}
          onChange={this.handleNameChange}
          onKeyPress={this.submitOnKeyPress}
        ></input>
        <button
          type='button'
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </>
    )
  }
}
