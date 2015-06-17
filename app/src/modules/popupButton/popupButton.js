import * as _ from 'lodash'
import { Module } from 'base/module'

export class PopupButton extends Module {
    init(initData, onReady) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello world from popupButton!');
        /*eslint-enable no-undef, no-console */
    }

    _downcastHandlers() {
        return {
            'popup': details => kango.ui.browserButton.setPopup(details),
            'icon': url => kango.ui.browserButton.setIcon(url)
        }
    }
}