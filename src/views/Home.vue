<template>
  <div>
    <el-calendar v-model="value">
      <template #dateCell="{data}">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : '' }}
        </p>
      </template>
    </el-calendar>
  </div>
</template>

<script>

export default {
    data() {
      return {
        value: new Date()
      }
    },
    mounted () {

    },
    methods: {
     
    }
  }
</script>

<style>

</style>