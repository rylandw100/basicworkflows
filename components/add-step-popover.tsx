"use client";

import { useMemo, useState } from "react";
import { Search, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ADD_STEP_CATALOG_GROUPS,
  getBasicActionCatalogItems,
  WORKFLOW_BASIC_CATALOG_IDS,
  type CatalogItemWithCategory,
} from "@/components/add-step-catalog";

type AddStepPopoverProps = {
  className?: string;
  onSelect: (item: CatalogItemWithCategory) => void;
  /** When true, “Basic actions” (email + task) appear above Notifications, excluded from that group. */
  splitBasicActions?: boolean;
};

/** Shared copy for sidebar tier explanation (optional). */
export function AddStepTierLegendParagraph({ className }: { className?: string }) {
  return (
    <p
      className={cn("text-[11px] leading-[14px] text-[#8c8888]", className)}
      style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 430 }}
    >
      <span className="font-medium text-[#595555]">Basic</span> = only with other Basic steps;
      anything else is <span className="font-medium text-[#595555]">Advanced</span>.
    </p>
  );
}

/**
 * Searchable step list matching the “Add a step” pane + connector popover (Figma ~11:8956).
 */
export function AddStepPopover({
  className,
  onSelect,
  splitBasicActions = false,
}: AddStepPopoverProps) {
  const [query, setQuery] = useState("");

  const { basicSectionItems, catalogGroups } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchQuery = (label: string, category: string) =>
      !q ||
      label.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q);

    if (!splitBasicActions) {
      const groups = !q
        ? ADD_STEP_CATALOG_GROUPS
        : ADD_STEP_CATALOG_GROUPS.map((g) => ({
            ...g,
            items: g.items.filter((i) => matchQuery(i.label, g.category)),
          })).filter((g) => g.items.length > 0);
      return { basicSectionItems: [] as CatalogItemWithCategory[], catalogGroups: groups };
    }

    const basicAll = getBasicActionCatalogItems();
    const basicSectionItems = basicAll.filter((i) => matchQuery(i.label, "Basic actions"));
    const catalogGroups = ADD_STEP_CATALOG_GROUPS.map((g) => {
      const items =
        g.category === "Notifications"
          ? g.items.filter((i) => !WORKFLOW_BASIC_CATALOG_IDS.has(i.id))
          : g.items;
      const filtered = items.filter((i) => matchQuery(i.label, g.category));
      return { ...g, items: filtered };
    }).filter((g) => g.items.length > 0);

    return { basicSectionItems, catalogGroups };
  }, [query, splitBasicActions]);

  const empty =
    basicSectionItems.length === 0 && catalogGroups.every((g) => g.items.length === 0);

  return (
    <div
      className={cn(
        "flex w-[300px] flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      <div className="shrink-0 px-4 pb-2 pt-2">
        <div className="flex h-8 items-center gap-1 rounded-md border border-black/20 bg-white px-2">
          <Search className="size-4 shrink-0 text-[#6f6f72]" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-7 border-0 bg-transparent p-0 text-[15px] leading-[19px] text-black shadow-none placeholder:text-[#6f6f72] focus-visible:ring-0"
            style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 400 }}
          />
        </div>
      </div>
      <div
        className="max-h-[min(360px,calc(100vh-120px))] overflow-y-auto overscroll-contain px-0 pb-2"
        role="listbox"
        aria-label="Add a step"
      >
        {splitBasicActions && basicSectionItems.length > 0 ? (
          <div className="mb-1">
            <div
              className="sticky top-0 z-[1] bg-white px-4 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[1.5px] text-[#8c8888]"
              style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 535 }}
            >
              Basic actions
            </div>
            <div className="flex flex-col gap-px px-2">
              {basicSectionItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  title={`Add ${item.label}`}
                  className="flex min-h-10 w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-[#f9f7f6]"
                  onClick={() => onSelect(item)}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>
                  <span
                    className="min-w-0 flex-1 text-[15px] leading-[19px] text-[#252528]"
                    style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 400 }}
                  >
                    {item.label}
                  </span>
                  <GripVertical className="size-4 shrink-0 text-[#bfbebe]" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {catalogGroups.map((group) => (
          <div key={group.category} className="mb-1">
            <div
              className="sticky top-0 z-[1] bg-white px-4 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[1.5px] text-[#8c8888]"
              style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 535 }}
            >
              {group.category}
            </div>
            <div className="flex flex-col gap-px px-2">
              {group.items.map((item) => {
                const full: CatalogItemWithCategory = {
                  ...item,
                  category: group.category,
                };
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    title={`Add ${item.label}`}
                    className="flex min-h-10 w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-[#f9f7f6]"
                    onClick={() => onSelect(full)}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                    <span
                      className="min-w-0 flex-1 text-[15px] leading-[19px] text-[#252528]"
                      style={{ fontFamily: "'Basel Grotesk', sans-serif", fontWeight: 400 }}
                    >
                      {item.label}
                    </span>
                    <GripVertical className="size-4 shrink-0 text-[#bfbebe]" aria-hidden />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {empty ? (
          <p
            className="px-4 py-6 text-center text-sm text-[#8c8888]"
            style={{ fontFamily: "'Basel Grotesk', sans-serif" }}
          >
            No actions match “{query.trim()}”.
          </p>
        ) : null}
      </div>
    </div>
  );
}
