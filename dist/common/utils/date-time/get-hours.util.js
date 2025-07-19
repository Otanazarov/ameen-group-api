"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFormattedHours = getAllFormattedHours;
const date_fns_1 = require("date-fns");
function getAllFormattedHours(date) {
    const formattedHours = [];
    const startOfTheDay = new Date(date.setHours(0, 0, 0, 0));
    for (let hour = 0; hour < 24; hour++) {
        const currentHour = (0, date_fns_1.addHours)(startOfTheDay, hour);
        const formattedHour = (0, date_fns_1.format)(currentHour, 'yyyy-MM-dd HH:00:00');
        formattedHours.push(formattedHour);
    }
    return formattedHours;
}
//# sourceMappingURL=get-hours.util.js.map