import {
  bggClient,
  HotItemTypeEnum,
  ThingTypeEnum,
} from './modules/bgg-client/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const hotItems = await bggClient.getHotItems(HotItemTypeEnum.BoardGame);
  console.log('hotItems', hotItems);

  const boardGames = await bggClient.getThingItems({
    ids: hotItems.map((item) => item.id),
    thingTypes: [ThingTypeEnum.BoardGame],
    stats: true,
  });

  console.log('boardGames', boardGames);
});
