


const elementMap = {
    div: { tag: 'view' },
    span: { tag: 'view' },
    p: { tag: 'view' },
    header: { tag: 'view' },
    main: { tag: 'view' },
    footer: { tag: 'view' },
    ul: { tag: 'view' },
    li: { tag: 'view' },
    ol: { tag: 'view' },
    pre: { tag: 'view' },
    h1: { tag: 'view' },
    h2: { tag: 'view' },
    h3: { tag: 'view' },
    h4: { tag: 'view' },
    h5: { tag: 'view' },
    h1: { tag: 'view' },

    // 特殊标签,如：navigator和a标签的属性怎么对应，这里需要特殊处理
    a: {
        tag: 'navigator',
        attrs: { href: 'url' }
    },
    img: {
        tag: 'image'
    },

    template: { tag: 'block' },

    // 表单
    input: { tag: 'input' },
}

const specialElement = ['a']
// 自闭合标签主要是这两个
const selfClose = ['input', 'img']

module.exports = {
    elementMap, specialElement, selfClose
}