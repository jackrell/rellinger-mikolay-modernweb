#!/usr/bin/env python3
import json
import time
import argparse
import logging
from nba_api.stats.static import players as static_players
from nba_api.stats.endpoints import commonplayerinfo, playerprofilev2
from requests.exceptions import ReadTimeout
from http.client import RemoteDisconnected

# Set up basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

MAX_RETRIES = 3
BACKOFF_FACTOR = 1  # seconds multiplier for backoff


def fetch_with_retry(fn, *args, **kwargs):
    """
    Call fn(*args, **kwargs) with retry on ReadTimeout.
    Returns the result or None if all retries fail.
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return fn(*args, **kwargs)
        except (ReadTimeout, RemoteDisconnected) as e:
            logging.warning(f"Timeout on attempt {attempt}/{MAX_RETRIES} for {fn.__name__}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(BACKOFF_FACTOR * attempt)
                continue
            logging.error(f"Max retries reached for {fn.__name__}; skipping.")
            return None
        except Exception as e:
            logging.error(f"Error calling {fn.__name__}: {e}")
            return None



def fetch_player_data(player, status):
    pid = player.get('id')
    name = player.get('full_name') or player.get('name')

    # Fetch and parse common player info with extended timeout
    info_obj = fetch_with_retry(
        commonplayerinfo.CommonPlayerInfo,
        player_id=pid,
        timeout=60  # increase read timeout
    )
    if not info_obj:
        return None
    norm = info_obj.get_normalized_dict()
    cp_info = norm.get('CommonPlayerInfo', [])
    row = cp_info[0] if cp_info else {}

    school = row.get('SCHOOL')
    height = row.get('HEIGHT', '0-0')
    weight = row.get('WEIGHT', '0')
    team = row.get('TEAM_ABBREVIATION')

    # Convert height and weight
    try:
        ft, inch = map(int, height.split('-'))
        height_cm = round((ft * 12 + inch) * 2.54, 2)
    except Exception:
        height_cm = 0.0
    try:
        weight_lbs = float(weight)
    except Exception:
        weight_lbs = 0.0

    # Fetch and parse last-season stats with extended timeout
    stats_obj = fetch_with_retry(
        playerprofilev2.PlayerProfileV2,
        player_id=pid,
        timeout=60  # increase read timeout
    )
    ppg = rpg = apg = 0.0
    if stats_obj:
        dfs = stats_obj.get_data_frames()
        if dfs and not dfs[0].empty:
            df = dfs[0]
            latest = df.loc[df['SEASON_ID'].idxmax()]
            gp = latest.get('GP') or 1
            ppg = round(latest.get('PTS', 0) / gp, 1)
            rpg = round(latest.get('REB', 0) / gp, 1)
            apg = round(latest.get('AST', 0) / gp, 1)

    return {
        'id': pid,
        'name': name,
        'status': status,
        'team': team,
        'college': school,
        'height_cm': height_cm,
        'weight_lbs': weight_lbs,
        'ppg': ppg,
        'rpg': rpg,
        'apg': apg
    }


def main():
    parser = argparse.ArgumentParser(description='Fetch NBA player data and dump to JSON.')
    parser.add_argument('--limit', type=int, help='Only process first N players')
    parser.add_argument('--single', type=int, help='Only fetch data for this player ID')
    parser.add_argument('--status', choices=['active', 'inactive', 'both'], default='both',
                        help='Which players to include')
    parser.add_argument('--dry-run', action='store_true',
                        help='Print JSON to stdout without writing file or sleeping')
    parser.add_argument('--output', type=str,
                        default='../public/players_enhanced.json',
                        help='Path to write the resulting JSON'
    )
    args = parser.parse_args()

    # Load player lists
    active = static_players.get_active_players()
    inactive = static_players.get_inactive_players()

    # Build pool
    if args.status == 'active':
        pool = [('active', p) for p in active]
    elif args.status == 'inactive':
        pool = [('inactive', p) for p in inactive]
        print(len(pool))
    else:
        pool = [('active', p) for p in active] + [('inactive', p) for p in inactive]

    # Apply --single or --limit
    if args.single:
        pool = [(s, p) for (s, p) in pool if p.get('id') == args.single]
    elif args.limit:
        pool = pool[:args.limit]

    out = []
    for status, ply in pool:
        result = fetch_player_data(ply, status)
        if result:
            out.append(result)
        else:
            logging.info(f"Skipping player ID {ply.get('id')} due to repeated errors.")
        if not args.dry_run:
            time.sleep(0.6)

    if args.dry_run:
        print(json.dumps(out, indent=2))
    else:
        output_path = args.output
        with open(output_path, 'w') as f:
            json.dump(out, f, indent=2)
        logging.info(f'Wrote {len(out)} players to {output_path}')


if __name__ == '__main__':
    main()

