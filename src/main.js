
import React from 'react'
import ReactDom from 'react-dom'
import './index.css'
import $ from 'jquery' //这个文件应该是CDN加载
console.log($)

class Count extends React.Component {
    render() {
        return (
            <h1>Hello</h1>
        )
    }
}

ReactDom.render(<Count />,document.getElementById('root'))