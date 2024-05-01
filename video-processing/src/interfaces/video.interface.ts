import {VideoProcessingStatus} from "@enums/video-processing-status.enum";

// @TODO: Add interface sharing across services.
/**
 * Data Source model for Video Metadata.
 */
export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: VideoProcessingStatus;
  title?: string;
  description?: string;
}
