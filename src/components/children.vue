<template>
  <div ref="el">子组件</div>
</template>

<script>
export default {
  data() {
    return {
      hd: '子组件数据渲染',
      timeId: null,
    }
  },
  // beforeCreate() {
  //   console.log(`子组件的beforeCreate` + this.hd)
  //   // console.log(this.$refs.el)
  // },
  created() {
    this.timeId = setInterval(() => {
      // console.log('吃粑粑')
    }, 1000)
  },

  beforeUnmount() {
    console.log('beforeUnmount')
  },
  destroyed() {
    clearInterval(this.timeId)
    console.log('unmounted不好使了,得用destroyed')
  },
}
</script>

<style></style>
