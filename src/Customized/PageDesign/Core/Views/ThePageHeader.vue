<template>
  <div 
    class="header-element"
  >
    <slot>
      <div class="layout-place-holder">{{$t('design.page-header')}}</div>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "the-page-header",
    components: {
    },
    props: {
    },

    data: () => ({
    }),

    methods: {
    }
  }
</script>

<style scoped>

</style>
