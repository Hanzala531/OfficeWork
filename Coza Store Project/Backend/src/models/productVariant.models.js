const mongoose = require("mongoose");

const ProductVariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

export const productVariant = mongoose.model(
  "ProductVariant",
  ProductVariantSchema
);
