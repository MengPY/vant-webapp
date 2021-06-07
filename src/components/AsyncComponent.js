export default {
  name: 'AsyncComponent',
  props: {
    current: {
      type: String,
      value: ''
    }
  },
  computed: {
    renderComponent(){
      const findCom = parent => {
        const components = parent.$options.components;
        if(components[this.current]) {
          return components[this.current]
        } else if(parent.$parent) {
          return findCom(parent.$parent)
        }
      }
      return findCom(this.$parent)
    }
  },
  render(h) {
    return h(this.renderComponent, {
      props: {
        ...this.$attrs
      }
    })
  },
};