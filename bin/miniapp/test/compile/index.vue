<template>
  <view>
    <view class="header" :class="{active:isActive}">
      <view>我是头部</view>
      <view>{{username}}</view>
      <view>啦啦啦啦啦啦</view>
    </view>

    <view :data-name="username" @click="onClick">
      <view>{{password}}</view>
    </view>

    <TestComps @test="onTest">
      <template v-slot>
        <view>我是默认slot</view>
      </template>
      <template #header>
        <view>我是header slot</view>
      </template>
    </TestComps>
  </view>
</template>

<script>
import TestComps from "./tets.vue";
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
