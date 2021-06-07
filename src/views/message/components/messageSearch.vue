<template>
  <div>
    <van-popup
      position="right"
      v-model="filterShow.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <code-select
          :valueSet="valueSet.MESSAGE_TYPE"
          label="消息类型"
          nameKey="itemName"
          codeKey="itemCode"
          @input="getVal"
          v-model="QueryForm.eventCode"
        ></code-select>

        <van-field label="消息标题:" v-model="QueryForm.msgTitile" />
        <dateSelect
          label="消息日期起:"
          v-model="QueryForm.createDateBegin"
        ></dateSelect>

        <dateSelect
          label="消息日期止:"
          v-model="QueryForm.createDateEnd"
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
        msgType: "",
        createDateBegin: "",
        createDateEnd: "",
        msgTitile: "",
        eventCode: "",
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
    onConfirm(item) {
      debugger;
    },
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