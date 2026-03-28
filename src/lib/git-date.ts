import { execSync } from "node:child_process";

/**
 * Returns the last git commit date for a file as an ISO 8601 string (e.g. "2026-03-15T10:30:00Z").
 * Falls back to undefined if the file has no git history.
 */
export function getLastUpdated(filePath: string): string | undefined {
  try {
    const timestamp = execSync(
      `git log -1 --format="%aI" -- "${filePath}"`,
      { encoding: "utf-8" },
    ).trim();

    if (!timestamp) return undefined;

    return new Date(timestamp).toISOString();
  } catch {
    return undefined;
  }
}
