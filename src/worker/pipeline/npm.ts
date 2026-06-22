export interface NpmRegistryResult {
  name: string;
  installedVersion: string;
  latestVersion: string;
  isOutdated: boolean;
  isDeprecated: boolean;
  isAbandoned: boolean;
  deprecationMessage: string | null;
  isProd: boolean;
}

export async function checkNpmPackage(
  name: string,
  versionRange: string,
  isProd: boolean
): Promise<NpmRegistryResult> {
  const installedVersion = versionRange.replace(/[\^~>=<]/g, "");
  try {
    const response = await fetch(`https://registry.npmjs.org/${name}`);
    if (!response.ok) {
      throw new Error(`Registry returned status ${response.status}`);
    }
    const data: any = await response.json();
    const latestVersion = data["dist-tags"]?.latest ?? "unknown";
    const lastModifiedStr = data.time?.modified;
    const lastModified = lastModifiedStr ? new Date(lastModifiedStr) : new Date(0);
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);

    const versionData = data.versions?.[installedVersion];
    const isDeprecated = !!versionData?.deprecated;
    const deprecationMessage = versionData?.deprecated ?? null;
    const isAbandoned = lastModified < twoYearsAgo;

    return {
      name,
      installedVersion,
      latestVersion,
      isOutdated: installedVersion !== latestVersion && latestVersion !== "unknown",
      isDeprecated,
      isAbandoned,
      deprecationMessage,
      isProd,
    };
  } catch (error) {
    // If not found or failed, return a fallback object
    return {
      name,
      installedVersion,
      latestVersion: "unknown",
      isOutdated: false,
      isDeprecated: false,
      isAbandoned: false,
      deprecationMessage: null,
      isProd,
    };
  }
}
