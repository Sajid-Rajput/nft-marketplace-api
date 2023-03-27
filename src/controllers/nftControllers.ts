import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import type { Request, Response, NextFunction } from "express";

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

//=========================================================================================
// <- EXPRESS CUSTOM MIDDLEWARE (CHECK FUNCTIONS) ->
//=========================================================================================

// <- *** CHECK NFT ID *** ->

const checkID: (
  req: Request,
  resp: Response,
  next: NextFunction,
  value: number
) => Response | undefined = (req, resp, next, value) => {
  console.log(`ID: ${value}`);
  if (+req.params.id >= nfts.length) {
    return resp.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

// <- *** CHECK REQUEST BODY DURING POSTING THE NFT *** ->

const checkBody: (
  req: Request,
  resp: Response,
  next: NextFunction
) => Response | undefined = (req, resp, next) => {
  if (!req.body.name || !req.body.price) {
    return resp.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }

  next();
};

// ********************************  NFT ENDPOINTS *******************************************

//=========================================================================================
// <- LOAD SAMPLE NFT DATA ->
//=========================================================================================

const nfts: NFT[] = JSON.parse(
  fs.readFileSync(
    path.join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "nft-data",
      "data",
      "nft-simple.json"
    ),
    "utf-8"
  )
);

//=========================================================================================
// <- GET REQUEST (Get all NFTs) ->
//=========================================================================================

const getAllNFTs: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: nfts.length,
    data: {
      nfts,
    },
  });
};

//=========================================================================================
// <- POST REQUEST (Add the new NFT data) ->
//=========================================================================================

const createNFT: (req: Request, resp: Response) => void = (req, resp) => {
  const newId: number = nfts.length;
  const newNFT: NFT = Object.assign({ id: newId }, req.body);

  nfts.push(newNFT);

  fs.writeFile(
    path.join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "nft-data",
      "data",
      "nft-simple.json"
    ),
    JSON.stringify(nfts),
    (err) => {
      if (err) {
        throw err;
      }
      resp.status(201).json({
        status: "success",
        nft: newNFT,
      });
    }
  );
};

//=========================================================================================
// <- GET REQUEST (Get single NFT) ->
//=========================================================================================

const getSingleNFT: (req: Request, resp: Response) => void = (req, resp) => {
  const id: number = +req.params.id;
  const nft: NFT | undefined = nfts.find((element: NFT) => element.id === id);

  resp.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
};

//=========================================================================================
// <- UPDATE REQUEST ->
//=========================================================================================

const updateNFT: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(200).json({
    status: "success",
    data: {
      nft: "Updating NFT",
    },
  });
};

//=========================================================================================
// <- DELETE REQUEST ->
//=========================================================================================

const deleteNFT: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(204).json({
    status: "success",
    data: null,
  });
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
  checkID,
  checkBody
};
