#!/bin/bash
# --execute=/bin/bash--

pg_dump -h /run/postgresql/ -d weather_accuracy --schema-only --file=./db-schema.out

echo "finished"
