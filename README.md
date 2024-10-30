# Eco-Analyzer

# Start Guide

# Server
To start the server, you will need to supply a bash script to load environment variables for `application.properties` file within Spring Boot.

The example file looks like below

*set_env.sh*
```
#!/bin/bash

# Set environment variables
export MONGO_USERNAME=_
export MONGO_PASSWORD=_
export MONGO_DB_NAME=_
```
It is required that this file is named **set_env.sh**

It is recommended to add the script on the same directory as `mvnw` file.

The command to run the script:
`source set script.sh`

Then in the same shell that the script was ran in run the following command to start the project:
`./mvnw sprint-boot:run`