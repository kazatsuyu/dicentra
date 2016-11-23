
export const skipWS = function skipWS(str, i) {
    const len = str.length;
    while(i < len && str[i].match(/\s/)) ++i;
    return [i];
};

export const noskip = function noskip(str, i) {
    return [i];
};

export const str = function str(val) {
    return (s, i) => {
        if(s.startsWith(val, i)) return [i + val.length, val];
    };
};

export const regex = function regex(re) {
    return (s, i) => {
        const m = s.slice(i).match(re);
        if(m && s.startsWith(m[0], i)) return [i + m[0].length, m];
    }
};

export const toLex = function toLex(val) {
    if(typeof val === 'string') {
        return str(val);
    }
    else if(val instanceof RegExp) {
        return regex(val);
    }
    return val;
};

export const rep = function rep(val, min = 0, max = null) {
    const lex = toLex(val);
    return (str, i, skip) => {
        let result = [];
        for(let res = lex(str, i, skip); res; res = lex(str, i, skip)) {
            if(res.length>1) {
                result.push(res[1]);
            }
            [i] = skip(str, res[0]);
        }
        if(result.length < min || (max && result.length > max)) return;
        return [i, result];
    }
};

export const opt = function opt(val) {
    const lex = toLex(val);
    return (str, i, skip) => {
        const res = lex(str, i, skip);
        return res || [i];
    };
};

export const omit = function omit (val) {
    const lex = toLex(val);
    return (str, i, skip) => {
        const res = lex(str, i, skip);
        return res && res.slice(0, 1);
    };
};

export const or = function or(...vals) {
    const lexes = vals.map(toLex);
    return (str, i, skip) => {
        for(const lex of lexes) {
            const res = lex(str, i, skip);
            if(res) return res;
        }
    }
};

export const linear = function linear(...vals) {
    const lexes = vals.map(toLex);
    return (str, i, skip) => {
        let result = [];
        for(const lex of lexes) {
            const res = lex(str, i, skip);
            if(!res) return;
            if(res.length>1) {
                result.push(res[1]);
            }
            [i] = skip(str, res[0]);
        }
        return [i, result];
    };
};

export const raw = function raw(val) {
    const lex = toLex(val);
    return (str, i, skip) => {
        const res = lex(str, i, skip);
        return res && [res[0], str.slice(i, res[0])];
    };
};

export const exec = function exec(val, str, skip) {
    const lex = toLex(val);
    const res = lex(str, skip(str, 0)[0], skip);
    if(res) res[0] = skip(str, res[0])[0];
    return res;
};

