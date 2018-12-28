import { Component } from 'react'
import Link from 'next/link'

export class FileCreator extends Component {
  state = {
    text: '',
    name: ''
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

  render () {
    return (
      <>
        <textarea value={this.state.text} onChange={this.handleTextChange}></textarea>
        <input type='text' value={this.state.name || ''} onChange={this.handleNameChange}></input>
        <Link href={{ pathname: 'file', query: { data: this.state.text, name: this.state.name } }}>
          <a>Submit</a>
        </Link>
      </>
    )
  }
}
