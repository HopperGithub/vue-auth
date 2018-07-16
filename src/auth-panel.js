export const authenticationProps = {
    name: String,
    code: String,
    type: String
}

function isComment (node) {
    return node.isComment && node.asyncFactory
}

export default {
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
        children = children.filter((c) => c.tag || isComment(c))
        /* istanbul ignore if */
        if (!children.length) {
            return
        }

        // warn multiple elements
        if (process.env.NODE_ENV !== 'production' && children.length > 2) {
            warn(
                '<authentication> can only contain a single or two elements.',
                this.$parent
            )
        }

        const code = this.code

        // warn invalid mode
        if (process.env.NODE_ENV !== 'production' && !code.length) {
            warn(
                '<authentication> string code length must &gt 0: ' + code,
                this.$parent
            )
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
}
