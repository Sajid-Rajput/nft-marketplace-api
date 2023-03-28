import NFT from "../models/nftModel.js";
import type { Request, Response } from "express";
import { match } from "assert";

//=========================================================================================
// <- CREATING DATA TYPES ->
//=========================================================================================

type NFT = {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
};

declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
    }
  }
}

// ********************************  NFT ENDPOINTS *******************************************

//=========================================================================================
// <- GET REQUEST (Get all NFTs) ->
//=========================================================================================

const getAllNFTs: (req: Request, resp: Response) => void = async (
  req,
  resp
) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields: string[] = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObj[element]);

    // ADVANCED FILTERING QUERY
    // { difficulty: 'easy', duration: { gte: '5' } } REQUEST.QUERY
    // { difficulty: 'easy', duration: { $gte: '5' } } VALID MONGODB QUERY

    let queryStr: string = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = NFT.find(JSON.parse(queryStr));
    const nfts = await query;

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

// ********************************* NFT ENDPOINTS *******************************************

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  getAllNFTs,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
};
