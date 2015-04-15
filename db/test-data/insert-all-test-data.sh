#!/bin/bash
# --execute=/bin/bash--

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
connectToTest="-h /run/postgresql/ -d weather_accuracy_test"


cat \
"${DIR}/weather_data_type.sql" \
"${DIR}/weather_source.sql" \
"${DIR}/weather_date.sql" \
"${DIR}/weather_location.sql" \
"${DIR}/weather_data_point_unit.sql" \
"${DIR}/weather_data_point_name.sql" \
"${DIR}/weather_data.sql" \
"${DIR}/weather_data_point.sql" \
| psql -1 ${connectToTest} -f -
