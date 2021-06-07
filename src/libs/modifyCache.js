// 销毁一次缓存
// 清空Main里面的的keep-alive :include="cachePage"
// cachePage内的值
// 创建人:黄宝
import store from '../store'

export default {
    data(){
        return { 
            timer: null,
            // judge: true,
            // index: null,
        }
    },
    clearCache(ComponentName){
        clearInterval(this.timer);
        //  console.log('未清除前',store.state.app.cachePage,store.state.app.cachePage.length);
        // store.state.app.cachePage.some((items, index) => {
            for (var i = store.state.app.cachePage.length ; i >= 0 ; i-- ) {
                if(store.state.app.cachePage[i]==ComponentName){
                    store.state.app.cachePage.splice(i,1)
                    // console.log('触发删除后:',store.state.app.cachePage);
                    
                }
            }
        // })setTimeout
        this.timer = setTimeout(() => {
            //判断是否还有
            if(store.state.app.cachePage.some((items, index) => {
                if(items==ComponentName){return true}else{return false}
            })){
                // console.log("还有！！！！！");
                this.clearCache(ComponentName)
            }else{
            store.state.app.cachePage.push(ComponentName)
            clearInterval(this.timer);
            this.timer=null
            // console.log(this.timer);
            }
            //  console.log('清除后',store.state.app.cachePage,store.state.app.cachePage.length);
        }, 500);
    }
}



// clearTimeout(this.timer);
// let dataArr = store.state.app.cachepage;
// store.state.app.cachepage = dataArr.filter(item => {return item != ComponentName});
// this.timer = setTimeout (() => {
//     store.state.app.cachePahe.push(ComponentName)
//     clearTimeout(this.timer);
// }, 500)