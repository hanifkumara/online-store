<template>
  <div>
    <div class="top-color" />
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'Main'
}
</script>

<style scoped>
.top-color{
  background-color: #623863;
  width: 100%;
  height: 10px;
}
</style>
