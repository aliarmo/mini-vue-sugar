<template>
  <div>
    <TestComps>
      <template #header>
        <p>我是header slot</p>
      </template>
      <template #middle>
        <p>我是middle slot</p>
      </template>
    </TestComps>

    <TestComps>
      <p>我是头部default slot</p>
    </TestComps>
  </div>
</template>
