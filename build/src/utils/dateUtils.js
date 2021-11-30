"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateEst = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const dateEst = () => (0, moment_timezone_1.default)().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');
exports.dateEst = dateEst;
//# sourceMappingURL=dateUtils.js.map