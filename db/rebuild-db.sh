#!/usr/bin/env sh

connections="$(psql -t -c "select count(*) from pg_stat_activity where datname='weather_accuracy'" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

if [ "${connections}" != "0" ]; then
	printf "Cannot run while there are current connections to the database\n"
	exit 1
fi

ms1=$(date '+%s%2N')

connectToDefault() { psql -h /run/postgresql/ "$@"; }
connectToDb() { psql -h /run/postgresql/ -d weather_accuracy "$@"; }
connectToDefault -c "drop database weather_accuracy"
connectToDefault -c "create database weather_accuracy"

connectToDb -1 -f ./db-schema.out
connectToDb -1 -c "\
	grant select, insert, update, delete on all tables in schema public to weather_accuracy; \
	grant select, update on all sequences in schema public to weather_accuracy; \
	alter default privileges in schema public grant select, insert, update, delete on tables to weather_accuracy; \
	alter default privileges in schema public grant select, update on sequences to weather_accuracy; \
	alter default privileges in schema public revoke select, insert, update, delete on tables from weather_accuracy; \
	alter default privileges in schema public revoke select, update on sequences from weather_accuracy; \
"

# Insert test data
if [ -f ./test-data/insert-all-test-data.sh ]; then
	printf "inserting all test data\n"
	./test-data/insert-all-test-data.sh 'weather_accuracy'
fi

ms2=$(date '+%s%2N')
msDiff=$((ms2-ms1))
ms=$((msDiff-100))
s=$((msDiff/100))

printf "finished rebuilding weather_accuracy in ${s}.%02d seconds\n" ${ms}
