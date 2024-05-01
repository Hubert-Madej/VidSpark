import {IsString} from "class-validator";

export class VideoMetadata {
  @IsString()
    name: string;
}
