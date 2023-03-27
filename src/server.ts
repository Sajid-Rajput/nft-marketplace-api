import path from "path";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

//=========================================================================================
// <- CREATE ENVIRONMENT VARIBLE ->
//=========================================================================================

dotenv.config({
  path: path.join(dirname(fileURLToPath(import.meta.url)), "..", "config.env"),
});
// console.log(app.get("env"));
// console.log(process.env);

//=========================================================================================
// <- CREATE SERVER ->
//=========================================================================================
const port: string | 3000 = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
