import { Component } from "base/component";

class Xhr {
    constructor() {
        if (kango.browser.getName() === 'firefox' && Components.classes) {
            this._xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
        } else {
            this._xhr = new XMLHttpRequest();
        }
    }

    open(...args) {
        this._xhr.open(...args);
        if (this._xhr.channel) { // firefox customization
            this._xhr.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
        }
    }

    send(...params) {
        this._xhr.send(...params);
    }
}

export class Request extends Component {
    // порождающий класс для запросов
    getXhr() {
        return new Xhr();
    }
}
