function normalize(s) {
    const first = s.slice(0, 1).toUpperCase();
    const rest = s.slice(1).toLowerCase();
    return `${first}${rest}`;
}

export {
    normalize
};
