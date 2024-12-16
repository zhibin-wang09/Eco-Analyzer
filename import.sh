#!/bin/bash

# Check if correct number of arguments is passed
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <input_file> <mongodb_uri> <collection_name>"
  exit 1
fi

# Assign arguments to variables
INPUT_FILE=$1
MONGO_URI=$2
COLLECTION_NAME=$3

# Check if the input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: File $INPUT_FILE does not exist."
  exit 1
fi

# Convert JSON to compact format using jq
OUTPUT_FILE="output.json"
jq --compact-output ".[]" "$INPUT_FILE" > "$OUTPUT_FILE"

# Check if jq command succeeded
if [ $? -ne 0 ]; then
  echo "Error: Failed to process $INPUT_FILE with jq."
  exit 1
fi

# Import the data into MongoDB using mongoimport
mongoimport --drop --uri "$MONGO_URI" --collection "$COLLECTION_NAME" --file "$OUTPUT_FILE"

# Check if mongoimport command succeeded
if [ $? -eq 0 ]; then
  echo "Data imported successfully into collection: $COLLECTION_NAME"
else
  echo "Error: Failed to import data into MongoDB."
  exit 1
fi

# Cleanup the temporary file
rm -f "$OUTPUT_FILE"