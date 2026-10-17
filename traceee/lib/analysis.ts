export type AbiInput = { name?: string; type?: string; internalType?: string; indexed?: boolean };
export type AbiItem = { type?: string; name?: string; stateMutability?: string; inputs?: AbiInput[]; outputs?: AbiInput[]; anonymous?: boolean };

export type Indicator = {
  title: string;
  status: "detected" | "not-detected" | "unknown";
  detail: string;
  evidence: string[];
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function matches(name: string, terms: string[]) {
  const normalized = normalize(name);
  return terms.some((term) => normalized.includes(term));
}

export function describeInput(input: AbiInput) {
  return `${input.name || "_"}: ${input.type || "unknown"}`;
}

export function buildIndicators(abi: AbiItem[], verified: boolean): Indicator[] {
  if (!verified) {
    return [{ title: "Permission indicators", status: "unknown", detail: "Verified ABI unavailable", evidence: ["Etherscan did not return verified source metadata, so function-based permission detection cannot be established."] }];
  }

  const functions = abi.filter((item) => item.type === "function" && item.name);
  const names = functions.map((item) => item.name as string);
  const ownership = names.filter((name) => matches(name, ["owner", "ownership", "admin", "role", "operator"]));
  const pause = names.filter((name) => matches(name, ["pause", "unpause", "paused"]));
  const mint = names.filter((name) => matches(name, ["mint", "burn", "supply"]));
  const upgrade = names.filter((name) => matches(name, ["upgrade", "implementation", "beacon", "proxy"]));
  const result = (title: string, found: string[], detail: string): Indicator => ({
    title,
    status: found.length ? "detected" : "not-detected",
    detail,
    evidence: found.length ? found.map((name) => `ABI function: ${name}()`) : ["No matching function name was found in the verified ABI."],
  });
  return [
    result("Ownership & administration", ownership, "Administrative or role-oriented functions are present in the verified ABI. This does not reveal how access control is implemented.") ,
    result("Pause controls", pause, "Pause-related functions are visible in the verified ABI. Their caller restrictions require source-level review.") ,
    result("Supply controls", mint, "Mint, burn, or supply-related functions are visible in the verified ABI. This is an indicator, not a finding of misuse.") ,
    result("Upgrade surface", upgrade, "Upgrade or implementation-related functions are visible in the verified ABI. Proxy behavior may require additional deployment inspection."),
  ];
}

export function parseAbi(rawAbi: string): AbiItem[] {
  try {
    const parsed: unknown = JSON.parse(rawAbi);
    return Array.isArray(parsed) ? parsed as AbiItem[] : [];
  } catch {
    return [];
  }
}
