#!/bin/bash
# --execute=/bin/bash--

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
connectToDb="-h /run/postgresql/ -d weather_accuracy"

cat \
"${DIR}/weather_data_point_unit.sql" \
"${DIR}/weather_data_point_name.sql" \
"${DIR}/weather_data_type.sql" \
"${DIR}/weather_location.sql" \
"${DIR}/weather_source.sql" \
| psql -1 ${connectToDb} -f -
