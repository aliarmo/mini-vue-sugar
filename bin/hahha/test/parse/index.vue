<template>
  <div class="box">
    <span id="content">aaaaaaaaaaaaa</span>
    <TestComps></TestComps>
  </div>
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
