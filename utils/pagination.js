const URL = process.env.SERVER_URL

const sortFn = (sort) => {
  let sortOption = {};
  if (sort) {
    const sortFields = sort.split(",");
    sortFields.forEach((field) => {
      const sortOrder = field.startsWith("-") ? -1 : 1;
      const fieldName = field.replace(/^-/, "");
      sortOption[fieldName] = sortOrder;
    });
  }
  return sortOption;
};

const populateAdditionalFields = async (results, populateFields) => {
  try {
    // Iterate over each document in the results array
    for (let i = 0; i < results.length; i++) {
      const document = results[i];
      // Iterate over each field to populate
      for (const field of populateFields) {
        // Check if the field exists in the document
        if (document[field]) {
          // Populate the field
          await document.populate(field);
          // Update the document in the results array with the populated field
          results[i] = document;
        }
      }
    }
    return results;
  } catch (error) {
    console.error("Error occurred while populating additional fields:", error);
    return results;
  }
};

const paginate = async (model, query, route, ...populateFields) => {
  try {
    const { page = 1, perPage = 10, includes, sort, filter, start, end} = query;

    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = new Date(start);
      if (end) filter.createdAt.$lte = new Date(end);
    }

    const sortOption = sortFn(sort);
    const selectFields = includes ? includes.replace(/,/g, " ") : "";
    const results = await model
      .find({ ...filter })
      .select(selectFields)
      .skip((page - 1) * perPage)
      .sort(sortOption)
      .limit(perPage);
    let populatedResults = results;

    // Populate additional fields if provided
    populatedResults = await populateAdditionalFields(populatedResults, populateFields);

    const totalCount = await model.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);



    return {
      data: populatedResults,
      _meta: {
        currentPage: +page,
        perPage: +perPage,
        totalCount,
        totalPages,
      },
      _links: {
        self: `${URL}${route}/api/page=${page}&perPage=${perPage}`,
        first: `${URL}/api/page=1&perPage=${perPage}`,
        prev: page > 1 ? `${URL}${route}/api/page=${+page - 1}&perPage=${perPage}` : null,
        next: page < totalPages ? `${URL}${route}/api/page=${+page + 1}&perPage=${perPage}` : null,
        last: `${URL}${route}/api/page=${totalPages}&perPage=${perPage}`,
      },
    };
  } catch (error) {
    return {
      message: "Error occurred while paginating results",
      error: error.message,
    };
  }
};

module.exports = paginate;
