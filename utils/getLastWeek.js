function getLastWeekDates() {
  const dates = [];
  const now = new Date();
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );
  for (let i = 0; i < 7; i++) {
    const date = new Date(lastWeek);
    date.setDate(lastWeek.getDate() + i + 1);
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dates.push(formattedDate);
  }
  return dates;
}

module.exports = getLastWeekDates;
