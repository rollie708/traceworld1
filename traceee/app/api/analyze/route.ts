import { NextRequest, NextResponse } from "next/server";
import { buildIndicators, parseAbi, type AbiItem } from "@/lib/analysis";

const ETHERSCAN = "https://api.etherscan.io/v2/api";
const ADDRESS = /^0x[a-fA-F0-9]{40}$/;

type EtherscanResponse<T> = { status: string; message: string; result: T };
type SourceResult = { SourceCode?: string; ContractName?: string; ABI?: string; Proxy?: string; Implementation?: string };

async function etherscan<T>(params: Record<string, string>, signal: AbortSignal): Promise<T> {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) throw new Error("ETHERSCAN_API_KEY is not configured on the server.");
  const url = new URL(ETHERSCAN);
  url.search = new URLSearchParams({ chainid: "1", apikey: apiKey, ...params }).toString();
  const response = await fetch(url, { signal, headers: { accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`Etherscan returned HTTP ${response.status}.`);
  const data = await response.json() as EtherscanResponse<T>;
  if (data.status !== "1") throw new Error(typeof data.result === "string" ? data.result : data.message || "Etherscan could not complete the request.");
  return data.result;
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim() || "";
  if (!ADDRESS.test(address)) return NextResponse.json({ error: "Enter a valid Ethereum address." }, { status: 400 });
  if (!process.env.ETHERSCAN_API_KEY) return NextResponse.json({ error: "The analyzer is not configured yet. Add ETHERSCAN_API_KEY to .env.local and restart the server." }, { status: 503 });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const source = await etherscan<SourceResult[]>({ module: "contract", action: "getsourcecode", address }, controller.signal);
    const metadata = source[0];
    const verified = Boolean(metadata?.SourceCode && metadata.SourceCode.trim());
    let abi: AbiItem[] = [];
    if (verified && metadata?.ABI && metadata.ABI !== "Contract source code not verified") abi = parseAbi(metadata.ABI);
    const indicators = buildIndicators(abi, verified);
    return NextResponse.json({
      chain: "Ethereum Mainnet",
      chainId: 1,
      address,
      contractName: metadata?.ContractName || "Unknown",
      verified,
      proxy: metadata?.Proxy === "1",
      implementation: metadata?.Implementation || null,
      abi,
      indicators,
      explorerUrl: `https://etherscan.io/address/${address}`,
      sourceMessage: verified ? "Verified source code and ABI returned by Etherscan." : "Verified source code is unavailable for this address.",
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "Etherscan took too long to respond. Try again." : error instanceof Error ? error.message : "Unable to retrieve contract data.";
    const rateLimited = /rate limit|too many|limit reached/i.test(message);
    return NextResponse.json({ error: rateLimited ? "Etherscan rate limit reached. Wait a moment and try again." : message }, { status: rateLimited ? 429 : 502 });
  } finally {
    clearTimeout(timeout);
  }
}
