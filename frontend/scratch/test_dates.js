const { formatDate, formatDateTime } = require("./src/lib/utils");

const isoDate = "2026-04-11T13:00:00Z";
const javaArray = [2026, 4, 11, 13, 0, 0];

console.log("ISO Date (FormatDate):", formatDate(isoDate));
console.log("ISO Date (FormatDateTime):", formatDateTime(isoDate));
console.log("Java Array (FormatDate):", formatDate(javaArray));
console.log("Java Array (FormatDateTime):", formatDateTime(javaArray));
console.log("Empty Input:", formatDate(null));
