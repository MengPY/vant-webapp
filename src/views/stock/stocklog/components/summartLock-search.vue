<template>
  <div>
    <van-popup
      position="right"
      v-model="filterShow.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <van-field label="订单号:" v-model="QueryForm.orderNo" />
        <van-field label="业务单据号:" v-model="QueryForm.codeNo" />
        <dateSelect
          label="创建日期起:"
          v-model="QueryForm.createTimeStart"
        ></dateSelect>

        <dateSelect
          label="创建日期止:"
          v-model="QueryForm.createTimeEnd"
        ></dateSelect>
        <div class="search-btns">
          <van-button block type="info" native-type="submit">查询</van-button>
          <van-button block type="danger" native-type="button" @click="reset"
            >重置</van-button
          >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
import choseCategory from "@/components/choseCategory";
export default {
  components: {
    "chose-category": choseCategory,
  },
  props: {
    filterShow: {
      open: false,
    },
  },
  data() {
    return {
      QueryForm: {
        stockId: "",
        codeNo: "",
        orderNo: "",
        createTimeStart: "",
        createTimeEnd: "",
      },
    };
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    getValue(value) {
      this.QueryForm.categoryId = value;
    },
    getData() {
      this.$parent.onSearch(this.QueryForm);
      this.filterShow.open = false;
    },
    reset() {
      this.QueryForm = this.$options.data().QueryForm;
      this.$parent.onSearch(this.QueryForm);
      this.filterShow.open = false;
    },
  },
};
</script>
<style lang="less" scoped>
.search-btns {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>