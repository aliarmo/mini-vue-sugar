let { compile } = require('../index')

let fs = require('fs')

let template = fs.readFileSync('./index.vue', 'utf-8')

fs.writeFileSync('./index.wxml', compile(template))