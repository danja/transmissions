function containsAny(contentString, matchers) {
    return matchers.some(matcher => contentString.includes(matcher));
}

// Example usage:
const contentString = "Hello, world! Welcome to coding.";
const matchers = ["coding", "javascript"];

console.log(containsAny(contentString, matchers)); // Output: true

const matchers2 = ["python", "java"];
console.log(containsAny(contentString, matchers2)); // Output: false
