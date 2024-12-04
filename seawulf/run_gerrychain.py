import os
import json
import random
import pickle
import time
from collections import defaultdict
from functools import partial
from multiprocessing import Pool, cpu_count

import geopandas as gpd
import pandas as pd
import numpy as np
import networkx as nx
from shapely.geometry import Point
from gerrychain import Graph, Partition, MarkovChain
from gerrychain.constraints import within_percent_of_ideal_population
from gerrychain.proposals import recom
from gerrychain.updaters import Tally, cut_edges

# Constants and file paths
GEOJSON_FILE = "./AR/ar_precinct.json"
STATE_REPS_FILE = "./AR/AR State Reps.json"
RACE_FILE = "./AR/AR Race.json"
INCOME_FILE = "./AR/AR Income.json"
POVERTY_FILE = "./AR/AR Poverty.json"
ELECTION_FILE = "./AR/AR Election.json"
URBANICITY_FILE = "./AR/AR Urbanicity.json"
GRAPH_FILE = "./test/AR_graph3.gpickle"
SEA_WULF_DIR = "./seawulf_data_AR"
PLANS_DIR = os.path.join(SEA_WULF_DIR, "plans")
EPSILON = 0.05
os.makedirs(PLANS_DIR, exist_ok=True)

# Utility functions
def convert_to_native(obj):
    """Recursively convert numpy types to Python native types."""
    if isinstance(obj, dict):
        return {convert_to_native(key): convert_to_native(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_native(element) for element in obj]
    elif isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj


def find_valid_partition(graph, updaters, max_attempts=1000, timeout=300):
    """Attempt to find a valid initial partition within the constraints."""
    start_time = time.time()
    unique_districts = {
        data["district"] for _, data in graph.nodes(data=True) if "district" in data
    }
    attempt = 0

    while attempt < max_attempts:
        attempt += 1
        if time.time() - start_time > timeout:
            raise TimeoutError("Failed to find a valid partition within the allotted time.")

        initial_assignment = {
            node: random.choice(list(unique_districts)) for node in graph.nodes
        }
        for node, district in initial_assignment.items():
            graph.nodes[node]["district"] = district

        initial_partition = Partition(graph, assignment="district", updaters=updaters)
        district_populations = initial_partition["population"]

        if all(
            ideal_population * (1 - EPSILON)
            <= pop
            <= ideal_population * (1 + EPSILON)
            for pop in district_populations.values()
        ):
            return initial_partition

    raise ValueError("Failed to find a valid initial partition within the allowed attempts.")


# Load or generate graph
if os.path.exists(GRAPH_FILE):
    with open(GRAPH_FILE, "rb") as file:
        graph = pickle.load(file)
else:
    geo_data = gpd.read_file(GEOJSON_FILE)
    geo_data["precinct_id"] = geo_data["geoId"]

    state_reps_data = pd.read_json(STATE_REPS_FILE)
    geo_data = geo_data.merge(
        state_reps_data[["precinct_id", "parentDistrict"]],
        on="precinct_id",
        how="left",
    )
    geo_data["district"] = geo_data["parentDistrict"]

    race_data = pd.read_json(RACE_FILE)
    race_data["population"] = race_data["race"].apply(lambda x: x["population"])
    race_data = race_data[["precinct_id", "population"]]

    election_data = pd.read_json(ELECTION_FILE)
    election_data["R"] = election_data["voting"].apply(lambda x: x.get("trump_votes", 0))
    election_data["D"] = election_data["voting"].apply(lambda x: x.get("biden_votes", 0))
    election_data = election_data[["precinct_id", "R", "D"]]

    poverty_data = pd.read_json(POVERTY_FILE)
    poverty_data["total_household"] = poverty_data["poverty"].apply(
        lambda x: x.get("total_household", 0)
    )
    poverty_data = poverty_data[["precinct_id", "total_household"]]

    urbanicity_data = pd.read_json(URBANICITY_FILE)
    urbanicity_data["density"] = urbanicity_data["density"]
    urbanicity_data.rename(columns={"precinct_data": "precinct_id"}, inplace=True)
    urbanicity_data = urbanicity_data[["precinct_id", "density"]]

    income_data = pd.read_json(INCOME_FILE)
    income_data["average_income"] = income_data["income"].apply(
        lambda x: x.get("average_income", 0)
    )
    income_data = income_data[["precinct_id", "average_income"]]

    merged_data = race_data.merge(income_data, on="precinct_id", how="outer")
    merged_data = merged_data.merge(election_data, on="precinct_id", how="outer")
    merged_data = merged_data.merge(poverty_data, on="precinct_id", how="outer")
    merged_data = merged_data.merge(urbanicity_data, on="precinct_id", how="outer")

    geo_data = geo_data.merge(merged_data, on="precinct_id", how="left")
    geo_data["population"] = geo_data["population"].fillna(0)

    geo_data["geometry"] = geo_data["geometry"].apply(
        lambda geom: geom.buffer(0) if geom is not None and not geom.is_valid else geom
    )
    geo_data = geo_data[~(geo_data.geometry.is_empty | geo_data.geometry.isna())]
    geo_data = geo_data.dissolve(by="precinct_id", as_index=False, aggfunc="first")

    graph = Graph.from_geodataframe(geo_data, ignore_errors=True)
    with open(GRAPH_FILE, "wb") as file:
        pickle.dump(graph, file)

# Calculate population metrics
processed_precincts = set()
total_population = 0
for node, data in graph.nodes(data=True):
    precinct_id = data.get("precinct_id")
    if precinct_id in processed_precincts:
        continue
    processed_precincts.add(precinct_id)
    total_population += int(data.get("population", 0))

num_districts = len({data["district"] for _, data in graph.nodes(data=True)})
ideal_population = total_population / num_districts

# Set up updaters
updaters = {
    "population": Tally("population", alias="population"),
    "cut_edges": cut_edges,
}

initial_partition = find_valid_partition(graph, updaters)


def generate_district_plans(core_id, steps_per_core, output_prefix="test_ensemble"):
    """Generate random district plans using ReCom."""
    plans_dir = os.path.join(SEA_WULF_DIR, "plans")
    os.makedirs(plans_dir, exist_ok=True)

    # Instantiate the Markov Chain
    chain = MarkovChain(
        proposal=partial(recom, pop_col="population", pop_target=ideal_population, epsilon=EPSILON),
        constraints=[within_percent_of_ideal_population(initial_partition, EPSILON)],
        accept=lambda p: True,
        initial_state=initial_partition,
        total_steps=steps_per_core,
    )

    for step, partition in enumerate(chain):
        # Convert the assignment to a dictionary
        plan = {precinct: int(district) for precinct, district in partition.assignment.items()}

        # Aggregate data for each district
        district_data = defaultdict(
            lambda: {
                "R": 0, "D": 0, "total_population": 0, "white": 0, "black": 0, "asian": 0, "hispanic": 0, "other": 0,
                "total_household": 0, "poverty_household": 0, "density_sum": 0, "income_sum": 0, "precincts": 0,
                "urbanicity_types": defaultdict(int)  # To count urbanicity types
            }
        )

        # Track processed precincts
        processed_precincts = set()

        # Collect district-level information
        for precinct, district in partition.assignment.items():
            node_data = graph.nodes[precinct]
            precinct_id = node_data.get("precinct_id", None)

            # Skip duplicate precincts
            if precinct_id in processed_precincts:
                continue
            processed_precincts.add(precinct_id)

            # Aggregate election results
            district_data[district]["R"] += int(node_data.get("R", 0))
            district_data[district]["D"] += int(node_data.get("D", 0))

            # Aggregate demographic data
            district_data[district]["total_population"] += int(node_data.get("population", 0))
            district_data[district]["white"] += int(node_data.get("white", 0))
            district_data[district]["black"] += int(node_data.get("black", 0))
            district_data[district]["asian"] += int(node_data.get("asian", 0))
            district_data[district]["hispanic"] += int(node_data.get("hispanic", 0))
            district_data[district]["other"] += int(node_data.get("other", 0))

            # Aggregate poverty and income data
            district_data[district]["total_household"] += int(node_data.get("total_household", 0))
            district_data[district]["poverty_household"] += int(node_data.get("poverty_household", 0))
            district_data[district]["income_sum"] += int(node_data.get("average_income", 0))

            # Aggregate density data
            district_data[district]["density_sum"] += float(node_data.get("density", 0))

            # Count urbanicity types
            urbanicity_type = node_data.get("urbanicity_type", "Unknown")
            district_data[district]["urbanicity_types"][urbanicity_type] += 1

            # Count the number of precincts in the district
            district_data[district]["precincts"] += 1

        # Finalize district-level summaries
        district_summaries = {}
        for district, data in district_data.items():
            avg_density = data["density_sum"] / data["precincts"] if data["precincts"] > 0 else 0
            avg_income = data["income_sum"] / data["precincts"] if data["precincts"] > 0 else 0

            # Determine the majority urbanicity type
            urbanicity_majority = max(data["urbanicity_types"], key=data["urbanicity_types"].get)

            district_summaries[district] = {
                "total_population": data["total_population"],
                "white": data["white"],
                "black": data["black"],
                "asian": data["asian"],
                "hispanic": data["hispanic"],
                "other": data["other"],
                "R": data["R"],
                "D": data["D"],
                "total_household": data["total_household"],
                "poverty_household": data["poverty_household"],
                "average_density": avg_density,
                "average_income": avg_income,
                "urbanicity_majority": urbanicity_majority,
            }

        # Save the plan summary to a file
        plan_summary = {
            "plan": plan,
            "district_summaries": district_summaries,
        }

        # Convert to native Python types
        plan_summary = convert_to_native(plan_summary)

        plan_file = os.path.join(plans_dir, f"{output_prefix}_core_{core_id}_step_{step}.json")
        with open(plan_file, "w") as f:
            json.dump(plan_summary, f, indent=2)


def main_multiprocessing(total_steps, num_cores):
    """Run the district plan generation using multiprocessing."""
    steps_per_core = total_steps // num_cores
    with Pool(num_cores) as pool:
        pool.starmap(
            generate_district_plans,
            [(core_id, steps_per_core, "test_ensemble") for core_id in range(num_cores)],
        )


if __name__ == "__main__":
    total_steps = 250
    num_cores = cpu_count()
    main_multiprocessing(total_steps, num_cores)
