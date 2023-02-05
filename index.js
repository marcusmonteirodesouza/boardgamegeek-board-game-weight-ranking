import { bggClient, boardGameHotItemType } from "./modules/bgg-client/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  const hotItems = await bggClient.getHotItems(boardGameHotItemType);
  console.log("hotItems", hotItems);
});
