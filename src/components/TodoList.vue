<template>
  <div>
    <input type="text" v-model="state.value"> <button @click="add">add</button>
    <ul>
      <li v-for="(item, index) in state.list" :key="item.name"> {{ item.name }}  <button @click="del(index)">del</button>  </li>
    </ul>
  </div>
</template>

<script>
import { defineProps, reactive, ref } from 'vue'

defineProps({
  msg: String
})
export default {
  setup (props, context) {
    
    let { state, add, del } = useTodoList();

    return {
      state,
      add,
      del
    }
  }
}

function useTodoList () {
  const state = reactive({
    value: '',
    list: []
  })
  
  const add = () => {
    state.list.push({ name: state.value })
  }

  const del = (i) => {
    state.list.splice(i, 1)
  }
  
  return {
    state,
    add,
    del
  }
}



</script>

<style scoped>
a {
  color: #42b983;
}
ul, li {
  list-style: none;
}
</style>
