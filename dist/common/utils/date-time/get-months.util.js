"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFormattedMonths = getAllFormattedMonths;
const date_fns_1 = require("date-fns");
function getAllFormattedMonths(year) {
    const formattedMonths = [];
    const startOfYear = new Date((0, date_fns_1.addHours)(new Date(year, 0, 1), 5));
    const endOfYear = new Date((0, date_fns_1.addHours)(new Date(year, 11, 31), 5));
    const monthsInYear = (0, date_fns_1.eachMonthOfInterval)({
        start: startOfYear,
        end: endOfYear,
    });
    monthsInYear.forEach((month) => {
        const formattedMonth = (0, date_fns_1.format)(month, 'yyyy-MM');
        formattedMonths.push(formattedMonth);
    });
    return formattedMonths;
}
//# sourceMappingURL=get-months.util.js.map