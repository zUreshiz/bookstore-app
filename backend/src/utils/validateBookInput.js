import { validCategories, allowedFields } from "../../model/Book.js";

export const validateBookInput = (data, isUpdate = false) => {
  const errors = [];
  const {
    title,
    author,
    description,
    category,
    price,
    stock,
    coverImage,
    rating,
    publishedDate,
    reviewCount,
    isOnSale,
    salePrice,
    discountPercent,
    saleEndsAt,
  } = data;

  const invalidFields = Object.keys(data).filter((key) => !allowedFields.includes(key));

  if (invalidFields.length) {
    errors.push(`Invalid fields: ${invalidFields.join(",")}`);
  }

  if (!isUpdate) {
    if (!title) errors.push("Title is required");
    if (!author) errors.push("Author is required");
    if (price === undefined) errors.push("Price is required");
    if (!category) errors.push("Category is required");
  }

  if (title && typeof title !== "string") {
    errors.push("Author must be a string");
  }

  if (author && typeof author !== "string") {
    errors.push("Title must be a string");
  }
  if (description && typeof description !== "string") {
    errors.push("Description must be a string");
  }
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    errors.push("Price must be a positive number");
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    errors.push("Stock must be a positive number");
  }
  if (coverImage && typeof coverImage !== "string") {
    errors.push("coverImage must be a string(URL)");
  }
  if (rating !== undefined && (typeof rating !== "number" || rating < 0)) {
    errors.push("Rating must be a positive number");
  }
  if (publishedDate && isNaN(Date.parse(publishedDate)))
    errors.push("publishedDate must be a valid date");

  if (reviewCount !== undefined) {
    if (typeof reviewCount !== "number" || reviewCount < 0) {
      errors.push("reviewCount must be a positive number or zero");
    }
  }
  // Thay thế đoạn code "if (category && ...)" cũ bằng đoạn này:

  if (category) {
    if (!Array.isArray(category)) {
      errors.push("Category must be an array of strings");
    } else if (category.length === 0 && !isUpdate) {
      errors.push("Category is required and cannot be empty");
    } else {
      const invalidCats = category.filter((cat) => !validCategories.includes(cat));

      if (invalidCats.length > 0) {
        errors.push(`Invalid categories: ${invalidCats.join(", ")}`);
      }
    }
  } else if (!isUpdate) {
    // 5. Nếu tạo mới mà không gửi category
    errors.push("Category is required");
  }
  if (isOnSale !== undefined && typeof isOnSale !== "boolean") {
    errors.push("isOnSale must be a boolean value");
  }
  if (isOnSale) {
    // Nếu đang bật sale → cần có ít nhất salePrice hoặc discountPercent
    if (salePrice === undefined && discountPercent === undefined) {
      errors.push("Sale book must include salePrice or discountPercent");
    }

    if (salePrice !== undefined) {
      if (typeof salePrice !== "number" || salePrice < 0) {
        errors.push("salePrice must be a positive number");
      } else if (price !== undefined && salePrice >= price) {
        errors.push("salePrice must be lower than the original price");
      }
    }

    if (discountPercent !== undefined) {
      if (
        typeof discountPercent !== "number" ||
        discountPercent < 0 ||
        discountPercent > 100
      ) {
        errors.push("discountPercent must be a number between 0 and 100");
      }
    }

    if (saleEndsAt !== undefined) {
      const endDate = new Date(saleEndsAt);
      if (isNaN(endDate.getTime())) {
        errors.push("saleEndsAt must be a valid date");
      } else if (endDate < new Date()) {
        errors.push("saleEndsAt must be a future date");
      }
    }
  } else {
    // Nếu isOnSale = false mà vẫn gửi kèm sale fields
    if (
      salePrice !== undefined ||
      discountPercent !== undefined ||
      saleEndsAt !== undefined
    ) {
      errors.push("Sale fields should not be provided when isOnSale is false");
    }
  }

  return errors;
};
