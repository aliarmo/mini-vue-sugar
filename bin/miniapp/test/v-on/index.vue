<template>
  <div>
    <div>
      <p>good case</p>
      <div @click.prevent="onClick"></div>
      <div @click.stop="onClick"></div>
      <div @touchstart="touchstart"></div>
      <div @touchmove="onTouchMove"></div>
      <div @touchend="touchend"></div>
      <div @longtouch="longtouch"></div>
      <div @longtouch="longtouch"></div>
      <TestComps @test="onTest"></TestComps>
    </div>
    <div>
      <p>bad case</p>
      <div @click="onClick('t')"></div>
    </div>
  </div>
</template>
