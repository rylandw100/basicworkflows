/**
 * Trigger option IDs that keep a workflow eligible for **Basic** (with Basic-tier steps).
 * Product rule: only the two “Start date” rows in the trigger builder (Popular › Onboarding
 * and Relative to a date › Employee) — both use option id `start-date` in `trigger-data.ts`.
 */
export const WORKFLOW_BASIC_TRIGGER_OPTION_IDS = new Set<string>(["start-date"]);

export function isWorkflowBasicTriggerOption(id: string | null | undefined): boolean {
  return id != null && WORKFLOW_BASIC_TRIGGER_OPTION_IDS.has(id);
}

/** Browse path to the canonical “Start date” row under Popular › Onboarding (Basic-eligible). */
export const WORKFLOW_BASIC_START_DATE_BROWSE_PATH = {
  categoryId: "popular",
  itemId: "onboarding",
  subItemId: null as string | null,
  optionId: "start-date",
} as const;

export type WorkflowBasicStartDateBrowsePath = {
  categoryId: string;
  itemId: string;
  subItemId?: string | null;
  optionId: string;
};
