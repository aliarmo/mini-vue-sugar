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
