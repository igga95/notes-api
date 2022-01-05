const palindrome = (string) => {
    if (typeof string === "undefined") return undefined;
    return string.split("").reverse().join("");
};

const average = (array) => {
    if (!array.length) return 0;
    let sum = 0;
    array.forEach((el) => (sum += el));
    return sum / array.length;
};

module.exports = {
    palindrome,
    average,
};
