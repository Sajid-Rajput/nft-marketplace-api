import express from "express";
import type { Router } from "express";
import nftControllers from "../controllers/nftControllers.js";

//=========================================================================================
// <- ROUTER NFTs ->
//=========================================================================================

// *** EXPRESS ROUTER ***
const router: Router = express.Router();

// *** NFT API ROUTES ***
router
  .route("/top-5-nfts")
  .get(nftControllers.aliasTopNFTs, nftControllers.getAllNFTs);

router.route("/nfts-stats").get(nftControllers.getNftsStats);

router.route("/monthly-plan/:year").get(nftControllers.getMonthlyPlan);

router.route("/").get(nftControllers.getAllNFTs).post(nftControllers.createNFT);

router
  .route("/:id")
  .get(nftControllers.getSingleNFT)
  .patch(nftControllers.updateNFT)
  .delete(nftControllers.deleteNFT);

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default router;
