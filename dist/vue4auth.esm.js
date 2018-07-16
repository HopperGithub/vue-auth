class Auth {
    constructor (options = {}) {
        this.options = options;
        this.is = options.is || (v => false);
    }
}

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

var directive = {
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

const authenticationProps = {
    name: String,
    code: String,
    type: String
};

function isComment (node) {
    return node.isComment && node.asyncFactory
}

var authentication = {
    name: 'auth-panel',
    props: authenticationProps,
    abstract: true,

    render (h) {
        let children = this.$options._renderChildren;
        const warn = console.warn;

        if (!children) {
            return
        }

        // filter out text nodes (possible whitespaces)
        children = children.filter((c) => c.tag || isComment(c));
        /* istanbul ignore if */
        if (!children.length) {
            return
        }

        // warn multiple elements
        if (process.env.NODE_ENV !== 'production' && children.length > 2) {
            warn(
                '<authentication> can only contain a single or two elements.',
                this.$parent
            );
        }

        const code = this.code;

        // warn invalid mode
        if (process.env.NODE_ENV !== 'production' && !code.length) {
            warn(
                '<authentication> string code length must &gt 0: ' + code,
                this.$parent
            );
        }

        // handle authentication code
        const { default: d, else: e } = this.$slots;

        if (this.$auth.is(code)) {
            return d[0];
        } else if (e && e.length) {
            return e[0];
        } else {
            return;
        }
    }
};

/*!
 * vue-auth <https://github.com/HopperGithub/vue-auth>
 *
 * Copyright (c) 2018-present, Hopper Sun.
 * Released under the MIT License.
 */

var install = function (Vue, opts = {}) {

    var auth = new Auth(opts);

    var is = auth.is;

    Vue.auth = auth;

    Object.defineProperty(Vue.prototype, '$auth', ({
        get: function () {
            auth.is = is.bind(this);

            return auth;
        }
    }));

    Vue.directive('auth', directive);
    Vue.component('auth-panel', authentication);
};


/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

var main = {
    install,
    Auth,
    directive
};

export default main;
