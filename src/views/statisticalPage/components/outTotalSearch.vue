<template>
  <div>
    <van-popup
      position="right"
      v-model="filterShow.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <code-select
          :valueSet="locationList"
          label="业务区域"
          nameKey="orgName"
          codeKey="orgId"
          @input="getVal"
          v-model="QueryForm.departmentRegionId"
        ></code-select>

        <code-select
          :valueSet="groupList"
          label="业务部组"
          nameKey="orgName"
          codeKey="orgId"
          @input="getDepVal"
          v-model="QueryForm.departmentId"
        ></code-select>
        <van-field
          label="客户名称:"
          v-model="QueryForm.memberName"
          v-if="type == '0'"
        />
        <van-field
          label="供应商名称:"
          v-model="QueryForm.supplierName"
          v-if="type == '1'"
        />
        <chose-category
          ref="child"
          @getCategoryId="getCateId"
          v-model="QueryForm.categoryId"
        ></chose-category>
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
import api from "@/api/statisticsManage";
import choseCategory from "@/components/choseCategory";
import codeSelect from "@/components/codeSelect";
export default {
  props: {
    filterShow: {
      open: false,
    },
    type: {
      type: String,
      default: "0",
    },
  },
  components: {
    "chose-category": choseCategory,
    "code-select": codeSelect,
  },
  data() {
    return {
      QueryForm: {
        supplierName: "",
        warehouseName: "",
        departmentId: "",
        departmentRegionId: "",
        memberName: "",
        categoryId: "",
      },
      locationList: [],
      groupList: [],
      showPicker: false,
    };
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  mounted() {
    this.getLocation();
    this.queryManageOrgList();
  },
  methods: {
    onConfirm(item) {},
    async queryManageOrgList() {
      let params = {};
      await api.queryManageOrgList(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success == true) {
          this.groupList = dataInfo.data;
        }
      });
    },
    getVal(value) {
      this.QueryForm.departmentRegionId = value;
    },
    getCateId(value) {
      this.QueryForm.categoryId = value;
    },
    getDepVal(value) {
      this.QueryForm.departmentId = value;
    },
    getValue(value) {
      this.QueryForm.categoryId = value;
    },
    getLocation() {
      // console.log(eval(localStorage.getItem("companyList"))[0].orgId);
      let params = {
        orgType: "30",
        parentOrgId: eval(localStorage.getItem("companyList"))[0].orgId,
      };
      api.queryChildOrg(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          this.locationList = dataInfo.data;
        }
      });
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