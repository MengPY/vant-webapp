<template>
  <div>
    <van-field
      readonly
      clickable
      :label="label"
      :value="valueName"
      placeholder="点击选择"
      @click="showPicker = true"
      clearable
    />
    <van-popup get-container="body" v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      >
      <!-- <div v-if="needFilter"> -->
        <van-field v-if="needFilter" v-model="filterText" style="width:60%;" slot="title"  placeholder="请输入查询" />
      <!-- </div> -->
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    valueSet: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    nameKey: {
      type: String,
      default: "itemName",
    },
    codeKey: {
      type: String,
      default: "itemCode",
    },
    needFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPicker: false,
      filterText: ''
    };
  },
  computed: {
    columns () {
      return this.valueSet.map((item) => item[this.nameKey]).filter(item => item.includes(this.filterText));
    },
    valueName() {
      let item = this.valueSet.find((item) => item[this.codeKey] == this.value);
      if (item) {
        return item[this.nameKey];
      } else {
        return "";
      }
    },
  },
  methods: {
    show() {
      this.showPicker = true;
    },
    onConfirm(name) {
      if (!name) {
        this.showPicker = false;
        return;
      }
      let code = this.valueSet.find((item) => item[this.nameKey] == name)[
        this.codeKey
      ];
      this.$emit("input", code);
      this.showPicker = false;
    },
  },
};
</script>

<style>
</style>