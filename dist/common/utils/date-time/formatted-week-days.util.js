"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedWeekDays = getFormattedWeekDays;
const date_fns_1 = require("date-fns");
function getFormattedWeekDays(date) {
    const formattedDays = [];
    const startOfWeekDate = (0, date_fns_1.startOfWeek)((0, date_fns_1.addHours)(date, 5));
    const endOfWeekDate = (0, date_fns_1.endOfWeek)((0, date_fns_1.addHours)(date, 5));
    const daysInWeek = (0, date_fns_1.eachDayOfInterval)({
        start: startOfWeekDate,
        end: endOfWeekDate,
    });
    daysInWeek.forEach((day) => {
        const formattedDay = (0, date_fns_1.format)(day, 'yyyy-MM-dd');
        formattedDays.push(formattedDay);
    });
    return formattedDays;
}
//# sourceMappingURL=formatted-week-days.util.js.map