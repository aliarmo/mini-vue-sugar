let parse = require('../../modules/parse-content')
let fs = require('fs')

let content = fs.readFileSync('./index.vue', 'utf-8')

console.log(parse(content))