"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFormattedDays = getAllFormattedDays;
const date_fns_1 = require("date-fns");
function getAllFormattedDays(date) {
    const formattedDays = [];
    const startOfMonthDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.addHours)(date, 5));
    const endOfMonthDate = (0, date_fns_1.endOfMonth)((0, date_fns_1.addHours)(date, 5));
    const daysInMonth = (0, date_fns_1.eachDayOfInterval)({
        start: startOfMonthDate,
        end: endOfMonthDate,
    });
    daysInMonth.forEach((day) => {
        const formattedDay = (0, date_fns_1.format)(day, 'yyyy-MM-dd');
        formattedDays.push(formattedDay);
    });
    return formattedDays;
}
//# sourceMappingURL=get-days.util.js.map