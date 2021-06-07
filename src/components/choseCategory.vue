<template>
  <div class="afterBittom">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="分类"
      placeholder="请选择分类"
      closeable
      @click="show = true"
    />
    <van-popup get-container="body" v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择分类"
        :options="options"
        @close="show = false"
        @change="onChange"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>
import stockApi from "@/api/stockManage";
export default {
  data() {
    return {
      show: false,
      fieldValue: "",
      cascaderValue: "",
      fatherId: "",
      categoryId: "",
      options: [
        {
          text: "浙江省",
          value: "330000",
          children: [],
        },
      ],
    };
  },
  mounted() {
    this.getTopData();
  },
  methods: {
    resetData() {
      this.fieldValue = "";
    },
    getTopData() {
      let params = {};
      stockApi.catQueryTopNew(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          this.options = dataInfo.data.map((item) => {
            return {
              text: item.categoryName,
              value: item.categoryId,
              children: [],
            };
          });
        }
      });
    },
    onChange({ value, selectedOptions, tabIndex }) {
      if (tabIndex == "0") {
        this.getMiddenCategory(value);
      } else {
        this.getSmallCategory(value);
      }
    },
    getSmallCategory(value) {
      let params = {
        categoryId: value,
        // catParentId: this.fatherId,
      };
      stockApi.catSearchQueryNew(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          this.options.forEach((item) => {
            if (item.value == this.fatherId) {
              item.children.forEach((itemChild) => {
                if (itemChild.value == value) {
                  itemChild.children = dataInfo.data.map((item) => {
                    return {
                      text: item.categoryName,
                      value: item.categoryId,
                    };
                  });
                }
              });
            }
          });
        }
      });
    },
    getMiddenCategory(value) {
      let params = {
        categoryId: value,
      };
      this.fatherId = value;
      stockApi.catSearchQueryNew(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          this.options.forEach((item) => {
            if (item.value == value) {
              item.children = dataInfo.data.map((item) => {
                return {
                  text: item.categoryName,
                  value: item.categoryId,
                  children: [],
                };
              });
            }
          });
        }
      });
    },
    onFinish({ selectedOptions }) {
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      this.categoryId = selectedOptions[2].value;
      this.$emit("getCategoryId", this.categoryId);
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
</style>