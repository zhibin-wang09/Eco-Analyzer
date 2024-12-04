import json
import os
import math

# Calculate the area of the precinct
def calculateArea(coordinates):

    area = 0

    for i in range(len(coordinates) - 1):
        x = coordinates[i][0]
        y = coordinates[i][1]

        x1 = coordinates[i + 1][0]
        y1 = coordinates[i + 1][1]

        try:
            area += (x * y1 - x1 * y)
        except:
            pass

    return area / 2


# Calculate the average latitude of the precinct using all of its coordinates
def calculateAverageLatitude(coordinates):

    result = 0

    # In the case of bad coordinate data
    for i in range(len(coordinates)):
        try:
            result += coordinates[i][1]
        except:
            pass

    return result / len(coordinates)


# Convert the area of the precinct to square miles
def calculateSquareMiles(area, averageLatitude):
    
    radians = averageLatitude * (math.pi / 180)
    conversion = 69 * 69 * math.cos(radians)

    return area * conversion


# Get the urbanicity of the precinct along with its respective shading info
def getShadingInfo(currDensity):

    if currDensity <= 500:
        return {
            'shading': '#fcf528',
            'type': 'Rural'
        }
    elif currDensity <= 1000:
        return {
            'shading': '#fc8f28',
            'type': 'Suburban'
        }
    else:
        return {
            'shading': '#fc2828',
            'type': 'Urban'
        }



# Open the state precinct file along with its population data set
script_dir = os.path.dirname(os.path.abspath(__file__))
precinct_file_path = os.path.join(script_dir, 'arkansas_precincts.geojson')
population_file_path = os.path.join(script_dir, 'AR Race.json')

# precinct_file_path = os.path.join(script_dir, 'ny_precincts_new.geojson')
# population_file_path = os.path.join(script_dir, 'NY Race.json')

with open(precinct_file_path, 'r') as file:
    precinctGeometry = json.load(file)

with open(population_file_path, 'r') as file:
    populationData = json.load(file)


output = []

for i in range(len(precinctGeometry['features'])):

    currArea = calculateArea(precinctGeometry['features'][i]['geometry']['coordinates'][0])

    currAverageLatitude = calculateAverageLatitude(precinctGeometry['features'][i]['geometry']['coordinates'][0])

    currSquareMileArea = calculateSquareMiles(currArea, currAverageLatitude)

    try:
        currPopDensity = populationData[0]['race']['population'] / currSquareMileArea
    except:
        currPopDensity = 0
    
    currShadingInfo = getShadingInfo(currPopDensity)

    output.append(
        {
            'precinctId': precinctGeometry['features'][i]['properties']['NAME20'],
            'density': currPopDensity,
            'type': currShadingInfo['type'],
            'shading': currShadingInfo['shading']
        }
    )

with open('./AR Precinct Urbanicity.json', 'w') as file:
    json.dump(output, file, indent=4)
