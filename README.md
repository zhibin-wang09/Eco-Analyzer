# Eco-Analyzer

# Start Guide

# Note
For anyone who is contributing to this repo you WILL need to use `git lfs`(*git large storage*). It serves as an way to by pass the git restriction
on 100MB file size upload to the repo. 

`git lfs` make the uploaded file serve as a pointer to the actual content. `filename` -> `actual content of file`. 

## To install `git lfs`
For windows: [here](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage?platform=windows)

For mac: [here](https://git-lfs.com)

More explanation: [here](https://medium.com/swlh/learning-about-git-large-file-system-lfs-72e0c86cfbaf)

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