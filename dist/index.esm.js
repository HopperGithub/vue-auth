var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var Auth = function Auth() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Auth);

    this.options = options;
    this.is = options.is || function (v) {
        return false;
    };
};

function remove(el, vnode) {
    // replace HTMLElement with comment node
    var comment = document.createComment(' ');
    Object.defineProperty(comment, 'setAttribute', {
        value: function value() {
            return undefined;
        }
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

function getvalue(vnode) {
    var el = vnode.elm.parentNode;
    return el && el.dataset && el.dataset.authcode;
}

function delValue(vnode) {
    var el = vnode.elm.parentNode;
    if (el && el.dataset && el.dataset.authcode) {
        delete el.dataset.authcode;
    }
}

function doBind(el, binding, vnode) {
    var m = binding.modifiers;
    var exp = void 0;

    if ((!m || Object.keys(m).length === 0 || m.if) && binding.value) {
        vnode.elm.parentNode.dataset.authcode = binding.value;
        exp = !vnode.context.$auth.is(binding.value);
    } else if (m.else) {
        var value = binding.value || getvalue(vnode);
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
    bind: function bind(el, binding, vnode) {
        // doBind(el, binding, vnode);
    },
    inserted: function inserted(el, binding, vnode) {
        doBind(el, binding, vnode);
    },
    update: function update(el, binding, vnode) {
        doBind(el, binding, vnode);
        vnode.context.$parent.$forceUpdate();
    },
    unbind: function unbind(el, binding, vnode) {
        delValue(vnode);
    }
};

var authenticationProps = {
    name: String,
    code: String,
    type: String
};

function isComment(node) {
    return node.isComment && node.asyncFactory;
}

var authentication = {
    name: 'auth-panel',
    props: authenticationProps,
    abstract: true,

    render: function render(h) {
        var children = this.$options._renderChildren;
        var warn = console.warn;

        if (!children) {
            return;
        }

        // filter out text nodes (possible whitespaces)
        children = children.filter(function (c) {
            return c.tag || isComment(c);
        });
        /* istanbul ignore if */
        if (!children.length) {
            return;
        }

        // warn multiple elements
        if (process.env.NODE_ENV !== 'production' && children.length > 2) {
            warn('<authentication> can only contain a single or two elements.', this.$parent);
        }

        var code = this.code;

        // warn invalid mode
        if (process.env.NODE_ENV !== 'production' && !code.length) {
            warn('<authentication> string code length must &gt 0: ' + code, this.$parent);
        }

        // handle authentication code
        var _$slots = this.$slots,
            d = _$slots.default,
            e = _$slots.else;


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

var install = function install(Vue) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var auth = new Auth(opts);

    var is = auth.is;

    Vue.auth = auth;

    Object.defineProperty(Vue.prototype, '$auth', {
        get: function get() {
            auth.is = is.bind(this);

            return auth;
        }
    });

    Vue.directive('auth', directive);
    Vue.component('auth-panel', authentication);
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

var main = {
    install: install,
    Auth: Auth,
    directive: directive
};

export default main;
