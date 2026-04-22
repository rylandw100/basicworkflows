"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WORKFLOW_NO_QUOTA_TOOLTIP_COPY } from "@/lib/workflow-header-prototype";

type WorkflowNoQuotaTooltipProps = {
  enabled: boolean;
  children: React.ReactNode;
  /** Override default platform quota copy (e.g. Option 1: prior publish live, advanced draft held). */
  body?: string;
  /** Where the tooltip opens; default bottom. */
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Classes for the hover target wrapper (e.g. `block w-full` for menu rows). */
  triggerClassName?: string;
};

/**
 * Rich quota explainer + “Details” — use when prototype quota is “Does not have quota”.
 * Wraps a non-disabled focusable/hoverable element (use inner `span` if child is `disabled`).
 */
export function WorkflowNoQuotaTooltip({
  enabled,
  body,
  children,
  side = "bottom",
  align = "start",
  triggerClassName,
}: WorkflowNoQuotaTooltipProps) {
  if (!enabled) return <>{children}</>;

  const copy = body ?? WORKFLOW_NO_QUOTA_TOOLTIP_COPY;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span
          className={
            triggerClassName ??
            "inline-flex max-w-full cursor-default items-center"
          }
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className="z-[100] max-w-[min(22rem,calc(100vw-2rem))] border border-[#e0dede] bg-[#f9f7f6] p-3 text-[#252528] shadow-lg"
      >
        <p
          className="text-[13px] leading-snug"
          style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 430 }}
        >
          {copy}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-3 h-8 border-[#d3d3d3] px-3 text-[13px] text-[#252528] hover:bg-[#f5f5f5]"
          style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 535 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Details
        </Button>
      </TooltipContent>
    </Tooltip>
  );
}
