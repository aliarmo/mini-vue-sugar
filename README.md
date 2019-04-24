## Vue模板语法转小程序语法
此编译器将vue模板语法转化为小程序模板语法，让你可以用vue模板语法来写小程序，
如：v-for 转为 wx:for，@click.stop="handler"转换catchtap="handler"
通过编译并watch项目下所有的.vue文件，在.vue文件同目录下生成小程序所需.js、.wxml、.wxss、.json文件，
注意：**script里面的js还是要按小程序方式来写，因为并没有引入vue的运行时**

## 为什么要做这个编译器
1. 像mpvue这些框架，加入了vue的运行时，很重，侵入性太强，再者说小程序的逻辑层本身就与vue类似，基本满足开发需要
2. 简单，只做编译，只要会写vue模板就行

## 用法一，开启一个新项目
1. npm i mini-vue-sugar -g
2. sugar i 或者 sugar init   // 会生成一个默认叫miniapp小程序项目，也可指定名称 sugar i my-project
3. cd miniapp
4. 在vue文件里面写模板，js，style，如：
    ```vue
    <template>
        <div>
            <span v-for="(list,index) in lists" :key="index">{{list.title}}</span>

            <p v-if="type==1"></p>
            <p v-else-if="type==2"></p>
            <p v-else></p>
            
            <span v-show="isTrue></span>

            <div class="header" :class="{active:isActive}">
                <div>{{username}}</div>
            </div>

            <div :data-name="username" @click="onClick">
                <div>{{password}}</div>
            </div>

            <TestComps @test="onTest">
                <template v-slot>
                    <div>我是默认slot</div>
                </template>
                <template #header>
                    <div>我是header slot</div>
                </template>
            </TestComps>
        </div>
    </template>

    <script>
        import TestComps from './test.vue'    // **引入自定义组件，会自动生成json文件的usingComponents配置**
        import TestComps from '/component/test1/test1.vue'

        let app=getApp()
        import utils from '../modules/utils'   // 引入模块js
        
        // **注意js的写法还是按小程序的写法来写，编译器只做模板编译，不改变运行时**，除引入的自定义组件会被用于生成.json文件外，
        // 其他的都不会变
        Compoennt({
            data() {
                return {
                username: "aliarmo",
                password: "123"
                };
            }
        });
    </script>

    <style>
        .box {
            color: #123123;
            font-size: 12px;
            width: 100px;
            height: 200px;
            margin: 20px;
        }
        .content {
            display: inline-block;
            padding: 12px;
        }
    </style>

    ```
5. sugar    // 会编译并watch所有.vue文件，最终在.vue的同目录下生成小程序所需的.js、.wxml、.wxss、.json文件

## 用法二，接入已存在项目
1. npm i mini-vue-sugar -g
2. 切换到已存在项目目录下，执行 sugar
3. 新建.vue文件，写模板和业务逻辑，一保存你就会发现多出小程序所需的.js、.wxml、.wxss、.json文件

## 原理
1. 依次读取每个.vue文件，然后解析文件里面的template，script，style
2. 对template，进行指令和事件绑定转化，最后进行元素转化，生成.wxml文件，如果原来有.wxml会覆盖
3. 对script，解析import进来的组件，生成小程序所需的.json配置文件，如果原来有.json，会进行merge，去除import组件的代码，生成.js文件，如果原来有js文件，会覆盖，注意：**剩余的script写法还是要按小程序的方式来写，因为并没有引入vue的运行时**
4. 对style，直接生成.wxss文件，如果原来有.wxss文件，会覆盖
5. 监测.vue文件变动，重复1-4步骤

## 不同点
1. v-bind:class="classObject"                // 注意区别，小程序平台认为classObject代表具体类名的字符串
2. v-bind:style="styleObject"                // 注意区别，小程序平台认为styleObject代表具体样式的字符串
3. .vue文件的script模块要按小程序方式来写，因为并没有引入vue的运行时,组件还是通过import方式引入，编译器会解析引入的组件，然后自动生成.json里面的usingComponents配置

## tips
1. 可能有同学发现了，项目发布的时候并不需要这个.vue文件，那这个文件会不会被上传了呢，这个不需要担心，.vue文件不会被小程序IDE打包上传

## TODO-LIST
1. 美化生成的小程序模板，目前有很多空格，换行没有去掉
2. 解析出的js添加v-model等的实现，需要的同学提issue，我会考虑实现，这里可想象空间还很多