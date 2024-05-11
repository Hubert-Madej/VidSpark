import { VideoProcessingStatus } from "../enums/video-processing-status.enum";

export interface Video {
  id?: string;
  uid?: string;
  videoFileName?: string;
  status?: VideoProcessingStatus;
  title?: string;
  description?: string;
  thumbnailFileName?: string;
}