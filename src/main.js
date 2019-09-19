
// import React from 'react'
// import ReactDom from 'react-dom'
// import './index.css'
// import $ from 'jquery' //这个文件应该是CDN加载
// console.log($)

// class Count extends React.Component {
//     render() {
//         return (
//             <h1>Helloa</h1>
//         )
//     }
// }

// ReactDom.render(<Count />,document.getElementById('root'))

// import { minus } from './calc'
// import d from './d'
// console.log(d)
// import './index.css' //如果引入css文件,需要增加他不是副作用,否则会被tree-shaking
// import test from './test' //如果引入的变量没有被使用就删除
// console.log(minus(1,1))
// let button = document.createElement('button')

// button.addEventListener('click', () => {
//     //草案语法 
//     //动态加载 类似于路由懒加载 import()语法-结果是一个promise
//     //webpack遇到这种语法,会使用jsonp动态加载这个calc文件
//     //import()这种语法可以实现代码分割 0.bundle.js
//     import(/* webpackChunkName:'video' */'./calc').then(data => {
//         console.log(data.sum(1,7))
//     })
// })
// button.innerHTML = 'Click Me'
// document.body.appendChild(button)

//需要实现多入口
