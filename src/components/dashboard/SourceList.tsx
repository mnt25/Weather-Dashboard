import React from "react";
import type { GroundingChunk } from "../../types/api";
import { ExternalLink } from "lucide-react";

interface SourceListProps {
  sources: GroundingChunk[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div
      className="w-100 mt-5 pt-4 border-top"
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      <div className="d-flex flex-wrap gap-2">
        {sources.map((source, index) =>
          source.web ? (
            <a
              key={index}
              href={source.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="d-inline-flex align-items-center gap-1 px-3 py-1 bg-white border text-primary rounded-pill text-decoration-none small transition-all shadow-sm"
              style={{ borderColor: "rgba(0,0,0,0.05)", maxWidth: "200px" }}
            >
              <ExternalLink size={12} />
              <span className="text-truncate">{source.web.title}</span>
            </a>
          ) : null
        )}
      </div>
    </div>
  );
};
