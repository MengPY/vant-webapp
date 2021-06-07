<template>
  <div>
    <van-field
      readonly
      clickable
      :label="label"
      :value="value"
      placeholder="点击选择"
      @click="showCalendar = true"
    />
    <van-calendar :min-date="minDate" :max-date="maxDate" get-container="body" v-model="showCalendar" @confirm="onConfirm" />
  </div>
</template>

<script>
export default {
  props: {
    minDate: {
      type: Date,
      default: () => {
        return new Date('1970-01-01') 
      }
    },
    maxDate: {
      type: Date,
      default: () => {
        return new Date('2099-12-12') 
      }
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      showCalendar: false
    }
  },
  computed: {

  },
  methods: {
    show () {
      this.showCalendar = true;
    },
    onConfirm (val) {
      // console.log(val)
      let dateStr = this.$utils.formatDate(val);
      this.$emit('input', dateStr);
      this.showCalendar = false;
    }
  }
}
</script>

<style>

</style>