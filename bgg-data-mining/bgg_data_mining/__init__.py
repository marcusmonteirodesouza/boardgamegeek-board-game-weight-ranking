import json
import os
import os.path
from .bgg import BGGClient


def main():
    results_dir = os.path.join(os.getcwd(), "results")

    if not os.path.isdir(results_dir):
        os.mkdir(results_dir)

    bgg_client = BGGClient()
    board_games_ids_by_rank = bgg_client.get_board_games_ids_by_rank()

    with open(os.path.join(results_dir, "board-games-ids-by-rank.json"), "w") as f:
        json.dump(board_games_ids_by_rank, f)
