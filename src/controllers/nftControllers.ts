import NFT from "../models/nftModel.js";
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

const getAllNFTs: (req: Request, resp: Response) => void = async (
  req,
  resp
) => {
  try {
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
  } catch (error) {
    resp.status(500).json({
      status: "fail",
      message: "server error",
    });
  }
};

//=========================================================================================
// <- POST REQUEST (Add the new NFT data) ->
//=========================================================================================

const createNFT: (req: Request, resp: Response) => void = async (req, resp) => {
  try {
    const newNFT = await NFT.create(req.body);

    resp.status(201).json({
      status: "success",
      data: {
        nft: newNFT,
      },
    });
  } catch (error) {
    resp.status(400).json({
      status: "fail",
      message: "INVALID DATA send for NFT",
    });
  }
};

//=========================================================================================
// <- GET REQUEST (Get single NFT) ->
//=========================================================================================

const getSingleNFT: (req: Request, resp: Response) => void = async (
  req,
  resp
) => {
  try {
    const nft = await NFT.findById(req.params.id);

    resp.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    resp.status(500).json({
      status: "fail",
      message: "server error",
    });
  }
};

//=========================================================================================
// <- UPDATE REQUEST ->
//=========================================================================================

const updateNFT: (req: Request, resp: Response) => void = async (req, resp) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    resp.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    resp.status(500).json({
      status: "fail",
      message: "server error",
    });
  }
};

//=========================================================================================
// <- DELETE REQUEST ->
//=========================================================================================

const deleteNFT: (req: Request, resp: Response) => void = async (req, resp) => {
  try {
    await NFT.findByIdAndDelete(req.params.id);
    console.log(typeof req.params.id);
    resp.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    resp.status(500).json({
      status: "fail",
      message: "server error",
    });
  }
};

//=========================================================================================
// <- GET REQUEST (NFT Stats) ->
//=========================================================================================

const getNftsStats: (req: Request, resp: Response) => void = async (
  req,
  resp
) => {
  try {
    const stats = await NFT.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
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
          _id: { $ne: "easy" },
        },
      },
    ]);

    resp.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    resp.status(500).json({
      status: "fail",
      message: "server error",
    });
  }
};

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
};
