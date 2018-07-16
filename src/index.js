/*!
 * vue-auth <https://github.com/HopperGithub/vue-authed>
 *
 * Copyright (c) 2018-present, Hopper Sun.
 * Released under the MIT License.
 */

'use strict';

import Auth from './auth';
import directive from './directive';
import authentication from './auth-panel';

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

export default {
    install,
    Auth,
    directive
};