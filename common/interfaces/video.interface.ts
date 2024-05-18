import { VideoProcessingStatus } from "../enums/video-processing-status.enum";
import { VideoVisiblity } from "../enums/video-visiblity.enum";

export interface Video {
  id: string;
  uid: string;
  videoFileName: string;
  processingStatus: VideoProcessingStatus;
  visibility: VideoVisiblity;
  title: string;
  description: string;
  thumbnailFileName: string;
}