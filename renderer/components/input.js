import { Component } from 'react'

export class Input extends Component {
  static defaultProps = {
    placeholder: 'Type here...'
  }

  state = {
    value: this.props.initialValue
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  render () {
    return <textarea placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange}></textarea>
  }
}
