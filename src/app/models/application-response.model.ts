export interface ApprovalNote {
  role: string;
  text: string;
}

export interface ApplicationResponse {
    id: string; // UUID as string
    customerId: string;
    customerName: string;
    amount: number; // BigDecimal -> number
    purpose: string;
    status: string;
    createdAt: string; // LocalDateTime serialized as ISO string
    updatedAt: string;
  
    marketingAssignedName?: string;
    branchManagerAssignedName?: string;
    backOfficeAssignedName?: string;
  
    marketingAssignedTime?: string;
    branchManagerAssignedTime?: string;
    backOfficeAssignedTime?: string;
  
    tenor?: number;
    limitType?: string;
    limitAmount?: number;
    interestRate?: number;
    noteMarketing?: string;
    noteBranchManager?: string;
    noteBackOffice?: string;
    nipMarketing?: string;
    nipBranchManager?: string;
    nipBackOffice?: string;

    approvalNotes?: ApprovalNote[];
  }


