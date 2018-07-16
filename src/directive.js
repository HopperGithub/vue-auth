const ctx = '@@authedContext';

function remove (el, vnode) {
    // replace HTMLElement with comment node
    const comment = document.createComment(' ');
    Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined,
    });
    vnode.elm = comment;
    vnode.text = ' ';
    vnode.isComment = true;
    vnode.context = undefined;
    vnode.tag = undefined;
    vnode.data.directives = undefined;

    if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment;
    }

    if (el.parentNode) {
        el.parentNode.replaceChild(comment, el);
    }
    // delValue(vnode);
}

function getvalue (vnode) {
    const el = vnode.elm.parentNode;
    return el && el.dataset && el.dataset.authcode;
}

function delValue (vnode) {
    const el = vnode.elm.parentNode;
    if (el && el.dataset && el.dataset.authcode) {
        delete el.dataset.authcode;
    }
}

function doBind (el, binding, vnode) {
    const m = binding.modifiers;
    let exp;

    if ((!m || Object.keys(m).length === 0 || m.if) && binding.value) {
        vnode.elm.parentNode.dataset.authcode = binding.value;
        exp = !vnode.context.$auth.is(binding.value);
    } else if (m.else) {
        const value = binding.value || getvalue(vnode);
        exp = vnode.context.$auth.is(value);
    }

    if (exp) {
        remove(el, vnode);
    }
}
/**
 * v-auth
 * @desc 判断是否有权限
 * @example
 * ```vue
 * <div v-auth="'xxx-code'">aaa</div>
 * <div v-auth.else>bbb</div>
 * ```
 */

export default {
    bind (el, binding, vnode) {
        // doBind(el, binding, vnode);
    },
    inserted (el, binding, vnode) {
        doBind(el, binding, vnode);
    },
    update (el, binding, vnode) {
        doBind(el, binding, vnode);
        vnode.context.$parent.$forceUpdate();
    },
    unbind (el, binding, vnode) {
        delValue(vnode);
    }
};
