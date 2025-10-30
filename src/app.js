import { ChatModel } from "./model.js";
import { ChatView } from "./view.js";
import { ChatController } from "./controller.js";


const model = new ChatModel();
const view = new ChatView();
new ChatController(model, view);