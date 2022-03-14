<template>
  <div>
    <div v-touch:swipe.left="swipeHandler">Mood</div>
  </div>
</template>

<script>
export default {
  name: 'TestSwipeEvent',
  methods: {
    swipeHandler () {
      console.log('always mood')
    }
  }
}
</script>

<style>

</style>
