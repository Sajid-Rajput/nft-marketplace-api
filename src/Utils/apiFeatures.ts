import { Document, Query } from "mongoose";
import { Request } from "express";

export default class APIFeatures {
  private query: Query<Document[], Document>;
  private queryString: Request["query"];

  constructor(
    _query: Query<Document[], Document>,
    _queryString: Request["query"]
  ) {
    this.query = _query;
    this.queryString = _queryString;
  }

  // <- *** FILTER QUERY *** ->
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields: string[] = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObj[element]);

    // <- *** ADVANCED FILTERING QUERY *** ->
    // { difficulty: 'easy', duration: { gte: '5' } } REQUEST.QUERY
    // { difficulty: 'easy', duration: { $gte: '5' } } VALID MONGODB QUERY

    let queryStr: string = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // <- *** SORTING METHOD  *** ->
  sort(): this {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("createdAt");
    }

    return this;
  }

  // <- *** FIELDS METHOD  *** ->
  limitfields(): this {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // <- *** PAGINATION FUNCTION  *** ->
  pagination() {
    // 10 is the radix argument that specifies the base of the number system to be used for parsing the string. In this case, 10 means that the string will be parsed as a base 10 integer.
    const page: number = parseInt(this.queryString.page as string, 10) || 1;
    const limit: number = parseInt(this.queryString.limit as string, 10) || 10;
    const skip: number = (page - 1) * limit;
    this.query = this.query.sort("_id").skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   const newNFTs = await NFT.countDocuments();
    //   if (skip >= newNFTs) {
    //     throw new Error("This page does'nt exist");
    //   }
    // }

    return this;
  }
}
