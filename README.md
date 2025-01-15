# Tagtron

Tagtron is a tool for gathering and labeling images.

##
In orderr to run the app using docker compose you need to specify enviropnment variables:

```bash
$PG_USERNAME
$PG_PASSWORD
$PG_DATABASE
```

or yuou can use the env file with command, example:

``` bash
docker compose --env-file ./config/.env.dev up
```