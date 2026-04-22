/**
 * Ported from WFchat `workflow-canvas-demo.tsx` — header toolbar rules for
 * lifecycle, quota, Save split, and Turn on (prototype only).
 */

export type WorkflowNavLifecycleState =
  | "inactive"
  | "inactive_draft"
  | "active"
  | "active_draft"
  | "draft_errors"
  | "draft_clean";
export type WorkflowNavQuotaState = "has_quota" | "no_quota";

/** “Live on” in the product sense (not draft-only rows). */
export function isWorkflowLifecycleActive(
  lifecycle: WorkflowNavLifecycleState
): boolean {
  return lifecycle === "active" || lifecycle === "active_draft";
}

export function isWorkflowLifecycleInactive(
  lifecycle: WorkflowNavLifecycleState
): boolean {
  return lifecycle === "inactive" || lifecycle === "inactive_draft";
}

export const WORKFLOW_HEADER_SAVE_AND_PUBLISH_LABEL = "Save and publish";

/**
 * In **draft** lifecycles, the prototype treats the not-yet-shipped line as **v1** in the header and
 * ship hints (separate from the internal live counter in state).
 */
export function getWorkflowHeaderDisplayVersion(
  lifecycle: WorkflowNavLifecycleState,
  livePublishedVersion: number
): number {
  if (lifecycle === "draft_errors" || lifecycle === "draft_clean") return 1;
  return livePublishedVersion;
}

/** Shown in rich tooltip when prototype quota = “Does not have quota” (activation / allocation). */
export const WORKFLOW_NO_QUOTA_TOOLTIP_COPY =
  "You have 0 advanced workflows left included in your Rippling Platform (Core) plan. If you build an advanced workflow, you'll be able to save it but won't be able to activate it. Consider upgrading your tier to unlock more. You can also deactivate existing advanced workflows to free up allocation.";

/** Option 1 switch + Option 2 publish hint: live publish is still basic; canvas draft is advanced without quota. */
export function getActiveAdvancedDraftNoQuotaCopy(publishedVersion: number): string {
  return `v${publishedVersion} is still live from your last publish (basic). This draft is advanced — you can’t activate it without advanced workflow quota. Save draft, revert to basic, or add quota.`;
}

export type TurnOnMenuItem = {
  label: string;
  value: string;
  isDisabled?: boolean;
  secondaryLabel?: string;
};

export function getTurnOnMenuItemForOwnerToolbar(
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState,
  publishedVersion: number
): TurnOnMenuItem {
  const nextPublishedVersion = publishedVersion + 1;
  const turnOnEnabledExplainer = `Live runs use published v${publishedVersion}. Ship v${nextPublishedVersion} with ${WORKFLOW_HEADER_SAVE_AND_PUBLISH_LABEL}.`;

  if (isWorkflowLifecycleActive(lifecycle)) {
    return {
      label: "Turn on",
      value: "turn_on",
      isDisabled: true,
      secondaryLabel: `Already live · published v${publishedVersion} is running`,
    };
  }
  if (lifecycle === "draft_errors") {
    return {
      label: "Turn on",
      value: "turn_on",
      isDisabled: true,
      secondaryLabel:
        quota === "has_quota"
          ? `Resolve errors first · then you can turn on v${publishedVersion} live`
          : "No quota available",
    };
  }
  if (isWorkflowLifecycleInactive(lifecycle) && quota === "no_quota") {
    return {
      label: "Turn on",
      value: "turn_on",
      isDisabled: true,
      secondaryLabel: `No quota available · cannot turn on v${publishedVersion} live`,
    };
  }
  if (lifecycle === "draft_clean" && quota === "no_quota") {
    return {
      label: "Turn on",
      value: "turn_on",
      isDisabled: true,
      secondaryLabel: `No quota available · cannot turn on v${publishedVersion} live`,
    };
  }
  return {
    label: "Turn on",
    value: "turn_on",
    secondaryLabel: turnOnEnabledExplainer,
  };
}

export type SaveMenuRow =
  | { type: "item"; label: string; value: string; disabled?: boolean; hint?: string }
  | { type: "separator" };

/**
 * Option 1 Save / Save and publish rows. “Save and publish” uses the same **ship** rules as Option 2
 * (live snapshot): it’s disabled when no new version can go live, so `v{n}` only bumps on a real ship.
 */
export function getOwnerSaveMenuBaseItems(
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState,
  publishedVersion: number,
  draftIsAdvanced: boolean
): SaveMenuRow[] {
  const nextForMenuHint =
    lifecycle === "draft_errors" || lifecycle === "draft_clean"
      ? 1
      : publishedVersion + 1;
  const savePublishVersionSubtitle = `v${nextForMenuHint} on ${WORKFLOW_HEADER_SAVE_AND_PUBLISH_LABEL}`;
  const ship = getOption2PublishRow(
    lifecycle,
    quota,
    publishedVersion,
    draftIsAdvanced
  );

  return [
    { type: "item", label: "Save", value: "save" },
    {
      type: "item",
      label: WORKFLOW_HEADER_SAVE_AND_PUBLISH_LABEL,
      value: "save_publish",
      disabled: ship.disabled,
      hint: ship.disabled ? ship.hint : savePublishVersionSubtitle,
    },
  ];
}

