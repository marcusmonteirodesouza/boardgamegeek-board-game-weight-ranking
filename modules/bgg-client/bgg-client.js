class ThingType {
  constructor(name) {
    this.name = name;
  }
}

const ThingTypeEnum = Object.freeze({
  BoardGame: new ThingType('boardgame'),
});

class HotItemType {
  constructor(name) {
    this.name = name;
  }
}

const HotItemTypeEnum = Object.freeze({
  BoardGame: new HotItemType('boardgame'),
});

/**
 * Board Game Geek Client. See https://boardgamegeek.com/wiki/page/BGG_XML_API2
 */
class BGGClient {
  #baseUrl = 'https://boardgamegeek.com/xmlapi2';
  #parser = new DOMParser();

  /**
   *
   * @param {Object} params
   */
  async getThingItems(params) {
    const url = new URL(`${this.#baseUrl}/thing`);

    if (params.ids && params.ids.length > 0) {
      url.searchParams.append('id', params.ids.join(','));
    }

    if (params.thingTypes && params.thingTypes.length > 0) {
      if (
        !params.thingTypes.every((element, i) => element instanceof ThingType)
      ) {
        throw new RangeError(
          `invalid argument 'params.thingTypes'. Expected all elements to be instances of 'ThingType'. Received ${element} at index ${i}.`
        );
      }
      url.searchParams.append(
        'type',
        params.thingTypes.map((thingType) => thingType.name).join(',')
      );
    }

    if (params.stats) {
      url.searchParams.append('stats', 1);
    }

    url.search = decodeURIComponent(url.search);

    const response = await fetch(url);

    const xmlStr = await response.text();

    const xmlDoc = this.#parser.parseFromString(xmlStr, 'application/xml');

    const items = Array.from(xmlDoc.querySelectorAll('item'), (itemNode) => {
      const id = itemNode.getAttribute('id');

      const thumbnail = itemNode.querySelector('thumbnail').textContent;

      const image = itemNode.querySelector('image').textContent;

      const name = itemNode.querySelector('name').getAttribute('value');

      const description = itemNode.querySelector('description').textContent;

      const yearpublished = Number.parseInt(
        itemNode.querySelector('yearpublished').getAttribute('value')
      );

      const minplayers = Number.parseInt(
        itemNode.querySelector('minplayers').getAttribute('value')
      );

      const maxplayers = Number.parseInt(
        itemNode.querySelector('maxplayers').getAttribute('value')
      );

      const statisticsNode = itemNode.querySelector('statistics');

      const statistics = {
        ranks: Array.from(statisticsNode.querySelectorAll('rank')).map(
          (rank) => {
            return {
              name: rank.getAttribute('name'),
              friendlyname: rank.getAttribute('friendlyname'),
              value:
                rank.getAttribute('value') === 'Not Ranked'
                  ? null
                  : Number.parseInt(rank.getAttribute('value')),
            };
          }
        ),
        numweights: Number.parseInt(
          statisticsNode.querySelector('numweights').getAttribute('value')
        ),
        averageweight: Number.parseFloat(
          statisticsNode.querySelector('averageweight').getAttribute('value')
        ),
      };

      return {
        id,
        thumbnail,
        image,
        name,
        description,
        yearpublished,
        minplayers,
        maxplayers,
        statistics,
      };
    });

    return items;
  }

  /**
   * Retrieve the list of most active items on the BGG site.
   * @param {HotItemType} type
   */
  async getHotItems(type) {
    const url = `${this.#baseUrl}/hot?${type.name}`;

    const response = await fetch(url);

    const xmlStr = await response.text();

    const xmlDoc = this.#parser.parseFromString(xmlStr, 'application/xml');

    const items = Array.from(xmlDoc.querySelectorAll('item'), (itemNode) => {
      const id = itemNode.getAttribute('id');

      const rank =
        itemNode.getAttribute('rank') === 'Not Ranked'
          ? null
          : Number.parseInt(itemNode.getAttribute('rank'));

      const thumbnail = itemNode
        .querySelector('thumbnail')
        .getAttribute('value');

      const name = itemNode.querySelector('name').getAttribute('value');

      const yearpublished = Number.parseInt(
        itemNode.querySelector('yearpublished').getAttribute('value')
      );

      const item = {
        id,
        rank,
        thumbnail,
        name,
        yearpublished,
      };

      return item;
    });

    return items;
  }
}

const bggClient = new BGGClient();

export { bggClient, ThingTypeEnum, HotItemTypeEnum };
