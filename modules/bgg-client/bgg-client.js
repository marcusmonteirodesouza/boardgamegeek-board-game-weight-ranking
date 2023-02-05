class HotItemType {
  static boardgame = "boardgame";

  /**
   * Creates a HotItemType instance.
   * @param {string} name  valid values are: 'boardgame'.
   */
  constructor(name) {
    this.name = name;
  }
}

const boardGameHotItemType = new HotItemType(HotItemType.boardgame);

/**
 * Board Game Geek Client. See https://boardgamegeek.com/wiki/page/BGG_XML_API2
 */
class BGGClient {
  #baseUrl = "https://boardgamegeek.com/xmlapi2";
  #parser = new DOMParser();

  /**
   * Retrieve the list of most active items on the BGG site.
   * @param {HotItemType} type
   */
  async getHotItems(type) {
    const url = `${this.#baseUrl}/hot?${type.name}`;

    const response = await fetch(url);

    const xmlStr = await response.text();

    const xmlDoc = this.#parser.parseFromString(xmlStr, "application/xml");

    const items = Array.from(xmlDoc.querySelectorAll("item"), (itemNode) => {
      const id = itemNode.getAttribute("id");
      const rank = itemNode.getAttribute("rank");
      const thumbnail = itemNode
        .querySelector("thumbnail")
        .getAttribute("value");
      const name = itemNode.querySelector("name").getAttribute("value");
      const yearpublished = itemNode
        .querySelector("yearpublished")
        .getAttribute("value");

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

export { bggClient, boardGameHotItemType };
