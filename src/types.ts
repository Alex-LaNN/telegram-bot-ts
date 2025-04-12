import { Message } from "telegraf/typings/core/types/typegram";

// Advanced interface for signed messages
export interface CaptionMessage extends Message.MediaMessage {
  caption?: string;
}
