const install = (Vue) => {

	let requireComponents = require.context('./', false, /\.vue/);
	requireComponents.keys().forEach(componentPath => {
		let component = requireComponents(componentPath)
		let componentName = componentPath.replace(/(\.\/)|(\.vue)/g, '')
		Vue.component(componentName, component.default || component);
	})


}

export default install
