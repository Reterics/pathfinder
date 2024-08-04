/**
 * @typedef {Object} D1RDetails
 * @property {string} method - Method to call as a string format like 'console.log' that will be decoded to window.console.log
 * @property {any[]} args - Function parameters/arguments for the method
 * @property {string|undefined} id
 * @property {any} result
 */

/**
 * @typedef {Object} D1REvent
 * @property {D1RDetails} detail - Message from the Extension (Popup or Background)
 * @property {'D1R_connectExtension'} type -
 */


class PFConnector {
    constructor() {
        this._id = 'D1R_connectExtension_b';

        document.addEventListener('D1R_connectExtension', this._handleRequest.bind(this));
    }

    /**
     * @param {D1REvent} e
     * @private
     */
    async _handleRequest(e) {
        if (!e || !e.detail || !e.detail.method) {
            console.warn('Unknown event on extension listener');
            return;
        }
        const func = this._decodeFunction(e.detail.method);

        if (!func) {
            console.warn(`Unknown function: ${e.detail.method}.`);
            return;
        }

        let result;
        if (e.detail.args) {
            result = await func(...e.detail.args);
        } else {
            result = await func();
        }

        if (e.detail.id) {
            e.detail.result = result;
            this.sendMessage(e.detail)
        }
    }

    _decodeFunction(path) {
        const pathParts = path.split('.');
        const func = pathParts.reduce((acc, part) => {
            return acc && acc[part];
        }, window);
        if (typeof func === 'function') {
            return func;
        }
        return null;
    }

    sendMessage(msg) {
        document.dispatchEvent(new CustomEvent(this._id, {
            detail: msg
        }));
    }
}

setTimeout(() => {
    new PFConnector();
}, 0);

