<template>
  <div class="container">
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  min-height: 100%;
}
.main {
  margin: 0 auto;
  padding: 20px;
  max-width: 1000px;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
</style>
