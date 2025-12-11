export interface BulkOperationResult {
  message: string;
  successCount?: number;
  failedCount?: number;
  errors?: string[];
}

