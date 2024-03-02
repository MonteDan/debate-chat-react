import PocketBase from "pocketbase";

const pb = new PocketBase("https://debate-chat.pockethost.io");
pb.autoCancellation(false)
export default pb;
