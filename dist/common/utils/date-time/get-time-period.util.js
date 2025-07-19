"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimePeriodValues = getTimePeriodValues;
const date_fns_1 = require("date-fns");
function getTimePeriodValues() {
    const time = new Date();
    return {
        day: time.setHours(5, 0, 0, 0).valueOf(),
        week: (0, date_fns_1.addHours)(new Date(time.setDate(time.getDate() - time.getDay() + 1)), 5).valueOf(),
        month: (0, date_fns_1.addHours)(new Date(time.getFullYear(), time.getMonth(), 1), 5).valueOf(),
        year: (0, date_fns_1.addHours)(new Date(time.getFullYear(), 0, 1), 5).valueOf(),
        now: (0, date_fns_1.addHours)(new Date(), 5).valueOf(),
    };
}
//# sourceMappingURL=get-time-period.util.js.map