export default {
  name : "vular-list-page",
  props : {
    title:'通知列表',
    titleIcon:'mdi-bell-outline',
    vularId : "notifications-list-1",
    defaultModel:{
      keywords:'',
      page:1,
      pagination:'',
      //fliters
      cagegory:'none',
      attribute:'none',
      readings:'none',
      status:'none',
    },
    "queryAction":{
      "name" : "doAction",
      "api" : "/api/action",
      params : {
        actionName:"/Water/Vular/Actions/Query",
        modelName:"/Water/Vular/Model/Notification",
      }
    },
    "canSelect" : true,
    "transshapeBreakPoint" : "sm",
    "batchActions" : [
      {
        "icon": "mdi-bell-sleep-outline",
        "title": "标为已读",
        "shortcut": true,
        "action": {
          "name" : "doAction",
          "api" : "/api/action",
          params : {
            actionName:"/Water/Vular/Actions/BatchDownload",
            modelName:"/Water/Vular/Model/Posts",
          }
        },
      },
      {
        "icon": "mdi-delete-sweep-outline",
        "title": "删除",
        "shortcut": true,
        "action": {
          "name" : "doAction",
          "api" : "/api/action",
          params : {
            actionName:"/Water/Vular/Actions/BatchDelete",
            modelName:"/Water/Vular/Model/Posts",
          }
        },
      },
    ],
    "rowActions":[
      {
        "icon": "mdi-eye-outline",
        "title": "查看",
        "shortcut": true,
        "action": {
          name:"openPage",
          to:{
            name: 'page', 
            params: { 
              pageId: 'water-vualr-view-notification',
            }
          },
        },
      },
      {
        "icon": "mdi-trash-can",
        "title": "删除",
        "shortcut": true,
        "action":"action_id4"
      }
    ],
    "filters":[
      {
        "title":"",
        "shortcut": true,
        "rules":{
          "read" : "未读",
          "unread" : "已读",
        },
        "blankTitle":"全部",
        "blankValue":"none",
        "field":"cagegory"
      },
    ],
    "columns":[
      {
        "field":"icon",
        "title": "",
        "width":"60px"
      },
      {
        "field":"title",
        "title": "标题",
        "width":"",
        "flex": "4" 
      },
      {
        "field":"created_at",
        "title": "时间",
        "width":"",
        "flex": "2"
      },
    ],
    "actionsColumn":{
      "width":"150px"
    }

  }
}