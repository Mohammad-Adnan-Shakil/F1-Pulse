"""
Enhanced ML Feature Engineering for F1 Predictions
Uses historical data from PostgreSQL database to build rich features
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta


def fetch_driver_statistics(driver_id, race_date, conn):
    """Fetch career statistics for a driver up to a specific race date"""
    cursor = conn.cursor()
    
    # Career stats (all-time)
    cursor.execute("""
        SELECT 
            COUNT(*) as total_races,
            SUM(CASE WHEN finish_position = 1 THEN 1 ELSE 0 END) as total_wins,
            SUM(CASE WHEN finish_position <= 3 THEN 1 ELSE 0 END) as total_podiums,
            SUM(CASE WHEN grid_position = 1 THEN 1 ELSE 0 END) as total_poles,
            AVG(CASE WHEN finish_position IS NOT NULL THEN finish_position ELSE NULL END) as career_avg_finish
        FROM historical_result
        WHERE driver_id = %s AND 
              (SELECT race_date FROM historical_race WHERE id = race_id) < %s
    """, (driver_id, race_date))
    
    career = cursor.fetchone()
    
    # Recent 5 races
    cursor.execute("""
        SELECT AVG(finish_position) as recent_5_avg
        FROM (
            SELECT hr.finish_position
            FROM historical_result hr
            JOIN historical_race r ON hr.race_id = r.id
            WHERE hr.driver_id = %s AND r.race_date < %s
            ORDER BY r.race_date DESC
            LIMIT 5
        ) as t
    """, (driver_id, race_date))
    
    recent_5 = cursor.fetchone()[0]
    
    # Recent 10 races
    cursor.execute("""
        SELECT AVG(finish_position) as recent_10_avg
        FROM (
            SELECT hr.finish_position
            FROM historical_result hr
            JOIN historical_race r ON hr.race_id = r.id
            WHERE hr.driver_id = %s AND r.race_date < %s
            ORDER BY r.race_date DESC
            LIMIT 10
        ) as t
    """, (driver_id, race_date))
    
    recent_10 = cursor.fetchone()[0]
    
    cursor.close()
    
    return {
        'total_races': career[0] or 0,
        'total_wins': career[1] or 0,
        'total_poles': career[3] or 0,
        'career_avg_finish': float(career[4] or 0),
        'recent_5_avg': float(recent_5 or 0),
        'recent_10_avg': float(recent_10 or 0)
    }


def fetch_circuit_statistics(driver_id, circuit_name, race_date, conn):
    """Fetch driver's historical performance at a specific circuit"""
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            COUNT(*) as races_at_circuit,
            AVG(finish_position) as circuit_avg_finish,
            SUM(CASE WHEN finish_position = 1 THEN 1 ELSE 0 END) as wins_at_circuit,
            SUM(CASE WHEN grid_position = 1 THEN 1 ELSE 0 END) as poles_at_circuit
        FROM historical_result hr
        JOIN historical_race r ON hr.race_id = r.id
        WHERE hr.driver_id = %s AND r.circuit_name = %s AND r.race_date < %s
    """, (driver_id, circuit_name, race_date))
    
    result = cursor.fetchone()
    cursor.close()
    
    return {
        'circuit_races': result[0] or 0,
        'circuit_avg_finish': float(result[1] or 0),
        'circuit_wins': result[2] or 0,
        'circuit_poles': result[3] or 0
    }


def fetch_constructor_circuit_stats(constructor_id, circuit_name, race_date, conn):
    """Fetch constructor's historical performance at a specific circuit"""
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            COUNT(*) as races_at_circuit,
            AVG(finish_position) as circuit_avg_finish,
            SUM(CASE WHEN finish_position = 1 THEN 1 ELSE 0 END) as wins_at_circuit
        FROM historical_result hr
        JOIN historical_race r ON hr.race_id = r.id
        WHERE hr.constructor_id = %s AND r.circuit_name = %s AND r.race_date < %s
    """, (constructor_id, circuit_name, race_date))
    
    result = cursor.fetchone()
    cursor.close()
    
    return {
        'team_circuit_races': result[0] or 0,
        'team_circuit_avg_finish': float(result[1] or 0),
        'team_circuit_wins': result[2] or 0
    }


def fetch_season_statistics(driver_id, season_year, race_date, conn):
    """Fetch driver's current season performance"""
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            COUNT(*) as season_races,
            AVG(finish_position) as season_avg_finish,
            SUM(CASE WHEN finish_position = 1 THEN 1 ELSE 0 END) as season_wins
        FROM historical_result hr
        JOIN historical_race r ON hr.race_id = r.id
        WHERE hr.driver_id = %s AND r.season_year = %s AND r.race_date < %s
    """, (driver_id, season_year, race_date))
    
    result = cursor.fetchone()
    cursor.close()
    
    return {
        'season_races': result[0] or 0,
        'season_avg_finish': float(result[1] or 0),
        'season_wins': result[2] or 0
    }


def build_feature_vector(result_row, driver_stats, circuit_stats, constructor_stats, season_stats, conn):
    """
    Build enhanced feature vector for ML model
    
    Features:
    1. career_avg_finish
    2. career_wins
    3. career_poles
    4. recent_5_race_avg
    5. recent_10_race_avg
    6. circuit_avg_finish
    7. circuit_appearances
    8. season_avg_finish
    9. grid_position
    10. team_avg_finish
    11. years_experience
    12. championship_position (0 if unknown)
    """
    
    features = {
        'career_avg_finish': driver_stats.get('career_avg_finish', 0),
        'career_wins': driver_stats.get('total_wins', 0),
        'career_poles': driver_stats.get('total_poles', 0),
        'recent_5_avg': driver_stats.get('recent_5_avg', 0),
        'recent_10_avg': driver_stats.get('recent_10_avg', 0),
        'circuit_avg_finish': circuit_stats.get('circuit_avg_finish', 0),
        'circuit_appearances': circuit_stats.get('circuit_races', 0),
        'season_avg_finish': season_stats.get('season_avg_finish', 0),
        'grid_position': int(result_row['grid_position'] or 20),
        'team_avg_finish': constructor_stats.get('team_circuit_avg_finish', 0),
        'years_experience': driver_stats.get('total_races', 0),  # Proxy for experience
        'championship_position': 0  # Would need standings data
    }
    
    return features


def build_training_dataset(conn):
    """
    Build complete training dataset from historical_results
    Returns DataFrame ready for model training
    
    Only includes results where:
    - finish_position is not null
    - status = 'Finished'
    """
    
    cursor = conn.cursor()
    
    # Fetch all completed race results
    cursor.execute("""
        SELECT 
            hr.id,
            hr.driver_id,
            hr.constructor_id,
            hr.grid_position,
            hr.finish_position,
            r.season_year,
            r.circuit_name,
            r.race_date
        FROM historical_result hr
        JOIN historical_race r ON hr.race_id = r.id
        WHERE hr.finish_position IS NOT NULL
        AND hr.status = 'Finished'
        AND r.race_date < NOW()
        ORDER BY r.race_date
    """)
    
    rows = cursor.fetchall()
    cursor.close()
    
    features_list = []
    targets = []
    
    print(f"📊 Building training dataset from {len(rows)} completed races...")
    
    for i, row in enumerate(rows):
        if i % 100 == 0:
            print(f"  Processing race {i}/{len(rows)}...")
        
        result_id, driver_id, constructor_id, grid_pos, finish_pos, season_year, circuit_name, race_date = row
        
        try:
            # Get driver stats up to this race
            driver_stats = fetch_driver_statistics(driver_id, race_date, conn)
            circuit_stats = fetch_circuit_statistics(driver_id, circuit_name, race_date, conn)
            constructor_stats = fetch_constructor_circuit_stats(constructor_id, circuit_name, race_date, conn) if constructor_id else {}
            season_stats = fetch_season_statistics(driver_id, season_year, race_date, conn)
            
            # Build features
            features = build_feature_vector(
                {'grid_position': grid_pos},
                driver_stats,
                circuit_stats,
                constructor_stats,
                season_stats,
                conn
            )
            
            features_list.append(features)
            targets.append(finish_pos)
            
        except Exception as e:
            print(f"  ⚠️  Error processing race {result_id}: {e}")
            continue
    
    print(f"✅ Built {len(features_list)} training samples")
    
    df = pd.DataFrame(features_list)
    df['target_finish_position'] = targets
    
    return df


def get_feature_names():
    """Returns list of feature names in order"""
    return [
        'career_avg_finish',
        'career_wins',
        'career_poles',
        'recent_5_avg',
        'recent_10_avg',
        'circuit_avg_finish',
        'circuit_appearances',
        'season_avg_finish',
        'grid_position',
        'team_avg_finish',
        'years_experience',
        'championship_position'
    ]
