import { buildIndicators, parseAbi } from "../lib/analysis";

const sample = [{ type: "function", name: "owner", inputs: [], outputs: [] }, { type: "function", name: "pause", inputs: [], outputs: [] }];

if (buildIndicators(sample, true)[0].status !== "detected") throw new Error("ownership indicator failed");
if (buildIndicators(sample, false)[0].status !== "unknown") throw new Error("unverified indicator failed");
if (parseAbi(JSON.stringify(sample)).length !== 2) throw new Error("ABI parser failed");
console.log("analysis checks passed");
