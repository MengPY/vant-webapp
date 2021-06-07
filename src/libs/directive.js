import Vue from 'vue';

Vue.directive('noData', {
	bind (el, binding, vnode) {
		let imgDom = document.createElement('img');
		imgDom.className = 'noDataImg';
		el.style.position = 'relative'
		// el.style.display = 'none';
		el.style.height === '' ? el.style.height = '100%' : ''
		el.style.width === '' ? el.style.width = '100%' : ''
		imgDom.style.cssText = 'margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;height:80%;'
		imgDom.src = `./static/images/noData.png`;
		el.appendChild(imgDom);
		if (!binding.value) {
			el.style.display = 'none'
		} else {
			el.style.display = 'block'
		}
	},
	update (el, binding, vnode) {
		el.style.display = 'none'
		// console.log(binding.value);
		if (!binding.value) {
			el.style.display = 'none'
		} else {
			el.style.display = 'block'
		}
	}
})

Vue.directive('building', {
	bind (el, binding, vnode) {
		let imgDom = document.createElement('img');
		imgDom.className = 'noDataImg';
		el.style.position = 'relative'
		// el.style.display = 'none';
		el.style.height === '' ? el.style.height = '100%' : ''
		el.style.width === '' ? el.style.width = '100%' : ''
		imgDom.style.cssText = 'margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;height:50%;'
		imgDom.src = `./static/images/building.png`;
		el.appendChild(imgDom);
		if (!binding.value) {
			el.style.display = 'none'
		} else {
			el.style.display = 'block'
		}
	},
	update (el, binding, vnode) {
		el.style.display = 'none'
		// console.log(binding.value);
		if (!binding.value) {
			el.style.display = 'none'
		} else {
			el.style.display = 'block'
		}
	}
})

Vue.directive('preventReClick', {
	inserted (el, binding) {
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true;
				setTimeout(() => {
					el.disabled = false;
				}, binding.value || 2000);
			}
		});
	}
});

// view-design按钮loading
Vue.directive('buttonLoading', {
	inserted (el, binding, vnode) {
		el.addEventListener('click', () => {
			let { componentInstance } = vnode;
			if (!componentInstance.loading) {
				componentInstance.loading = true;
				setTimeout(() => {
					componentInstance.loading = false;
				}, (binding.value || 3) * 1000);
			}
		});
	},
});

//按钮权限控制
Vue.directive('has', {
	inserted (el, binding, vnode) {
		let menuCode = binding.value
		// console.log(menuCode)
		let btnList = window.localStorage.getItem('btnList')
		if (!btnList || btnList.length == 0) {
			el.parentNode.removeChild(el);
			return
		}
		btnList = JSON.parse(btnList)
		let isShow = false
		for (const btn of btnList) {
			if (trim(menuCode) == trim(btn.elementNo)) {
				isShow = true
				break
			}
		}
		if (!isShow)
			el.parentNode.removeChild(el);
	}
});
Vue.directive('repeatClick', {
	inserted (el, binding) {
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true
				setTimeout(() => {
					el.disabled = false
				}, binding.value || 6000)
			}
		})
	},
})

function trim (str) {
	return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
}