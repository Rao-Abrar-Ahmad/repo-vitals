export interface VulnInfo {
  id: string;
  summary: string;
  cvssScore: number;
  severity: "Critical" | "High" | "Medium" | "Low";
  url: string;
}

export interface PackageVulns {
  packageName: string;
  vulns: VulnInfo[];
}

function mapCvssToSeverity(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 9.0) return "Critical";
  if (score >= 7.0) return "High";
  if (score >= 4.0) return "Medium";
  return "Low";
}

export async function checkOsvVulnerabilities(
  packages: { name: string; versionRange: string }[]
): Promise<PackageVulns[]> {
  if (packages.length === 0) return [];

  const queries = packages.map(pkg => {
    const version = pkg.versionRange.replace(/[\^~>=<]/g, "");
    return {
      package: { name: pkg.name, ecosystem: "npm" },
      version,
    };
  });

  try {
    const response = await fetch("https://api.osv.dev/v1/querybatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries }),
    });

    if (!response.ok) {
      throw new Error(`OSV API returned status ${response.status}`);
    }

    const data: any = await response.json();
    if (!data.results) return [];

    const results: PackageVulns[] = [];
    for (let i = 0; i < data.results.length; i++) {
      const result = data.results[i];
      const pkg = packages[i];
      if (result.vulns && result.vulns.length > 0) {
        const mappedVulns: VulnInfo[] = result.vulns.map((v: any) => {
          // Find CVSS score
          let cvssScore = 0;
          if (v.severity) {
            for (const sev of v.severity) {
              if (sev.type === "CVSS_V3" || sev.type === "CVSS_V4") {
                cvssScore = parseFloat(sev.score);
                break;
              }
            }
          }
          if (cvssScore === 0 && v.database_specific?.cvss?.score) {
            cvssScore = parseFloat(v.database_specific.cvss.score);
          }

          return {
            id: v.id,
            summary: v.summary || v.details || "No summary provided",
            cvssScore,
            severity: mapCvssToSeverity(cvssScore),
            url: v.references?.[0]?.url ?? `https://osv.dev/vulnerability/${v.id}`,
          };
        });

        results.push({
          packageName: pkg.name,
          vulns: mappedVulns,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("OSV check failed:", error);
    return [];
  }
}
