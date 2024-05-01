import { VideoProcessingStatus } from "../enums/video-processing-status.enum";

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: VideoProcessingStatus;
  title?: string;
  description?: string;
}
