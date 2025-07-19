"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedCurrentDate = getFormattedCurrentDate;
const date_fns_1 = require("date-fns");
function getFormattedCurrentDate() {
    const currentDate = (0, date_fns_1.addHours)(new Date(), 5);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
}
//# sourceMappingURL=formatted-current-date.util.js.map