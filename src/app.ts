import fs from "fs";
import express from "express";
import path, { dirname } from "path";
import type { Express } from "express";
import { fileURLToPath } from "url";

const app: Express = express();
app.use(express.json()); // <- Express Middleware ->

const port: number = 3000;

//=========================================================================================

// <- CREATING DATA TYPES ->

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

//=========================================================================================

//=========================================================================================

// <- GET REQUEST (Get all NFTs) ->

const nfts = JSON.parse(
  fs.readFileSync(
    path.join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "nft-data",
      "data",
      "nft-simple.json"
    ),
    "utf-8"
  )
);

app.get("/api/v1/nfts", (req, resp) => {
  resp.status(200).json({
    status: "success",
    results: nfts.length,
    data: {
      nfts,
    },
  });
});

//=========================================================================================

//=========================================================================================

// <- POST REQUEST (Add the new NFT data) ->

app.post("/api/v1/nfts", (req, resp) => {
  const newId: number = nfts.length;
  const newNFT: NFT = Object.assign({ id: newId }, req.body);

  nfts.push(newNFT);

  fs.writeFile(
    path.join(
      dirname(fileURLToPath(import.meta.url)),
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
});

//=========================================================================================

//=========================================================================================

// <- GET REQUEST (Get single NFT) ->

app.get("/api/v1/nfts/:id", (req, resp) => {
  const id: number = +req.params.id;
  const nft: NFT = nfts.find((element: NFT) => element.id === id);

  if (!nft) {
    resp.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    resp.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  }
});

//=========================================================================================

//=========================================================================================

// <- UPDATE REQUEST ->

app.patch("/api/v1/nfts/:id", (req, resp) => {
  if (+req.params.id >= nfts.length) {
    resp.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    resp.status(200).json({
      status: "success",
      data: {
        nft: "Updating NFT",
      },
    });
  }
});

//=========================================================================================

//=========================================================================================

// <- DELETE REQUEST ->

app.delete("/api/v1/nfts/:id", (req, resp) => {
  if (+req.params.id >= nfts.length) {
    resp.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    resp.status(204).json({
      status: "success",
      data: null,
    });
  }
});

//=========================================================================================

//=========================================================================================

// <- CREATE SERVER ->

app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

//=========================================================================================
