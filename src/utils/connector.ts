import {PFCMessage, PFCMessageEvent} from "../types/connector.ts";


export class PFConnectorBackend {
    private readonly _id: string;
    private _queue: PFCMessage[];
    _timeoutMs: number;
    constructor() {
        this._id = 'D1R_connectExtension';
        this._queue = [];
        this._timeoutMs = 3000;

        document.addEventListener('D1R_connectExtension_b', this._handleRequest.bind(this));
    }

    async _handleRequest(e: Event) {
        const pfcMessage: PFCMessageEvent = e as PFCMessageEvent;
        if (!pfcMessage || !pfcMessage.detail || !pfcMessage.detail.id) {
            console.warn('Unknown event on extension listener');
            return;
        }

        const queuedMessage = this._queue
            .find(m => m.id === pfcMessage.detail.id);

        if (queuedMessage) {
            queuedMessage.result = pfcMessage.detail.result || null;
        }
        // console.log('Message arrived from Content-Script for ' + pfcMessage.detail.id);
    }

    generateId (msg: PFCMessage) {
        let i = 0,
            id: string;
        do {
            id = new Date().getTime() + '_' + (msg.method || '_') + i;
            i++;
        } while (this._queue.find(m => m.id === id));

        return id;
    }

    sendMessage (msg: PFCMessage) {
        if (!msg || typeof msg !== 'object') {
            return;
        }

        if (!msg.id) {
            msg.id = this.generateId(msg);
        }
        msg.result = undefined;

        this._queue.push(msg);

        let _interval: NodeJS.Timeout|number;
        return new Promise((resolve, reject) => {
            document.dispatchEvent(new CustomEvent(this._id, {
                detail: msg
            }));

            let i = 0,
                timeoutMs = 10;

            _interval = setInterval(() => {

                if (i >= this._timeoutMs) {
                    clearInterval(_interval);
                    reject(new Error('Timeout'));
                }

                const queuedData = this._queue
                    .find(m => m.id === msg.id);

                if (queuedData && queuedData.result !== undefined) {
                    clearInterval(_interval);
                    // console.log('Message received: ', queuedData.result);
                    resolve(queuedData);
                } else if (!queuedData) {
                    clearInterval(_interval);
                    reject(new Error('Data lost in execution (queue)'));
                }
                i+=timeoutMs;
                timeoutMs*=2;
            }, timeoutMs);
        })

    }
}
