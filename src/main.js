
import React from 'react'
import ReactDom from 'react-dom'
import './index.css'

class Count extends React.Component {
    render() {
        return (
            <h1>Hello</h1>
        )
    }
}

ReactDom.render(<Count />,document.getElementById('root'))