'use strict';

export const Private = () => {
    const map = new WeakMap();
    return (key) => {
        if(map.has(key)) {
            return map.get(target);
        }
        const value = {};
        map.set(key, value);
        return value;
    };
};
