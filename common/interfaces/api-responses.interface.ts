export interface GenerateUploadUrlResponse {
  url: string;
  fileName: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextPageToken: string;
}