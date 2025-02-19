const string = "Hello, world!";

const encoded = btoa(string);
const decoded = atob(encoded);

console.log("Original string:", string);
console.log("Encoded string:", encoded);
console.log("Decoded string:", decoded)