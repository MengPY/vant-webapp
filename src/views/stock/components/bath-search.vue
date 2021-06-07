<template>
  <div>
    <van-popup
      position="right"
      v-model="bathModal.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <van-field label="仓库名称:" v-model="QueryForm.warehouseName" />
        <van-field label="公司平台:" v-model="QueryForm.ownerName" />
        <van-field label="商品描述:" v-model="QueryForm.productDesc" />
        <van-field label="物料编码:" v-model="QueryForm.mate" />
        <!-- <van-field label=":" v-model="QueryForm.directionFlag" /> -->
        <code-select
          :valueSet="directionList"
          label="是否有去向"
          nameKey="name"
          codeKey="key"
          @input="getValue"
          v-model="QueryForm.directionFlag"
        ></code-select>

        <choseCategory
          ref="child"
          @getCategoryId="getCateId"
          v-model="QueryForm.categoryId"
        ></choseCategory>
        <van-field label="业务部组:" v-model="QueryForm.departmentName" />
        <van-field label="SAP批次号:" v-model="QueryForm.sapBatchCode" />
        <van-field label="最终用户:" v-model="QueryForm.memberName" />
        <van-field label="销售订单号:" v-model="QueryForm.orderCode" />
        <van-field label="备注:" v-model="QueryForm.remark" />
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
    bathModal: {
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
        directionFlag: "",
        sapBatchCode: "",
        memberName: "",
        orderCode: "",
        remark: "",
      },
      directionList: [
        {
          key: "1",
          name: "是",
        },
        {
          key: "0",
          name: "否",
        },
      ],
    };
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    getCateId(value) {
      this.QueryForm.categoryId = value;
    },
    getValue(value) {
      this.QueryForm.directionFlag = value;
    },
    getData() {
      this.$parent.onSearch(this.QueryForm);
      this.bathModal.open = false;
    },
    reset() {
      this.$refs.child.resetData();
      this.QueryForm = this.$options.data().QueryForm;
      this.$parent.onSearch(this.QueryForm);
      this.bathModal.open = false;
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