import { bggClient, ThingTypeEnum } from './modules/bgg-client/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const boardGamesIdsByRank = await bggClient.getBoardGamesIdsByRank();

  const boardGames = await bggClient.getThingItems({
    ids: boardGamesIdsByRank,
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
    const nameNode = document.createElement('div');
    nameNode.textContent = boardGame.name;
    nameNode.className = 'has-text-weight-medium';
    nameCell.appendChild(nameNode);

    const averageWeightCell = newRow.insertCell();
    const averageWeightNode = document.createElement('div');
    averageWeightNode.textContent = boardGame.statistics.averageweight;
    averageWeightNode.className = 'has-text-weight-semibold';
    averageWeightCell.appendChild(averageWeightNode);

    const numWeightsCell = newRow.insertCell();
    const numWeightsNode = document.createTextNode(
      boardGame.statistics.numweights
    );
    numWeightsCell.appendChild(numWeightsNode);

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
  }
});
