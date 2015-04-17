#!/bin/bash
# --execute=/bin/bash--

if [ -z ${1+x} ]; then
	echo "insert-all-test-data requires a database name"
fi

dbName="${1}"

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
connectToDb="-h /run/postgresql/ -d ${dbName}"


cat \
"${DIR}/weather_data_type.sql" \
"${DIR}/weather_source.sql" \
"${DIR}/weather_date.sql" \
"${DIR}/weather_location.sql" \
"${DIR}/weather_data_point_unit.sql" \
"${DIR}/weather_data_point_name.sql" \
"${DIR}/weather_data.sql" \
"${DIR}/weather_data_point.sql" \
| psql -1 ${connectToDb} -f -
