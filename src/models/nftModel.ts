import mongoose, { Model } from "mongoose";
import slugify from "../Utils/slugify.js";
//=========================================================================================
// <- CREATE NFT MODEL MONGOOSE SCHEMA ->
//=========================================================================================

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: String,
      required: [true, "must provide duration"],
    },
    maxGroupSize: {
      type: String,
      required: [true, "must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "must have difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide the summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "must provide the cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretNFTs: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema
  .virtual("durationweeks")
  .get(function (this: { duration: number }): number {
    return this.duration / 7;
  });

//=========================================================================================
// <- DOCUMENT MIDDLEWARE: run before .save() or .create() ->
//=========================================================================================

nftSchema.pre("save", function (this: { name: string; slug: string }, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//=========================================================================================
// <- QUERY MIDDLEWARE ->
//=========================================================================================

nftSchema.pre<mongoose.Query<any, any>>(/^find/, function (next) {
  this.find({ secretNFTs: { $ne: true } });
  next();
});

//=========================================================================================
// <- AGGREGATION MIDDLEWARE ->
//=========================================================================================
nftSchema.pre<mongoose.Aggregate<any>>("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretNFTs: { $ne: true } } });
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default NFT;
