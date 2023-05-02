import NFT from "../models/nftModel.js";
import AppError from "../Utils/appError.js";
import catchAsync from "../Utils/catchAsync.js";
import APIFeatures from "../Utils/apiFeatures.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- CREATING DATA TYPES ->
//=========================================================================================

// type NFT = {
//   id: number;
//   name: string;
//   duration: number;
//   maxGroupSize: number;
//   difficulty: string;
//   ratingsAverage: number;
//   ratingsQuantity: number;
//   price: number;
//   summary: string;
//   description: string;
//   imageCover: string;
//   images: string[];
//   startDates: string[];
// };

// ********************************  NFT ENDPOINTS ****************************************

//=========================================================================================
// <- GET REQUEST (Get top 5 NFTs) ->
//=========================================================================================

const aliasTopNFTs: (
  req: Request,
  resp: Response,
  next: NextFunction
) => void = (req, resp, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name,price,ratingAverage,difficulty";
  next();
};

//=========================================================================================
// <- GET REQUEST (Get all NFTs) ->
//=========================================================================================

const getAllNFTs: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const features: APIFeatures = new APIFeatures(NFT.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();
    const nfts = await features["query"];

    resp.status(200).json({
      status: "success",
      results: nfts.length,
      data: {
        nfts,
      },
    });
  });

//=========================================================================================
// <- POST REQUEST (Add the new NFT data) ->
//=========================================================================================

const createNFT: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const newNFT = await NFT.create(req.body);

    resp.status(201).json({
      status: "success",
      data: {
        nft: newNFT,
      },
    });
  });

//=========================================================================================
// <- GET REQUEST (Get single NFT) ->
//=========================================================================================

const getSingleNFT: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const nft = await NFT.findById(req.params.id);

    if (!nft) {
      return next(new AppError("No NFT is found with that ID", 404));
    }

    resp.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  });

//=========================================================================================
// <- UPDATE REQUEST ->
//=========================================================================================

const updateNFT: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!nft) {
      return next(new AppError("No NFT is found with that ID", 404));
    }

    resp.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  });

//=========================================================================================
// <- DELETE REQUEST ->
//=========================================================================================

const deleteNFT: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const nft = await NFT.findByIdAndDelete(req.params.id);

    if (!nft) {
      return next(new AppError("No NFT is found with that ID", 404));
    }

    resp.status(204).json({
      status: "success",
      data: null,
    });
  });

//=========================================================================================
// <- GET REQUEST (NFT Stats) ->
//=========================================================================================

const getNftsStats: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    // *** Mongoose Aggregator Pipeline ***
    const stats = await NFT.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numNFT: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgRating: 1 },
      },
      {
        $match: {
          _id: { $ne: "EASY" },
        },
      },
    ]);

    resp.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  });

//=========================================================================================
// <- GET REQUEST (Monthly Plan) ->
//=========================================================================================

// *** CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN ***

const getMonthlyPlan: (
  req: Request,
  resp: Response,
  next: NextFunction
) => void = catchAsync(async (req, resp, next) => {
  const year: number = +req.params.year;
  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numNFTStarts: { $sum: 1 },
        nfts: { $push: "$name" },
      },
    },
    {
      $addFields: {
        // just add the new field and its value is equal to id
        month: "$_id",
      },
    },
    {
      // $project is used to hide the _id field
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numNFTStarts: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
  resp.status(200).json({
    status: "success",
    data: plan,
  });
});

// ********************************* NFT ENDPOINTS ****************************************

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  getAllNFTs,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
  aliasTopNFTs,
  getNftsStats,
  getMonthlyPlan,
};
