<template>
  <div>
    <van-popup
      position="right"
      v-model="filterShow.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <van-field label="仓库名称:" v-model="QueryForm.warehouseName" />
        <van-field label="公司平台:" v-model="QueryForm.ownerName" />
        <van-field label="商品描述:" v-model="QueryForm.productDesc" />
        <van-field label="物料编码:" v-model="QueryForm.mate" />
        <van-field label="业务部组:" v-model="QueryForm.departmentName" />
        <choseCategory
          @getCategoryId="getValue"
          ref="child"
          v-model="QueryForm.categoryId"
        ></choseCategory>
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
        categoryId: "",
        departmentName: "",
        mate: "",
        ownerName: "",
        productName: "",
        productDesc: "",
        warehouseName: "",
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
      this.$refs.child.resetData();
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