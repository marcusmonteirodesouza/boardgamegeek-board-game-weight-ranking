import {
  bggClient,
  HotItemTypeEnum,
  ThingTypeEnum,
} from './modules/bgg-client/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const hotBoardGames = await bggClient.getHotItems(HotItemTypeEnum.BoardGame);

  const boardGames = await bggClient.getThingItems({
    ids: hotBoardGames.map((item) => item.id),
    thingTypes: [ThingTypeEnum.BoardGame],
    stats: true,
  });

  const boardGamesSortedByWeight = _.sortBy(boardGames, [
    function (boardGame) {
      return -boardGame.statistics.averageweight;
    },
  ]);

  const hotBoardGamesWeightRankingTableBody = document
    .getElementById('hot-board-games-weight-ranking-table')
    .querySelector('tbody');

  for (const boardGame of boardGamesSortedByWeight) {
    const newRow = hotBoardGamesWeightRankingTableBody.insertRow();

    const thumbnailCell = newRow.insertCell();
    const thumbnailNode = document.createElement('img');
    thumbnailNode.src = boardGame.thumbnail;
    thumbnailCell.appendChild(thumbnailNode);

    const nameCell = newRow.insertCell();
    const nameNode = document.createTextNode(boardGame.name);
    nameCell.appendChild(nameNode);

    const descriptionCell = newRow.insertCell();
    const descriptionNode = document.createElement('div');
    descriptionNode.innerHTML = boardGame.description;
    descriptionCell.appendChild(descriptionNode);

    const yearPublishedCell = newRow.insertCell();
    const yearPublishedNode = document.createTextNode(boardGame.yearpublished);
    yearPublishedCell.appendChild(yearPublishedNode);

    const rankCell = newRow.insertCell();
    const rankNode = document.createTextNode(
      boardGame.statistics.ranks.find((rank) => rank.name === 'boardgame').value
    );
    rankCell.appendChild(rankNode);

    const averageWeightCell = newRow.insertCell();
    const averageWeightNode = document.createTextNode(
      boardGame.statistics.averageweight
    );
    averageWeightCell.appendChild(averageWeightNode);

    const numWeightsCell = newRow.insertCell();
    const numWeightsNode = document.createTextNode(
      boardGame.statistics.numweights
    );
    numWeightsCell.appendChild(numWeightsNode);
  }
});
