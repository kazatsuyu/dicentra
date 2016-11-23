'use strict';
import { Registry, parseStyle } from './utility.js';
import { Private } from '../utility.js';

const prefix = 'dicentra-';
const attrName = `data-${prefix}grid`;

export const initialize = document => {
    const registry = Registry(document, prefix);
    const register = registry.register;

    const priv = Private();

    const Grid = register(
        'grid',
        class Grid extends HTMLElement {
            createdCallback() {
                const shadow = this.createShadowRoot();
                Object.assign(priv(this), {
                    shadow
                });
                const attr = this.getAttribute(attrName);
                if(attr) this.attributeChangedCallback(attrName, null, attr);
            }
            attributeChangedCallback(attr, oldVal, newVal) {
                console.log(parseStyle(newVal));
                console.log(attr, oldVal, newVal);
            }
        }
    );
};

