import re
from requests_html import HTMLSession


class BGGClient:
    def get_board_games_ids_by_rank(self):
        session = HTMLSession()

        board_games_ids = []

        for page_number in range(1, 3):
            url = f"https://boardgamegeek.com/browse/boardgame/page/${page_number}"

            r = session.get(url=url)

            number_of_rows = len(r.html.find("#row_"))

            for i in range(1, number_of_rows):
                board_game_name_node = r.html.find(f"#results_objectname{i}")[0]
                board_game_details_href = board_game_name_node.find("a")[0].attrs[
                    "href"
                ]
                board_game_id = int(
                    re.findall(r"boardgame/\d+", board_game_details_href)[0].split("/")[
                        1
                    ]
                )
                board_game_id = int(board_game_id)
                board_games_ids.append(board_game_id)

        return board_games_ids
