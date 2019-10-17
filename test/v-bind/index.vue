<template>
  <div class="mod_box _short_video">
    <div
      class="short-video-container"
      :style="{
        top: top + 'px',
        left: left + 'px',
        display: isShowPlayer ? 'block' : 'none'
      }"
    >
      <TxvPlayer v-if="vid" :vid="vid"></TxvPlayer>
    </div>
  </div>
</template>

