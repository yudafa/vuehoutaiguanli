<template>
  <div>
    <p>Using text interpolation: {{ rawHtml }}</p>
    <div><span v-html="rawHtml"></span></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: 123,
    }
  },
}
</script>

<style></style>
