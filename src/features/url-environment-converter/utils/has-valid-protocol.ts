import type { TProtocol } from "../types/url-converter";

export function hasValidProtocol(
  rawUrl: string,
  expectedProtocol: TProtocol,
): boolean {
  try {
    const url = new URL(rawUrl);

    const protocol = url.protocol.replace(":", "") as TProtocol;

    return protocol === expectedProtocol;
  } catch {
    return false;
  }
}
