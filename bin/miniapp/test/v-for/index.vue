<template>
  <div>
    <span v-for="(list,index) in lists" :key="index">{{list.title}}</span>
    <ul>
      <li v-for="(numer,index) in [12,34,45,56]" :key="index">{{number}}</li>
    </ul>
  </div>
</template>
