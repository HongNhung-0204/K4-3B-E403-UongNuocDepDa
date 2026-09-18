import { handleChatRequest } from '../server/chatService';

export default {
  fetch(request: Request): Promise<Response> {
    return handleChatRequest(request);
  },
};
