<template>
  <div>
    <div class="header" :class="{active:isActive}">
      <div>我是头部</div>
      <div>{{username}}</div>
      <div>啦啦啦啦啦啦</div>
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
import TestComps from "./tets3.vue";
import TestComps1 from "./tets2.vue";
import utils from "../modules/utils";
let app = getApp();

let isIOS = wx.getSystemInfoSync().system.match(/ios/i);

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
