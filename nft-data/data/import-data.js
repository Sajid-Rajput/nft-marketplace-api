import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { dirname } from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import NFT from "./../../lib/models/nftModel.js";

dotenv.config({
  path: path.join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "config.env"
  ),
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  });

const nfts = JSON.parse(
  fs.readFileSync(
    path.join(dirname(fileURLToPath(import.meta.url)), "nft-simple.json"),
    "utf-8"
  )
);

// IMPORT DATA
const importData = async () => {
  try {
    await NFT.create(nfts);
    console.log("DATA SUCCESSFULLY LOADED!!!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE DATA
const deleteData = async () => {
  try {
    await NFT.deleteMany();
    console.log("ALL DATA DELETED SUCCESSFULLY!!!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
