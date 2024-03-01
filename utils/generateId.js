const generateId = (items) => {
  try {
    const lastItem = items.pop();
    if (!lastItem) {
      return 1;
    }
    return parseInt(lastItem.id) + 1;
  } catch (err) {
    return "Error";
  }
};

module.exports = generateId;
