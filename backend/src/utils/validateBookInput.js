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
    errors.push("Title must be a string");
  }

  if (author && typeof author !== "string") {
    errors.push("Title must be a string");
  }
  if (description && typeof description !== "string") {
    errors.push("Title must be a string");
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
  //   Còn publishDate

  return errors;
};
