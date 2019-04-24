<template>
  <div>
    <span v-show="username" style="color:red;font-size:16px"></span>
    <span v-show="username" style="color:red;font-size:16px" :style="styleObj"></span>
    <span v-show="username" style="color:red;font-size:16px" :style="{width:width}"></span>
    <span v-show="true"></span>
    <span v-show="'啦啦啦啦啦啦'"></span>
  </div>
</template>
