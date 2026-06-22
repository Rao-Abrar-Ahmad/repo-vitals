import React, { useState } from "react";
import type { NpmResult } from "../../types";
import { Copy, Check, ChevronRight } from "lucide-react";

interface OutdatedPackagesProps {
  packages: NpmResult[];
}

export const OutdatedPackages: React.FC<OutdatedPackagesProps> = ({ packages }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showOutdated, setShowOutdated] = useState<boolean>(false);

  const visiblePackages = showOutdated
    ? packages
    : packages.filter(pkg => pkg.isDeprecated || pkg.isAbandoned);

  if (visiblePackages.length === 0) {
    return null;
  }

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="glass-panel p-6 hover:bg-card-hover/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            {showOutdated
              ? `All Dependency Updates (${visiblePackages.length})`
              : `Deprecated & Abandoned Packages (${visiblePackages.length})`}
          </h3>
        </h3>
        <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
          <span>Show Outdated</span>

          <button
            type="button"
            onClick={() => setShowOutdated(prev => !prev)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showOutdated ? "bg-blue-500" : "bg-white/10"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showOutdated ? "translate-x-4" : "translate-x-0.5"
                }`}
            />
          </button>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-xs text-text-muted">
              <th className="pb-3 font-semibold">Package</th>
              <th className="pb-3 font-semibold">Installed</th>
              <th className="pb-3 font-semibold">Latest</th>
              <th className="pb-3 font-semibold">Type</th>
              <th className="pb-3 font-semibold">Upgrade Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {visiblePackages.map((pkg, idx) => {
              const upgradeCmd = pkg.isProd
                ? `npm install ${pkg.name}@${pkg.latestVersion}`
                : `npm install -D ${pkg.name}@${pkg.latestVersion}`;

              return (
                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-medium text-white flex items-center gap-2">
                    {pkg.name}
                    {pkg.isDeprecated && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold">
                        Deprecated
                      </span>
                    )}
                    {pkg.isAbandoned && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-text-muted border border-white/10 text-[10px] font-bold">
                        Abandoned
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-text-muted">{pkg.installedVersion}</td>
                  <td className="py-3.5 text-yellow-400 font-medium">
                    <div className="flex items-center gap-1">
                      <ChevronRight size={14} className="text-text-muted" />
                      {pkg.latestVersion}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${pkg.isProd ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}>
                      {pkg.isProd ? "prod" : "dev"}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white/5 px-2.5 py-1 rounded text-white font-mono border border-white/5">
                        {upgradeCmd}
                      </code>
                      <button
                        onClick={() => handleCopy(upgradeCmd, idx)}
                        className="p-1 rounded bg-white/5 border border-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
