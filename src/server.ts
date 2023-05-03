import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

//=========================================================================================
// <- CREATE ENVIRONMENT VARIBLE ->
//=========================================================================================

dotenv.config({
  path: path.join(dirname(fileURLToPath(import.meta.url)), "..", "config.env"),
});

//=========================================================================================
// <- CONNECTING WITH THE MONGODB DATABASE ->
//=========================================================================================

if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
  const DB: string = process.env.DATABASE.replace(
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
    .then(() => {
      console.log("DB Connected Successfully");
      console.log(`Running Environment: ${process.env.NODE_ENV}`);
    });
}

//=========================================================================================
// <- CREATE SERVER ->
//=========================================================================================
const port: string | 3000 = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
