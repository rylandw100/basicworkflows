import { triggerCategories, type TriggerCategory } from "./trigger-data";

// Helper function to convert ACTION_TYPE to sentence case with "request" suffix
function convertActionTypeToLabel(actionType: string): string {
  // Remove trailing "_REQUEST" if present to avoid double "request"
  let cleaned = actionType;
  if (cleaned.endsWith('_REQUEST')) {
    cleaned = cleaned.slice(0, -8); // Remove "_REQUEST"
  }
  // Convert SNAKE_CASE to sentence case
  const words = cleaned.toLowerCase().split('_').map(word => {
    // Capitalize first letter of each word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(' ') + ' request';
}

// Helper function to convert ACTION_TYPE to option ID
function convertActionTypeToId(actionType: string): string {
  // Remove trailing "_REQUEST" if present to avoid double "request"
  let cleaned = actionType;
  if (cleaned.endsWith('_REQUEST')) {
    cleaned = cleaned.slice(0, -8); // Remove "_REQUEST"
  }
  return cleaned.toLowerCase().replace(/_/g, '-') + '-request';
}

// CSV data parsed into structure
const approvalRequestData = [
  { app: "Apps", actionType: "APPS_REQUEST" },
  { app: "Apps", actionType: "APP_INSTALL_REQUEST" },
  { app: "Banking", actionType: "BANKING_NEW_PAYMENT_REQUEST" },
  { app: "Benefits", actionType: "BENEFITS_CARRIER_REQUEST" },
  { app: "Chat", actionType: "CHAT_CHANNEL_CREATION" },
  { app: "Chat", actionType: "CHAT_CHANNEL_GROUPS_UPDATE" },
  { app: "Contractor hub", actionType: "CONTRACT_CREATION" },
  { app: "Contractor hub", actionType: "INVOICE_SUBMISSION" },
  { app: "Contractor hub", actionType: "CONTRACT_NEGOTIATION" },
  { app: "Custom objects", actionType: "CUSTOM_OBJECT_DATA_ROW_DELETE" },
  { app: "Custom objects", actionType: "CUSTOM_OBJECT_DATA_ROW_CREATE" },
  { app: "Custom objects", actionType: "CUSTOM_OBJECT_DATA_ROW_UPDATE" },
  { app: "Custom objects", actionType: "CUSTOM_OBJECT_DATA_ROW_RUN_BUSINESS_PROCESS" },
  { app: "Devices", actionType: "DEVICES_REQUEST" },
  { app: "Global payroll", actionType: "GLOBAL_PAYROLL_PROCESS_REQUEST_APPROVAL" },
  { app: "Headcount", actionType: "BACKFILL_HEADCOUNT" },
  { app: "Headcount", actionType: "NEW_HEADCOUNT" },
  { app: "Headcount", actionType: "EDIT_HEADCOUNT" },
  { app: "Headcount", actionType: "CLOSE_HEADCOUNT" },
  { app: "Headcount", actionType: "FORECASTED_ATTRITION_HEADCOUNT" },
  { app: "Headcount", actionType: "HEADCOUNT" },
  { app: "HRIS", actionType: "TRANSITION" },
  { app: "HRIS", actionType: "PERSONAL_INFO_CHANGES" },
  { app: "Payroll", actionType: "PAYROLL_RUN_REQUEST_APPROVAL" },
  { app: "Permissions", actionType: "GRANT_DEVELOPER_PERMISSION" },
  { app: "Procurement", actionType: "PROCUREMENT_REQUEST" },
  { app: "Recruiting", actionType: "ATS_OFFER_LETTER_REQUEST" },
  { app: "Recruiting", actionType: "ATS_JOB_REQUISITION_CREATE_REQUEST" },
  { app: "Recruiting", actionType: "ATS_JOB_REQUISITION_EDIT_REQUEST" },
  { app: "Recruiting", actionType: "ATS_DECISION_TO_HIRE_REQUEST" },
  { app: "RPass", actionType: "RPASS_REQUEST" },
  { app: "Scheduling", actionType: "SCHEDULING_CHANGE_REQUEST" },
  { app: "Scheduling", actionType: "SCHEDULING_EDIT_SHIFT" },
  { app: "Scheduling", actionType: "SCHEDULING_COVER_OFFER" },
  { app: "Scheduling", actionType: "SCHEDULING_DROP_SHIFT" },
  { app: "Scheduling", actionType: "SCHEDULING_SWAP_OFFER" },
  { app: "Scheduling", actionType: "SCHEDULING_EMPLOYEE_SHIFT_CONFIRM" },
  { app: "Scheduling", actionType: "SCHEDULING_SHIFT_PUBLISH" },
  { app: "Scheduling", actionType: "SCHEDULING_EMPLOYEE_SHIFT_PUBLISH" },
  { app: "Transformations", actionType: "REFRESH_SCHEDULE_CHANGE" },
  { app: "Spend", actionType: "SPEND_REQUEST" },
  { app: "Time and attendance", actionType: "TIME_ENTRY" },
  { app: "Travel", actionType: "FLIGHT_APPROVAL_REQUEST" },
  { app: "Travel", actionType: "FLIGHT_PRE_APPROVAL_REQUEST" },
  { app: "Variable Comp", actionType: "VARIABLE_COMPENSATION_PAYEE_PAYOUT_V1" },
];

// Group by app
const groupedByApp = approvalRequestData.reduce((acc, item) => {
  if (!acc[item.app]) {
    acc[item.app] = [];
  }
  acc[item.app].push(item.actionType);
  return acc;
}, {} as Record<string, string[]>);

// Create trigger categories for modal 2
// Start with the original categories and modify only the "something-happens" category
export const triggerCategoriesModal2: TriggerCategory[] = triggerCategories.map(category => {
  if (category.id === "something-happens") {
    // Get the original items from the "something-happens" category
    const originalItems = category.items;
    
    // Create new items from approval request data
    const approvalRequestItems = Object.entries(groupedByApp).map(([app, actionTypes]) => ({
      id: app.toLowerCase().replace(/\s+/g, '-'),
      label: app,
      options: actionTypes.map(actionType => ({
        id: convertActionTypeToId(actionType),
        label: convertActionTypeToLabel(actionType),
      })),
    }));
    
    // Find items to merge
    const hrManagementItem = originalItems.find(item => item.id === "hr-management");
    const hrisItem = approvalRequestItems.find(item => item.label === "HRIS");
    const timeOffItem = originalItems.find(item => item.id === "time-off");
    const timeOffApprovalItem = approvalRequestItems.find(item => item.label === "Time off");
    const itItem = originalItems.find(item => item.id === "it");
    const itApprovalItem = approvalRequestItems.find(item => item.label === "IT");
    const recruitingItem = originalItems.find(item => item.id === "recruiting-something");
    const recruitingApprovalItem = approvalRequestItems.find(item => item.label === "Recruiting");
    
    // Categories that should stay at the top level
    const topLevelCategories = ["documents", "hr-management", "learning-management-something", "recruiting-something", "surveys", "time-off"];
    
    // Create merged items for top level
    const topLevelItems: typeof originalItems = [];
    
    // Merge HR Management and HRIS
    if (hrManagementItem && hrisItem) {
      // Filter out Personal info change request and transition request from HRIS options
      const filteredHrisOptions = (hrisItem.options || []).filter(opt => 
        opt.id !== "personal-info-changes-request" && opt.id !== "transition-request"
      );
      // Update "New hire request" to "Hiring request" in HR Management options
      const updatedHrManagementOptions = (hrManagementItem.options || []).map(opt => 
        opt.id === "new-hire-status" ? { ...opt, label: "Hiring request" } : opt
      );
      topLevelItems.push({
        ...hrManagementItem,
        label: "HR Management",
        options: [...updatedHrManagementOptions, ...filteredHrisOptions],
      });
    } else if (hrManagementItem) {
      // Update "New hire request" to "Hiring request" in HR Management options
      const updatedHrManagementOptions = (hrManagementItem.options || []).map(opt => 
        opt.id === "new-hire-status" ? { ...opt, label: "Hiring request" } : opt
      );
      topLevelItems.push({
        ...hrManagementItem,
        options: updatedHrManagementOptions,
      });
    } else if (hrisItem) {
      // Filter out Personal info change request and transition request from HRIS options
      const filteredHrisOptions = (hrisItem.options || []).filter(opt => 
        opt.id !== "personal-info-changes-request" && opt.id !== "transition-request"
      );
      topLevelItems.push({
        ...hrisItem,
        label: "HR Management",
        options: filteredHrisOptions,
      });
    }
    
    // Merge Time Off
    if (timeOffItem && timeOffApprovalItem) {
      topLevelItems.push({
        ...timeOffItem,
        options: [...(timeOffItem.options || []), ...(timeOffApprovalItem.options || [])],
      });
    } else if (timeOffItem) {
      topLevelItems.push(timeOffItem);
    } else if (timeOffApprovalItem) {
      topLevelItems.push(timeOffApprovalItem);
    }
    
    // Merge Recruiting
    if (recruitingItem && recruitingApprovalItem) {
      // Filter out ATS options from Recruiting approval item
      const filteredRecruitingApprovalOptions = (recruitingApprovalItem.options || []).filter(opt => 
        opt.id !== "ats-offer-letter-request" && 
        opt.id !== "ats-job-requisition-create-request" && 
        opt.id !== "ats-job-requisition-edit-request" && 
        opt.id !== "ats-decision-to-hire-request"
      );
      topLevelItems.push({
        ...recruitingItem,
        options: [...(recruitingItem.options || []), ...filteredRecruitingApprovalOptions],
      });
    } else if (recruitingItem) {
      topLevelItems.push(recruitingItem);
    } else if (recruitingApprovalItem) {
      // Filter out ATS options from Recruiting approval item
      const filteredRecruitingApprovalOptions = (recruitingApprovalItem.options || []).filter(opt => 
        opt.id !== "ats-offer-letter-request" && 
        opt.id !== "ats-job-requisition-create-request" && 
        opt.id !== "ats-job-requisition-edit-request" && 
        opt.id !== "ats-decision-to-hire-request"
      );
      topLevelItems.push({
        ...recruitingApprovalItem,
        options: filteredRecruitingApprovalOptions,
      });
    }
    
    // Add other top-level categories (Documents, Learning Management, Surveys)
    originalItems.forEach(item => {
      if (["documents", "learning-management-something", "surveys"].includes(item.id)) {
        topLevelItems.push(item);
      }
    });
    
    // Create items that should go under Approvals
    const approvalsSubItems: typeof originalItems = [];
    
    // Add original items that should be moved to Approvals (excluding top-level ones)
    originalItems.forEach(item => {
      if (!topLevelCategories.includes(item.id) && item.id !== "approvals") {
        approvalsSubItems.push(item);
      }
    });
    
    // Add all approval request items (excluding the ones we merged into top-level)
    approvalRequestItems.forEach(item => {
      const labelLower = item.label.toLowerCase();
      if (!["hris", "time off", "it", "recruiting"].includes(labelLower)) {
        approvalsSubItems.push(item);
      }
    });
    
    // Add merged IT item to approvals
    if (itItem && itApprovalItem) {
      approvalsSubItems.push({
        ...itItem,
        options: [...(itItem.options || []), ...(itApprovalItem.options || [])],
      });
    } else if (itItem) {
      approvalsSubItems.push(itItem);
    } else if (itApprovalItem) {
      approvalsSubItems.push(itApprovalItem);
    }
    
    // Add HR Management to Approvals with specific options
    const hrManagementApprovalsItem = {
      id: "hr-management-approvals",
      label: "HR Management",
      options: [
        { id: "new-hire-status", label: "Hiring request" },
        { id: "termination-request-status", label: "Termination request" },
        { id: "profile-change-status", label: "Employment change request" },
        { id: "personal-info-changes-request", label: "Personal info change request" },
      ],
    };
    approvalsSubItems.push(hrManagementApprovalsItem);
    
    // Add Recruiting to Approvals with specific options
    const recruitingApprovalsItem = {
      id: "recruiting-approvals",
      label: "Recruiting",
      options: [
        { id: "ats-offer-letter-request", label: "ATS offer letter request" },
        { id: "ats-job-requisition-create-request", label: "ATS Job requisition create request" },
        { id: "ats-job-requisition-edit-request", label: "ATS Job requisition edit request" },
        { id: "ats-decision-to-hire-request", label: "ATS decision to hire request" },
      ],
    };
    approvalsSubItems.push(recruitingApprovalsItem);
    
    // Add Time off to Approvals with specific options
    const timeOffApprovalsItem = {
      id: "time-off-approvals",
      label: "Time off",
      options: [
        { id: "leave-request-status", label: "Leave request" },
      ],
    };
    approvalsSubItems.push(timeOffApprovalsItem);
    
    // Sort approvals sub-items alphabetically by label
    approvalsSubItems.sort((a, b) => a.label.localeCompare(b.label));
    
    // Create the Approvals item with both options and sub-items
    const approvalsItem = {
      id: "approvals",
      label: "Approvals",
      options: [
        { id: "request-is-approved", label: "Any request is approved" },
        { id: "request-is-rejected", label: "Any request is rejected" },
      ],
      items: approvalsSubItems,
    };
    
    // Combine top-level items with Approvals
    const finalItems = [...topLevelItems, approvalsItem];
    
    // Sort top-level items alphabetically by label
    finalItems.sort((a, b) => a.label.localeCompare(b.label));
    
    return {
      ...category,
      items: finalItems,
    };
  }
  // Keep all other categories unchanged
  return category;
});
