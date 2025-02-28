// This file was ripped from https://duckduckgo.com/bang.js
import duckBangs from "./bangs.json" with {type: "json"};
import customBangs from "./custom-bangs.json" with {type: "json"};

type Bang = {
  c?: string;
  d: string;
  r: number;
  s: string;
  sc?: string;
  t: string;
  u: string;
};

if (typeof window !== "undefined") {
    throw new Error("Attempted to re-map bangs on client side instead of at build time");
}

export const bangs: Record<string, Bang> = {
  ...Object.fromEntries(
    [...(duckBangs as Bang[]), ...(customBangs as Bang[])].map((bang) => {
      return [bang.t, bang];
    })
  ),
};