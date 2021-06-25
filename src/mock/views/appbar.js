export default[
  {
    name:'v-btn',
    props:{
      icon:true,
      href:'https://github.com/vularsoft/vular-admin',
      target:"_blank"
    },
    children:[
      {
        name:'v-icon',
        props:{
          medium:true,
        },
        text:'mdi-github',
      }
    ]
  },
  {
    name:'VularNotifications',
    props:{
      globalField:"notifications",
      vularId:"notifications",
      "queryAction":{
        "name" : "doAction",
        "api" : "/api/action",
        params : {
          actionName:"/Water/Vular/Actions/Query",
          modelName:"/Water/Vular/Model/Notifications",
        }
      },
      "viewAction":{
        "name" : "doAction",
        "api" : "/api/action",
        params : {
          actionName:"/Water/Vular/Actions/View",
          modelName:"/Water/Vular/Model/Notifications",
        }
      },
      "viewAllAction":{
        name : "openPage",
        to:{
          name: 'page', 
          params: { 
            pageId: 'water-vualr-view-notification-list',
            moduleId:'notifications', 
          }
        },
      },
    }
  },
  {
    name:'VularAppbarAccount',
    props:{
      user: {
        avatar:"/images/100.jpg",
      },
    }
  }
]