
// let productSchema = mongoose.Schema({
//   name: { type: String, required: true }
// });

// const reviewSchema = mongoose.Schema({
//   product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   summary: { type: String, maxlength: 60 },
//   recommend: { type: Boolean, required: true },
//   response: { type: String, default: null },
//   body: { type: String, required: true, maxlength: 1000 },
//   date: { type: Date, default: Date.now },
//   reviewer_name: { type: String, required: true, maxlength: 20 },
//   helpfulness: { type: Number, default: 0 },
//   photos: [{ id: Number, url: String }],
//   characteristics: {
//     size: { type: Number, min: 1, max: 5, default: null },
//     comfort: { type: Number, min: 1, max: 5, default: null },
//     length: { type: Number, min: 1, max: 5, default: null },
//     fit: { type: Number, min: 1, max: 5, default: null },
//     quality: { type: Number, min: 1, max: 5, default: null }
//   }
// });

// const ReviewMetaSchema = mongoose.Schema({
//   product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//   ratings: { type: Map, of: Number },
//   recommended: { type: Map, of: Number },
//   characteristics: { type: Map, of: Object },
// });



// const Product = mongoose.model('Product', productSchema);
// const Review = mongoose.model('Review', reviewSchema);
// const ReviewMeta = mongoose.model('ReviewMeta', ReviewMetaSchema);
