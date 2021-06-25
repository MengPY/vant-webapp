import socialDialog from "./post-social-dialog"
export default {
  name:"VularFormCard",
  props:{
    title:"附加信息",
  },
  children:[
    {
      name:"vular-input",
      props:{
        rules:"required",
        field:"category",
        vInput:{
          name:"VularToManySelect",
          props:{
            "prepend-icon":"mdi-shopping-search",
            label:"相关产品",
            multiple:true,
            chips:true,
            clearable:true,
            "vularId":"to-many-slect-1",
            "hide-no-data":true,
            "hide-details":true,
            queryAction:{
              "name" : "doAction",
              "api" : "/api/action",
              params : {
                actionName:"/Water/Vular/Actions/Query",
                modelName:"/Water/Vular/Model/Products",
              }
            },
          },
        },
      },
    },
    {
      name:"vular-input",
      props:{
        rules:"",
        field:"seo-dialog",
        vInput:{
          name:"VularHasOneDialog",
          props:{
            "icon":"mdi-trending-up",
            title:"搜索引擎优化",
          },
        },
      },
    },
    socialDialog,
  ]

}
