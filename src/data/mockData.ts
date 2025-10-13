export interface Quote {
  id: string;
  quoteNumber: string;
  companyNames: string[];
  projectName: string;
  totalFlowmeters: number;
  totalValue: number;
  status: 'Active' | 'Order expected' | 'Long-shot opportunity' | 'Project/Longterm' | 'Non-responsive';
  dateOfLastResponse: string;
  summaryOfLastResponse: string;
  automatedFollowupFrequency: 'Every 10 days' | 'Every 30 days' | 'Every 60 days' | 'Every 90 days' | 'Manual only';
  managerNotes: string;
  isCold: boolean;
  isArchived: boolean;
  clientName?: string;
  lastFollowUp?: string;
  projectType?: string;
  amount?: number;
}

export interface Meeting {
  id: string;
  dateTime: string;
  quoteId: string;
  contactPerson: string;
  location: string;
}

export const mockQuotes: Quote[] = [
  {
    id: 'Q-2025-001',
    quoteNumber: 'Q-2025-001',
    companyNames: ['Acme Corporation', 'Acme Industrial'],
    projectName: 'Refinery Expansion Project',
    totalFlowmeters: 24,
    totalValue: 145000,
    status: 'Active',
    dateOfLastResponse: '2025-09-28',
    summaryOfLastResponse: 'Client confirmed budget approval. Awaiting final technical specifications from engineering team. Expected decision timeline: 2 weeks.',
    automatedFollowupFrequency: 'Every 10 days',
    managerNotes: 'High priority client. Strong relationship with procurement manager.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-002',
    quoteNumber: 'Q-2025-002',
    companyNames: ['TechStart Inc'],
    projectName: 'Water Treatment Facility',
    totalFlowmeters: 15,
    totalValue: 78000,
    status: 'Order expected',
    dateOfLastResponse: '2025-09-30',
    summaryOfLastResponse: 'Purchase order in final approval stage. Client mentioned timeline of next week for PO release.',
    automatedFollowupFrequency: 'Every 10 days',
    managerNotes: 'Follow up on Wednesday for PO status.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-003',
    quoteNumber: 'Q-2025-003',
    companyNames: ['Global Solutions'],
    projectName: 'Pipeline Monitoring System',
    totalFlowmeters: 42,
    totalValue: 225000,
    status: 'Non-responsive',
    dateOfLastResponse: '2025-08-15',
    summaryOfLastResponse: 'Initial interest expressed but no response to follow-up emails. Last contact mentioned budget constraints.',
    automatedFollowupFrequency: 'Every 60 days',
    managerNotes: 'Try different contact person. Project may be delayed.',
    isCold: true,
    isArchived: false
  },
  {
    id: 'Q-2025-004',
    quoteNumber: 'Q-2025-004',
    companyNames: ['Innovation Labs', 'Innovation Process Control'],
    projectName: 'Chemical Processing Upgrade',
    totalFlowmeters: 18,
    totalValue: 92000,
    status: 'Active',
    dateOfLastResponse: '2025-10-01',
    summaryOfLastResponse: 'Requested additional technical documentation for internal review. Engineering team evaluating specs.',
    automatedFollowupFrequency: 'Every 10 days',
    managerNotes: 'Send technical specs by Friday.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-005',
    quoteNumber: 'Q-2025-005',
    companyNames: ['Marketing Pro'],
    projectName: 'Gas Flow Measurement',
    totalFlowmeters: 8,
    totalValue: 34000,
    status: 'Non-responsive',
    dateOfLastResponse: '2025-07-20',
    summaryOfLastResponse: 'Client mentioned project on hold due to funding issues. No response to recent check-ins.',
    automatedFollowupFrequency: 'Every 90 days',
    managerNotes: 'Low priority. Check quarterly.',
    isCold: true,
    isArchived: false
  },
  {
    id: 'Q-2025-006',
    quoteNumber: 'Q-2025-006',
    companyNames: ['Finance Plus'],
    projectName: 'Oil & Gas Distribution',
    totalFlowmeters: 30,
    totalValue: 165000,
    status: 'Project/Longterm',
    dateOfLastResponse: '2025-09-25',
    summaryOfLastResponse: 'Long-term project planned for Q2 2026. Client maintaining contact for planning purposes.',
    automatedFollowupFrequency: 'Every 60 days',
    managerNotes: 'Schedule quarterly check-ins. Good long-term prospect.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-007',
    quoteNumber: 'Q-2025-007',
    companyNames: ['HealthCare Systems'],
    projectName: 'Medical Gas Monitoring',
    totalFlowmeters: 12,
    totalValue: 58000,
    status: 'Active',
    dateOfLastResponse: '2025-10-02',
    summaryOfLastResponse: 'Quote under review by facilities management. Meeting scheduled for next week to discuss implementation.',
    automatedFollowupFrequency: 'Every 10 days',
    managerNotes: 'Prepare presentation for upcoming meeting.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-008',
    quoteNumber: 'Q-2025-008',
    companyNames: ['EduTech Solutions'],
    projectName: 'HVAC System Upgrade',
    totalFlowmeters: 20,
    totalValue: 72000,
    status: 'Non-responsive',
    dateOfLastResponse: '2025-08-01',
    summaryOfLastResponse: 'No response after initial quote submission. Multiple follow-up attempts made.',
    automatedFollowupFrequency: 'Manual only',
    managerNotes: 'Wait for client to reach out. Low priority.',
    isCold: true,
    isArchived: false
  },
  {
    id: 'Q-2025-009',
    quoteNumber: 'Q-2025-009',
    companyNames: ['RetailMax', 'RetailMax Distribution'],
    projectName: 'Manufacturing Flow Control',
    totalFlowmeters: 16,
    totalValue: 84000,
    status: 'Long-shot opportunity',
    dateOfLastResponse: '2025-09-29',
    summaryOfLastResponse: 'Client comparing multiple vendors. Price-sensitive project. Requested best and final pricing.',
    automatedFollowupFrequency: 'Every 30 days',
    managerNotes: 'Consider discount if necessary to win project.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-010',
    quoteNumber: 'Q-2025-010',
    companyNames: ['CloudNet Services'],
    projectName: 'Data Center Cooling',
    totalFlowmeters: 10,
    totalValue: 45000,
    status: 'Order expected',
    dateOfLastResponse: '2025-09-27',
    summaryOfLastResponse: 'Verbal confirmation received. Waiting for formal PO. Expected within 5 business days.',
    automatedFollowupFrequency: 'Every 10 days',
    managerNotes: 'High confidence. Prepare for quick turnaround.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-011',
    quoteNumber: 'Q-2025-011',
    companyNames: ['Media Group'],
    projectName: 'Process Water Metering',
    totalFlowmeters: 14,
    totalValue: 56000,
    status: 'Active',
    dateOfLastResponse: '2025-09-26',
    summaryOfLastResponse: 'Technical questions answered. Client working on internal approval process.',
    automatedFollowupFrequency: 'Every 10 days',
    managerNotes: 'Strong technical fit. Good rapport with engineer.',
    isCold: false,
    isArchived: false
  },
  {
    id: 'Q-2025-012',
    quoteNumber: 'Q-2025-012',
    companyNames: ['AutoParts Ltd'],
    projectName: 'Automotive Assembly Line',
    totalFlowmeters: 25,
    totalValue: 110000,
    status: 'Non-responsive',
    dateOfLastResponse: '2025-07-10',
    summaryOfLastResponse: 'Initial discussion went well but no follow-through. Client may have chosen competitor.',
    automatedFollowupFrequency: 'Manual only',
    managerNotes: 'Likely lost. Keep on file for future opportunities.',
    isCold: true,
    isArchived: false
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'M-001',
    dateTime: '2025-10-05T10:00:00',
    quoteId: 'Q-2025-001',
    contactPerson: 'John Smith',
    location: 'Virtual - Zoom'
  },
  {
    id: 'M-002',
    dateTime: '2025-10-07T14:30:00',
    quoteId: 'Q-2025-004',
    contactPerson: 'Sarah Johnson',
    location: 'Office - Conference Room A'
  },
  {
    id: 'M-003',
    dateTime: '2025-10-08T11:00:00',
    quoteId: 'Q-2025-007',
    contactPerson: 'Michael Chen',
    location: 'Client Site'
  },
  {
    id: 'M-004',
    dateTime: '2025-10-10T15:00:00',
    quoteId: 'Q-2025-002',
    contactPerson: 'Emily Davis',
    location: 'Virtual - Teams'
  },
  {
    id: 'M-005',
    dateTime: '2025-10-12T09:30:00',
    quoteId: 'Q-2025-011',
    contactPerson: 'Robert Wilson',
    location: 'Office - Conference Room B'
  }
];
