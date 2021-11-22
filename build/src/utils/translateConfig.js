"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateConfig = void 0;
const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: true,
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true,
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};
const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};
exports.translateConfig = { marshallOptions, unmarshallOptions };
//# sourceMappingURL=translateConfig.js.map