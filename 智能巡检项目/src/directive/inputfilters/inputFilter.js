import Vue from 'vue'

const addListener = function (el, type, fn) {
    el.addEventListener(type, fn, false);
}

const specialFilter = function (el) {
    addListener(el, 'keyup', () => {
        let expected = /[`～*~!#$%^&*()_\-+=<>?:"{}|,/;\\[\]·~！#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g;
        if (el.value.length >= 50) {
            Vue.prototype.tips = Vue.prototype.$message({
                showClose: true,
                message: "输入内容不能超过 50 个字符",
                type: 'error'
            });
        }

        if (expected.test(el.value)) {
            Vue.prototype.tips = Vue.prototype.$message({
                showClose: true,
                message: "不能出现特殊字符",
                type: 'error'
            });
        }

        el.value = el.value.replace(expected, "").substring(0, 50);
    });
}

export default {
    bind(el, binding) {
        if (el.tagName.toLowerCase() !== 'input') {
            el = el.getElementsByTagName('input')[0];
        }
        switch (binding.arg) {
            case 'special':
                specialFilter(el);
                break;
            default:
                break;
        }
    }
}