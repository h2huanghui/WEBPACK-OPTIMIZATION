
// import React from 'react'
// import ReactDom from 'react-dom'
// import './index.css'
// import $ from 'jquery' //这个文件应该是CDN加载
// console.log($)

// class Count extends React.Component {
//     render() {
//         return (
//             <h1>Hello</h1>
//         )
//     }
// }

// ReactDom.render(<Count />,document.getElementById('root'))

import { minus } from './calc'
import d from './d'
console.log(d)
import './index.css' //如果引入css文件,需要增加他不是副作用,否则会被tree-shaking
import test from './test' //如果引入的变量没有被使用就删除
console.log(minus(1,1))