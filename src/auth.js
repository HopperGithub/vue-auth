export default class Auth {
    constructor (options = {}) {
        this.options = options;
        this.is = options.is || (v => false);
    }
}