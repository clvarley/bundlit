import {load} from "./Config";
import {resolve} from "node:path";

const path = resolve(__dirname + "/../bundlit.json");

load(path).then((config) => {
  console.log(config);
});
