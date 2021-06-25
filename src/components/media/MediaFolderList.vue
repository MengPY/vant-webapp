<template>
  <v-list color="transparent">
      <v-list-item
        link
        @click="onClick('root')"
        v-model="selectRoot"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>mdi-folder-home-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="$t('media.root')"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-for="(item, i) in inputValue"
        :key="i"
        v-model="item.selected"
        @click="onClick(i)"
        color="primary"
        link
      >
        <v-list-item-icon>
          <v-icon>mdi-folder-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
  </v-list>
</template>

<script>
  export default {
    name: "media-folder-list",
    components: {
    },
    props: {
      value:{default:()=>{return []}},
    },

    data: () => ({
      
    }),

    computed:{
      inputValue: {
        get:function() {
          return this.value;
        },
        set:function(val) {
          this.$emit('input', val);
        },
      },

      selectRoot(){
        for(var i = 0; i < this.inputValue.length; i ++){
          if(this.inputValue[i].selected){
            return false
          }
        }

        return true
      }
    },

    mounted(){
    },

    methods: {
      onClick(index){
        for(var i = 0; i < this.inputValue.length; i ++){
          this.$set(this.inputValue[i], 'selected' ,i === index )
        }
      },
    }
  }
</script>
