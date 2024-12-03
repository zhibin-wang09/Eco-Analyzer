# Eco-Analyzer

# Pre-req
(Not required) For anyone who is contributing to this repo you might need to use `git lfs`(*git large storage*). It serves as an way to by pass the git restriction on 100MB file size upload to the repo. 
`git lfs` make the uploaded file serve as a pointer to the actual content. `filename` -> `actual content of file`. 

(Required) To install Redis Cache if the user of this repo is intended to start the spring boot application. To do so, please read the following
instructions.


## To install `git lfs`

For windows: [here](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage?platform=windows)

For mac: [here](https://git-lfs.com)

More explanation: [here](https://medium.com/swlh/learning-about-git-large-file-system-lfs-72e0c86cfbaf)

### To set up git-lfs for the project (Not required if there are no files > 100MB)
0. In this repo, do `git lfs install`
1. In this repo, do `git lfs track file1 file2 ...` for any files that is too large. Currently it is two the precinct geojsons in `client/public`
2. Then do `git lfs migrate info --include = "file1, file2"` **ONLY** if the commit failed otherwise skip this step
3. Now you can use git as usual, `git lfs` will handle the rest for us
If there's any questions refer to [medium article](https://medium.com/swlh/learning-about-git-large-file-system-lfs-72e0c86cfbaf)

## To install `redis-cache`
[here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

# Start Guide

## Server
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
Make this file executable by doing `chmod +x set_env.sh`

It is recommended to add the script on the same directory as `mvnw` file.

The command to run the script:
`source set script.sh`

Start redis server
`redis-server`

Then in the same shell that the script was ran in run the following command to start the project:
`./mvnw sprint-boot:run`