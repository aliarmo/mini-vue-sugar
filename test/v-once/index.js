let { deltOnce } = require('../../modules/directive')
let { normalize } = require('../../modules/normalize')
let { deltElement } = require('../../modules/element')

let fs = require('fs')

let template = fs.readFileSync('./index.vue', 'utf-8')

fs.writeFileSync('./index.wxml', deltElement(deltOnce(normalize(template))))