import React from "react";
import type { RepoMeta } from "../../types";
import { HealthFlag } from "../ui/HealthFlag";

interface HealthFlagsRowProps {
  meta: RepoMeta;
}

export const HealthFlagsRow: React.FC<HealthFlagsRowProps> = ({ meta }) => {
  const flags: React.ReactNode[] = [];

  if (meta.archived) {
    flags.push(<HealthFlag key="archived" flag="Archived" type="red" />);
  }
  if (meta.disabled) {
    flags.push(<HealthFlag key="disabled" flag="Disabled" type="red" />);
  }
  if (meta.fork) {
    flags.push(<HealthFlag key="fork" flag="Forked Repository" type="gray" />);
  }
  if (meta.is_template) {
    flags.push(<HealthFlag key="template" flag="Template Repository" type="blue" />);
  }
  if (meta.default_branch === "master") {
    flags.push(
      <HealthFlag
        key="master-branch"
        flag="Default branch is master (consider renaming to main)"
        type="yellow"
      />
    );
  }
  if (!meta.homepage) {
    flags.push(<HealthFlag key="no-homepage" flag="No homepage configured" type="gray" />);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {flags.length > 0 ? (
        flags
      ) : (
        <HealthFlag flag="Repository is healthy and fully active" type="green" />
      )}
    </div>
  );
};
