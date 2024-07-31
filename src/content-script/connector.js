
class PathfinderConnector {
    constructor() {
        this._id = 'D1R_connectExtension_b';

        document.addEventListener('D1R_connectExtension', (e) => {
            if (e && e.detail && e.detail.method) {
                const func = this._decodeFunction(e.detail.method);
                if (func) {
                    if (e.detail.args) {
                        return func(...e.detail.args);
                    }
                    func();
                } else {
                    console.warn(`Unknown function: ${e.detail.method}.`);
                }
            } else {
                console.warn('Unknown event on extension listener');
            }
        });

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
    new PathfinderConnector();
}, 0);

