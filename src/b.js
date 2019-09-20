// import lodash from 'lodash' 
// import('jquery') //import() 也会进行代码分割
// console.log('a',lodash)

// import jquery from 'jquery'
// import 'lodash'
// console.log('b',jquery)
import $ from 'jquery'
import('lodash')
console.log($)
import d from './test'
console.log(d)