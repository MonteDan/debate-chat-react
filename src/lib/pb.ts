import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.REACT_APP_PB_URL);

export default pb;
