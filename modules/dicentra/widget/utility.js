'use strict';
import { Private } from '../utility.js';
import * as lex from '../lex.js';

const priv = Private();

export const Registry = function Registry(document, prefix) {
    const p = priv(document);
    if(p.hasOwnProperty(prefix)) return p[prefix];
    return p[prefix] = {
        register(name, cls) {
            return document.registerElement(prefix + name, cls);
        }
    };
};

const propName = lex.raw(lex.regex(/[^\s:;]+/));
const propValue = lex.raw(lex.regex(/[^\s:;]+/));
const prop = lex.linear(propName, lex.omit(':'), lex.rep(propValue, 1));
const style = lex.linear(prop, lex.rep(lex.linear(lex.omit(';'), prop)), lex.omit(lex.opt(';')));
export const parseStyle = function parseStyle(str) {
    const res = lex.exec(style, str, lex.skipWS);
    if(res && res[0] == str.length) {
        const props = res[1];
        const result = { [props[0][0]]: props[0][1] };
        for(const [[key, values]] of props[1]) {
            result[key] = values;
        }
        return result;
    }
};