/** Option 1 owner: Save + Save and publish. Option 2 owner: Save draft + Publish in menu; primary split shows Publish when allowed. */
export function getOwnerSaveDropdownRows(
  headerUx: "option1" | "option2",
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState,
  publishedVersion: number,
  draftIsAdvanced: boolean
): SaveMenuRow[] {
  const base = getOwnerSaveMenuBaseItems(
    lifecycle,
    quota,
    publishedVersion,
    draftIsAdvanced
  );
  if (headerUx === "option1") return base;
  const pub = getOption2PublishRow(lifecycle, quota, publishedVersion, draftIsAdvanced);
  return [
    { type: "item", label: "Save draft", value: "save_draft" },
    {
      type: "item",
      label: "Publish",
      value: "publish",
      disabled: pub.disabled,
      hint: pub.hint,
    },
  ];
}

/**
 * Option 2 — Publish: bump published version; if not live, also go active (when allowed).
 * When **active** but the canvas draft is **advanced** with **no quota**, publishing the new draft is
 * blocked: the previously published (e.g. basic) version can stay live while the advanced draft can’t
 * replace it until quota is available or the draft is basic again.
 */
export function getOption2PublishRow(
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState,
  publishedVersion: number,
  draftIsAdvanced: boolean
): { disabled: boolean; hint?: string } {
  const next = publishedVersion + 1;
  if (lifecycle === "draft_errors") {
    return {
      disabled: true,
      hint:
        quota === "has_quota"
          ? `Resolve errors first · ${WORKFLOW_HEADER_SAVE_AND_PUBLISH_LABEL} blocked for v${next}`
          : "No quota available",
    };
  }
  if (isWorkflowLifecycleActive(lifecycle)) {
    if (draftIsAdvanced && quota === "no_quota") {
      return {
        disabled: true,
        hint: getActiveAdvancedDraftNoQuotaCopy(publishedVersion),
      };
    }
    return {
      disabled: false,
      hint: `Ship v${next} · live runs use v${publishedVersion}`,
    };
  }
  if (quota === "no_quota") {
    return {
      disabled: true,
      hint: `No quota available · cannot activate v${next} live`,
    };
  }
  return {
    disabled: false,
    hint:
      lifecycle === "draft_clean"
        ? "Ship v1 and go live"
        : `Ship v${next} and go live`,
  };
}

export function getWorkflowHeaderOption2LifecycleLabel(
  lifecycle: WorkflowNavLifecycleState,
  publishedVersion: number
): { text: string; tone: "active" | "inactive" | "draft" } {
  const v = `V${getWorkflowHeaderDisplayVersion(lifecycle, publishedVersion)}`;
  if (lifecycle === "active_draft")
    return { text: `${v} - Active`, tone: "active" };
  if (lifecycle === "inactive_draft")
    return { text: `${v} - Inactive`, tone: "inactive" };
  if (isWorkflowLifecycleActive(lifecycle))
    return { text: `${v} - Active`, tone: "active" };
  if (isWorkflowLifecycleInactive(lifecycle))
    return { text: `${v} - Inactive`, tone: "inactive" };
  return { text: `${v} - Draft`, tone: "draft" };
}

export function getWorkflowOwnerLiveBlockerText(
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState
): string | null {
  if (isWorkflowLifecycleActive(lifecycle)) return null;
  if (lifecycle === "draft_errors") {
    return quota === "has_quota"
      ? "Can't turn on: fix draft errors before going live."
      : "Can't turn on: fix draft errors and add workflow quota.";
  }
  if (quota === "no_quota") {
    return "Can't turn on: no workflow quota on your plan.";
  }
  return null;
}

export function getOwnerSwitchDisabled(
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState,
  publishedVersion: number
): boolean {
  if (isWorkflowLifecycleActive(lifecycle)) return false;
  return Boolean(
    getTurnOnMenuItemForOwnerToolbar(lifecycle, quota, publishedVersion).isDisabled
  );
}

export function getOption2PrimaryButtonLabel(
  lifecycle: WorkflowNavLifecycleState,
  quota: WorkflowNavQuotaState,
  publishedVersion: number,
  draftIsAdvanced: boolean
): "Publish" | "Save draft" {
  const pub = getOption2PublishRow(lifecycle, quota, publishedVersion, draftIsAdvanced);
  return pub.disabled ? "Save draft" : "Publish";
}
