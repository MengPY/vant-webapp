export default {
  name:"VularFormCard",
  props:{
    title:"基本信息",
  },
  children:[
    {
      name:"vular-input",
      props:{
        rules:"required|max:50",
        field:"title",
        vInput:{
          name:"v-text-field",
          props:{
            label:"标题",
            outlined:true,
            dense:true,
            "prepend-icon":"mdi-format-title",
          },
        },
      },
    },
    {
      name:"vular-input",
      props:{
        rules:"required",
        field:"slug",
        vInput:{
          name:"v-text-field",
          props:{
            label:"Slug",
            outlined:true,
            dense:true,
            "prepend-icon":"mdi-identifier",
          },
        },
      },
    },

    {
      name:'v-row',
      children:[
        {
          name:'v-col',
          props:{
            md:'6',
          },
          children:[
            {
              name:"vular-input",
              props:{
                rules:"",
                field:"auther",
                vInput:{
                  name:"v-text-field",
                  props:{
                    label:"作者",
                    outlined:true,
                    dense:true,
                    "prepend-icon":"mdi-account-outline",
                  },
                },
              },
            },

          ]
        },
        {
          name:'v-col',
          props:{
            md:'6',
          },
          children:[
            {
              name:"vular-input",
              props:{
                rules:"required",
                field:"create_at",
                vInput:{
                  name:"v-text-field",
                  props:{
                    label:"创作时间",
                    type:"date",
                    outlined:true,
                    dense:true,
                    "prepend-icon":"mdi-calendar",
                  },
                },
              },
            },

          ]
        }
      ]
    },

    {
      name:'v-row',
      children:[
        {
          name:'v-col',
          props:{
            md:'6',
          },
          children:[
            {
              name:"vular-input",
              props:{
                rules:"",
                field:"source",
                vInput:{
                  name:"v-text-field",
                  props:{
                    label:"来源",
                    outlined:true,
                    dense:true,
                    "prepend-icon":"mdi-semantic-web",
                  },
                },
              },
            },

          ]
        },
        {
          name:'v-col',
          props:{
            md:'6',
          },
          children:[
            {
              name:"vular-input",
              props:{
                rules:"required",
                field:"source_url",
                vInput:{
                  name:"v-text-field",
                  props:{
                    label:"来源网址",
                    outlined:true,
                    dense:true,
                    "prepend-icon":"mdi-file-link-outline",
                  },
                },
              },
            },

          ]
        }
      ]
    },

    {
      name:"vular-input",
      props:{
        rules:"required",
        field:"summary",
        vInput:{
          name:"v-textarea",
          props:{
            label:"简介",
            outlined:true,
            dense:true,
            "prepend-icon":"mdi-card-text-outline",
          },
        },
      },
    },

    {
      name:"vular-input",
      props:{
        rules:"required",
        field:"tags",
        vInput:{
          name:"v-combobox",
          props:{
            label:"标签",
            "prepend-icon":"mdi-tag-multiple-outline",
            outlined:true,
            dense:true,
            multiple: true,
            hint:"可添加多个标签，回车分割",
            attach: true,
            chips: true,
            items:['foo', 'bar', 'fizz', 'buzz'],
          },
        },
      },
    },
  ],
}