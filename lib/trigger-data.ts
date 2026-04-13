export interface TriggerOption {
  id: string;
  label: string;
  dataType?: string;
  description?: string;
}

export interface TriggerItem {
  id: string;
  label: string;
  options?: TriggerOption[];
  items?: TriggerItem[];
}

export interface TriggerCategory {
  id: string;
  label: string;
  items: TriggerItem[];
}

export const triggerCategories: TriggerCategory[] = [
  {
    id: "popular",
    label: "Popular use cases",
    items: [
      {
        id: "onboarding",
        label: "Onboarding",
        options: [
          { id: "employment-agreement-status", label: "Employment agreement is sent" },
          { id: "first-start-date", label: "First start date" },
          { id: "offer-status", label: "Offer is accepted" },
          { id: "new-hire-status", label: "New hire request" },
          { id: "probation-period-end-date", label: "Probation period end date" },
          { id: "start-date", label: "Start date" },
          { id: "start-date-as-employee", label: "Start date as employee (non-contractor)" },
        ],
      },
      {
        id: "offboarding",
        label: "Offboarding",
        options: [
          { id: "rippling-access-shut-off", label: "Rippling access is shut off" },
          { id: "termination-request-status", label: "Termination request" },
          { id: "projected-end-date", label: "Projected end date" },
          { id: "last-day-of-work", label: "Last day of work" },
        ],
      },
      {
        id: "transition",
        label: "Transition",
        options: [
          { id: "profile-change-status", label: "Profile change" },
          { id: "object-employee-any-record", label: "Any Employee record" },
          { id: "object-employee-department", label: "Department change", dataType: "Link", description: "The department this individual belongs to" },
          { id: "object-employee-work-location", label: "Work location change", dataType: "Link", description: "Link to the work location" },
          { id: "object-employee-base-compensation", label: "Compensation change", dataType: "Currency", description: "The employee's base compensation amount" },
        ],
      },
      {
        id: "leave-management",
        label: "Leave management",
        options: [
          { id: "leave-request-status", label: "Leave request" },
          { id: "employee-goes-on-leave", label: "Employee goes on leave" },
          { id: "employee-returns-from-leave", label: "Employee returns from leave" },
          { id: "leave-start-date", label: "Leave start date" },
          { id: "leave-end-date", label: "Leave end date" },
        ],
      },
      {
        id: "learning-management",
        label: "Learning management",
        options: [
          { id: "course-due-date", label: "Course due date" },
          { id: "course-start-date", label: "Course start date" },
          { id: "course-completed", label: "Course completed" },
        ],
      },
      {
        id: "pay-runs",
        label: "Pay runs",
        options: [
          { id: "company-pay-run-approval-date", label: "Company pay run approval date" },
          { id: "company-pay-run-approval-deadline", label: "Company pay run approval deadline" },
          { id: "company-pay-run-check-date", label: "Company pay run check date" },
          { id: "company-pay-run-pay-date", label: "Company pay run pay date" },
          { id: "company-pay-run-take-action-deadline", label: "Company pay run take action deadline" },
        ],
      },
      {
        id: "recruiting",
        label: "Recruiting",
        options: [
          { id: "applicant-profile-status", label: "Applicant profile" },
          { id: "job-requisition-status", label: "Job requisition" },
          { id: "ats-applicant-reaches-specific-state", label: "Applicant moves to a new stage" },
          { id: "application-status", label: "Application" },
          { id: "applicant-hits-milestone", label: "Applicant hits a new milestone" },
          { id: "applicant-moves-to-offer-stage", label: "Applicant moves to offer stage" },
          { id: "last-interaction-date", label: "Last interaction date" },
          { id: "rejected-at-date", label: "Rejected at date" },
          { id: "applied-at-date", label: "Applied at date" },
        ],
      },
      {
        id: "anniversaries",
        label: "Anniversaries",
        options: [
          { id: "birthday", label: "Birthday" },
          { id: "work-anniversary", label: "Work anniversary" },
        ],
      },
    ],
  },
  {
    id: "relative-to-date",
    label: "Relative to a date",
    items: [
      {
        id: "object-employee",
        label: "Employee",
        options: [
          { id: "contract-duration-end-date", label: "Contract duration end date" },
          { id: "current-entity-information-start-date", label: "Current entity information - start date" },
          { id: "date-joined-rippling", label: "Date joined Rippling" },
          { id: "date-of-birth", label: "Date of birth" },
          { id: "effective-from-salary-date", label: "Effective from salary date" },
          { id: "equity-grant-date", label: "Equity grant date" },
          { id: "expected-date-for-ssn", label: "Expected date for SSN" },
          { id: "extended-probation-period-end-date", label: "Extended probation period end date" },
          { id: "first-start-date", label: "First start date" },
          { id: "invitation-date", label: "Invitation date" },
          { id: "last-day-of-work", label: "Last day of work" },
          { id: "last-password-change-date", label: "Last password change date" },
          { id: "last-password-reset-date", label: "Last password reset date" },
          { id: "next-event-based-leave-end-date", label: "Next event-based leave end date" },
          { id: "next-event-based-leave-start-date", label: "Next event-based leave start date" },
          { id: "offer-accepted-date", label: "Offer accepted date" },
          { id: "offer-expiration-date", label: "Offer expiration date" },
          { id: "probation-period-end-date", label: "Probation period end date" },
          { id: "projected-end-date", label: "Projected end date" },
          { id: "start-date", label: "Start date" },
          { id: "start-date-as-employee-non-contractor", label: "Start date as employee (non-contractor)" },
          { id: "start-date-with-current-entity", label: "Start date with current entity" },
        ],
      },
      {
        id: "object-time-off",
        label: "Time Off",
        options: [
          { id: "leave-end-date", label: "Leave end date" },
          { id: "leave-request-creation-date", label: "Leave request creation date" },
          { id: "processed-at", label: "Processed at" },
          { id: "start-date", label: "Start Date" },
        ],
      },
      {
        id: "object-accounting-integrations",
        label: "Accounting Integrations",
        options: [],
      },
      {
        id: "object-brex",
        label: "Brex",
        options: [],
      },
      {
        id: "object-compliance-360",
        label: "Compliance 360",
        options: [],
      },
      {
        id: "object-custom-objects",
        label: "Custom objects",
        options: [],
      },
      {
        id: "object-devices",
        label: "Devices",
        options: [],
      },
      {
        id: "object-documents",
        label: "Documents",
        options: [],
      },
      {
        id: "object-files",
        label: "Files",
        options: [],
      },
      {
        id: "object-ge-task",
        label: "GE Task",
        options: [],
      },
      {
        id: "object-global-payroll",
        label: "Global Payroll",
        options: [],
      },
      {
        id: "object-goals",
        label: "Goals",
        options: [],
      },
      {
        id: "object-google-workspace",
        label: "Google Workspace",
        options: [],
      },
      {
        id: "object-hr-ticketing-template",
        label: "HR Ticketing Template",
        options: [],
      },
      {
        id: "object-insurance-benefits",
        label: "Insurance & Benefits",
        options: [],
      },
      {
        id: "object-it-activity-log-alpha",
        label: "IT Activity Log (Alpha)",
        options: [],
      },
      {
        id: "object-it-management",
        label: "IT Management",
        options: [],
      },
      {
        id: "object-jira",
        label: "Jira",
        options: [],
      },
      {
        id: "object-learning-management",
        label: "Learning Management",
        options: [],
      },
      {
        id: "object-live-learning",
        label: "Live Learning",
        options: [],
      },
      {
        id: "object-organizational-data",
        label: "Organizational data",
        options: [],
      },
      {
        id: "object-payroll",
        label: "Payroll",
        options: [],
      },
      {
        id: "object-pto-custom-object",
        label: "PTO Custom Object",
        options: [],
      },
      {
        id: "object-recruiting",
        label: "Recruiting",
        options: [],
      },
      {
        id: "object-review-cycles",
        label: "Review Cycles",
        options: [],
      },
      {
        id: "object-scheduling",
        label: "Scheduling",
        options: [],
      },
      {
        id: "object-spend-management",
        label: "Spend Management",
        options: [],
      },
      {
        id: "object-survey",
        label: "Survey",
        options: [],
      },
      {
        id: "object-surveys-v2",
        label: "Surveys V2",
        options: [],
      },
      {
        id: "object-synthetic-public-domain-event",
        label: "Synthetic Public Domain Event",
        options: [],
      },
      {
        id: "object-synthetic-tests",
        label: "Synthetic Tests",
        options: [],
      },
      {
        id: "object-task-changes",
        label: "Task change",
        options: [],
      },
      {
        id: "object-tasks-notifications",
        label: "Tasks & Notifications",
        options: [],
      },
      {
        id: "object-test-object",
        label: "Test Object",
        options: [],
      },
      {
        id: "object-time-attendance",
        label: "Time & Attendance",
        options: [],
      },
      {
        id: "object-travel",
        label: "Travel",
        options: [],
      },
      {
        id: "object-vendors",
        label: "Vendors",
        options: [],
      },
    ],
  },
  {
    id: "set-schedule",
    label: "On a set schedule",
    items: [
      {
        id: "set-schedule-root",
        label: "On a set schedule",
        options: [{ id: "set-schedule-config", label: "On a set schedule" }],
      },
    ],
  },
  {
    id: "something-happens",
    label: "Common events",
    items: [
      {
        id: "hr-management",
        label: "HR Management",
        options: [
          { id: "new-hire-status", label: "New hire request" },
          { id: "offer-status", label: "Offer is accepted" },
          { id: "employment-agreement-status", label: "Employment agreement is sent" },
          { id: "profile-change-status", label: "Profile change" },
          { id: "rippling-access-shut-off", label: "Rippling access is shut off" },
          { id: "termination-request-status", label: "Termination request" },
        ],
      },
      {
        id: "time-off",
        label: "Time Off",
        options: [
          { id: "leave-request-status", label: "Leave request" },
          { id: "employee-goes-on-leave", label: "Employee goes on leave" },
          { id: "employee-returns-from-leave", label: "Employee returns from leave" },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        options: [
          { id: "document-status", label: "Document" },
        ],
      },
      {
        id: "recruiting-something",
        label: "Recruiting",
        options: [
          { id: "applicant-profile-status", label: "Applicant profile" },
          { id: "job-requisition-status", label: "Job requisition" },
          { id: "ats-applicant-reaches-specific-state", label: "Applicant moves to a new stage" },
          { id: "application-status", label: "Application" },
          { id: "applicant-hits-milestone", label: "Applicant hits a new milestone" },
          { id: "applicant-moves-to-offer-stage", label: "Applicant moves to offer stage" },
          { id: "rejection-reason-status", label: "Rejection reason" },
          { id: "interview-canceled", label: "Interview Canceled" },
        ],
      },
      {
        id: "learning-management-something",
        label: "Learning Management",
        options: [
          { id: "course-completed", label: "Course completed" },
        ],
      },
      {
        id: "approvals",
        label: "Approvals",
        options: [
          { id: "request-is-approved", label: "Request is approved" },
          { id: "request-is-rejected", label: "Request is rejected" },
        ],
      },
      {
        id: "it",
        label: "IT",
        options: [
          { id: "app-access-request-status", label: "App access request" },
        ],
      },
    ],
  },
  {
    id: "object-creation-updates",
    label: "Data change",
    items: [
      {
        id: "object-employee",
            label: "Employee",
            options: [
              { id: "object-employee-any-record", label: "Any Employee record" },
              { id: "object-employee-field", label: "Employee change", dataType: "Text", description: "The worker's full name" },
              { id: "object-employee-department", label: "Department change", dataType: "Link", description: "The department this individual belongs to" },
              { id: "object-employee-work-location-name", label: "Work location name change", dataType: "Text", description: "Work location name" },
              { id: "object-employee-manager", label: "Manager change", dataType: "Link", description: "The individual's manager" },
              { id: "object-employee-work-email", label: "Work email change", dataType: "Text", description: "The employee's work email address" },
              { id: "object-employee-start-date", label: "Start date change", dataType: "Date", description: "The date the employee started" },
              { id: "object-employee-phone-number", label: "Phone number change", dataType: "Link", description: "The employee's phone number" },
              { id: "object-employee-title", label: "Title change", dataType: "Text", description: "The employee's job title" },
              { id: "object-employee-employment-status", label: "Employment status change", dataType: "Choice", description: "The current employment status of the employee" },
              { id: "object-employee-employment-type-name", label: "Employment type name change", dataType: "Text", description: "The name of the employment type" },
              { id: "object-employee-last-day-of-work", label: "Last day of work change", dataType: "Date", description: "The employee's last day of work" },
              { id: "object-employee-level-name", label: "Level name change", dataType: "Text", description: "The employee's level name" },
              { id: "object-employee-job-family-name", label: "Job family name change", dataType: "Text", description: "The employee's job family name" },
              { id: "object-employee-legal-gender", label: "Legal gender change", dataType: "Choice", description: "The employee's legal gender" },
              { id: "object-employee-employee-link", label: "Employee change", dataType: "Link", description: "Link to the employee record" },
              { id: "object-employee-probation-period-end-date", label: "Probation period end date change", dataType: "Date", description: "The end date of the probation period" },
              { id: "object-employee-contract-duration-end-date", label: "Contract duration end date change", dataType: "Date", description: "The end date of the contract duration" },
              { id: "object-employee-employment-type", label: "Employment type change", dataType: "Link", description: "Link to the employment type" },
              { id: "object-employee-flsa-exemption-status", label: "FLSA exemption status change", dataType: "Boolean", description: "Whether the employee is FLSA exempt" },
              { id: "object-employee-worker-collect-tips", label: "Worker collect tips change", dataType: "Boolean", description: "Whether the worker collects tips" },
              { id: "object-employee-work-location", label: "Work location change", dataType: "Link", description: "Link to the work location" },
              { id: "object-employee-base-compensation", label: "Base compensation change", dataType: "Currency", description: "The employee's base compensation amount" },
              { id: "object-employee-compensation-time-period", label: "Compensation time period change", dataType: "Choice", description: "The time period for compensation" },
              { id: "object-employee-payment-type", label: "Payment type change", dataType: "Choice", description: "The type of payment" },
              { id: "object-employee-type-of-equity", label: "Type of equity change", dataType: "Choice", description: "The type of equity" },
              { id: "object-employee-type-of-equity-other", label: "Type of equity other change", dataType: "Text", description: "Other type of equity" },
              { id: "object-employee-onboarding-status", label: "Current entity information - onboarding status change", dataType: "Text", description: "Status of a person's onboarding with an entity. If a person has completed the entire onboarding flow, the status will be completed, otherwise pending." },
              { id: "object-employee-offer-letter-status", label: "Current entity information - offer letter status change", dataType: "Text", description: "This is the status of a persons offer letter with a specific entity" },
              { id: "object-employee-legal-entity-name", label: "Current entity information - legal entity name change", dataType: "Text", description: "The legal entity for which the employee works or the entity that the contractor is contracted by" },
              { id: "object-employee-country", label: "Current entity information - country change", dataType: "Text", description: "The country code of the legal entity for which the individual currently works" },
              { id: "object-employee-entity-information", label: "Entity information change", dataType: "Link", description: "Legal entities that the employee works for" },
              { id: "object-employee-role-transition-details", label: "Role Transition Details change", dataType: "Link", description: "Transition details for the employee" },
              { id: "object-employee-work-auth-request", label: "Work Auth Request change", dataType: "Link", description: "Work authorization request" },
              { id: "object-employee-i9-details", label: "I9 details change", dataType: "Link", description: "Employee's I9 details" },
              { id: "object-employee-everify-details", label: "E-verify details change", dataType: "Link", description: "Employee's e-verify details" },
              { id: "object-employee-application", label: "Application change", dataType: "Link", description: "The Rippling Recruiting application linked to this employee" },
              { id: "object-employee-work-auth-document", label: "Work Auth Document change", dataType: "Link", description: "Work authorization proof" },
              { id: "object-employee-spend-transactions", label: "Spend Transactions change", dataType: "Link", description: "Employee's Spend Transactions" },
              { id: "object-employee-devices-inventory", label: "Devices change", dataType: "Link", description: "Navigate to attributes of the employee's inventory management device(s)" },
            ],
          },
      {
        id: "object-time-off",
            label: "Time Off",
            options: [],
          },
      {
        id: "object-accounting-integrations",
            label: "Accounting Integrations",
            options: [],
          },
      {
        id: "object-brex",
            label: "Brex",
            options: [],
          },
      {
        id: "object-compliance-360",
            label: "Compliance 360",
            options: [],
          },
      {
        id: "object-custom-objects",
            label: "Custom objects",
            options: [
              { id: "rwebb_co_department", label: "rwebb_co_department" },
              { id: "rwebb_co_work_location", label: "rwebb_co_work_location" },
              { id: "rwebb_co_manager", label: "rwebb_co_manager" },
              { id: "rwebb_co_title", label: "rwebb_co_title" },
              { id: "rwebb_co_employment_status", label: "rwebb_co_employment_status" },
              { id: "rwebb_co_base_compensation", label: "rwebb_co_base_compensation" },
              { id: "rwebb_co_last_day_of_work", label: "rwebb_co_last_day_of_work" },
            ],
          },
      {
        id: "object-devices",
            label: "Devices",
            options: [],
          },
      {
        id: "object-documents",
            label: "Documents",
            options: [],
          },
      {
        id: "object-files",
            label: "Files",
            options: [],
          },
      {
        id: "object-ge-task",
            label: "GE Task",
            options: [],
          },
      {
        id: "object-global-payroll",
            label: "Global Payroll",
            options: [],
          },
      {
        id: "object-goals",
            label: "Goals",
            options: [],
          },
      {
        id: "object-google-workspace",
            label: "Google Workspace",
            options: [],
          },
      {
        id: "object-hr-ticketing-template",
            label: "HR Ticketing Template",
            options: [],
          },
      {
        id: "object-insurance-benefits",
            label: "Insurance & Benefits",
            options: [],
          },
      {
        id: "object-it-activity-log-alpha",
            label: "IT Activity Log (Alpha)",
            options: [],
          },
      {
        id: "object-it-management",
            label: "IT Management",
            options: [],
          },
      {
        id: "object-jira",
            label: "Jira",
            options: [],
          },
      {
        id: "object-learning-management",
            label: "Learning Management",
            options: [],
          },
      {
        id: "object-live-learning",
            label: "Live Learning",
            options: [],
          },
      {
        id: "object-organizational-data",
            label: "Organizational data",
            options: [],
          },
      {
        id: "object-payroll",
            label: "Payroll",
            options: [],
          },
      {
        id: "object-pto-custom-object",
            label: "PTO Custom Object",
            options: [],
          },
      {
        id: "object-recruiting",
            label: "Recruiting",
            options: [],
          },
      {
        id: "object-review-cycles",
            label: "Review Cycles",
            options: [],
          },
      {
        id: "object-scheduling",
            label: "Scheduling",
            options: [],
          },
      {
        id: "object-spend-management",
            label: "Spend Management",
            options: [],
          },
      {
        id: "object-survey",
            label: "Survey",
            options: [],
          },
      {
        id: "object-surveys-v2",
            label: "Surveys V2",
            options: [],
          },
      {
        id: "object-synthetic-public-domain-event",
            label: "Synthetic Public Domain Event",
            options: [],
          },
      {
        id: "object-synthetic-tests",
            label: "Synthetic Tests",
            options: [],
          },
      {
        id: "object-task-changes",
            label: "Task change",
            options: [],
          },
      {
        id: "object-tasks-notifications",
            label: "Tasks & Notifications",
            options: [],
          },
      {
        id: "object-test-object",
            label: "Test Object",
            options: [],
          },
      {
        id: "object-time-attendance",
            label: "Time & Attendance",
            options: [],
          },
      {
        id: "object-travel",
            label: "Travel",
            options: [],
          },
      {
        id: "object-vendors",
            label: "Vendors",
            options: [],
          },
        ],
      },
  {
    id: "manual",
    label: "Trigger manually",
    items: [],
  },
];
