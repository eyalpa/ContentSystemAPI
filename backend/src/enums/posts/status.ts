export const Status = {
    Approved: 'Approved',
    PendingApproval: 'Pending approval'
} as const;

export type Status = keyof typeof Status;
