const { palindrome } = require("../utils/for_testing");
const test = require("ava");

// test.skip("palindrome for midudev", () => {
//     const result = palindrome("midudev");
//     expect(result).toBe("vedudim");
// });

// test.skip("palindrome of empty string", () => {
//     const result = palindrome("");
//     expect(result).toBe("");
// });

// test.skip("palindrome of undefined", () => {
//     const result = palindrome();
//     expect(result).toBeUndefined();
// });

test("palindrome for midudev", (t) => {
    const result = palindrome("midudev");
    t.is(result, "vedudim");
});

test("palindrome of empty string", (t) => {
    const result = palindrome("");
    t.is(result, "");
});

test("palindrome of undefined", (t) => {
    const result = palindrome();
    t.is(result, undefined);
});
