export const setToLs = (key, value) =>
    JSON.stringify(localStorage.setItem(key, value));

export const getFromLs = (key) => {
    const current = localStorage.getItem(key);

    if (current) {
        return JSON.parse(current);
    }

    return null;
};
export const removeFromLs = (key) => {
    return localStorage.removeItem(key);
};
