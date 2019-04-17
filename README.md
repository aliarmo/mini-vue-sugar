## Vue模板语法转小程序语法
此编译器将vue模板语法转化为小程序模板语法，让你可以用vue模板语法来写小程序，
如：v-for 转为 wx:for，@click.stop="handler"转换catchtap="handler"

## 为什么要做这个编译器
1. 像mpvue这些框架，加入了vue的运行时，很重，侵入性太强，再者说小程序的逻辑层本身就与vue类似，基本满足开发需要
2. 简单，只做编译，只要会写vue模板就行

## 不同点
1. v-bind:class="classObject"                // 注意区别，小程序平台认为classObject代表具体类名的字符串
2. v-bind:style="styleObject"                // 注意区别，小程序平台认为styleObject代表具体样式的字符串

## TODO-LIST
1. 美化生成的小程序模板，目前有很多空格，换行没有去掉
2. 如何组织代码，这个vue文件要放在哪里