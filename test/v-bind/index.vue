<template>
  <div>
    <span
      :style="{fontSize:fontSize+'px'}"
      :data-username="username+'aaaaa'"
      class="username"
      :class="test"
      style="display:block;color:red"
    ></span>
    <div :key="item.id"></div>
    <view class="header" :class="{active:isActive}">aaaaaaa</view>
  </div>
</template>
