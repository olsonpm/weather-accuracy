#!/bin/bash
# --execute=/bin/bash--

connections=$(psql -t -c "select count(*) from pg_stat_activity where datname='weather_accuracy_test'")

if [ ${connections} != "0" ]; then
	printf "Cannot run while there are current connections to the database\n"
	exit 1
fi

ms1=$(date '+%s%2N')

psqlConnect="-h /run/postgresql/ -d weather_accuracy"
connectToDb="-h /run/postgresql/ -d weather_accuracy_test"
psql ${psqlConnect} -c "drop database weather_accuracy_test"
psql ${psqlConnect} -c "create database weather_accuracy_test"
						

./generate-db-schema.sh

psql ${connectToDb} -f -c "drop role weather_accuracy_test"
psql ${connectToDb} -1 -c "create role weather_accuracy_test"
psql ${connectToDb} -1 -f ./db-schema.out
psql ${connectToDb} -1 -c "\
	grant select, insert, update, delete on all tables in schema public to weather_accuracy_test; \
	grant select, update on all sequences in schema public to weather_accuracy_test; \
	revoke all on all tables in schema public from weather_accuracy; \
	revoke all on all sequences in schema public from weather_accuracy; \
	alter default privileges in schema public grant select, insert, update, delete on tables to weather_accuracy_test; \
	alter default privileges in schema public grant select, update on sequences to weather_accuracy_test; \
	alter default privileges in schema public revoke select, insert, update, delete on tables from weather_accuracy; \
	alter default privileges in schema public revoke select, update on sequences from weather_accuracy; \
"

# Insert test data
if [ -f ./test-data/insert-all-test-data.sh ]; then
	printf "inserting all test data\n"
	./test-data/insert-all-test-data.sh 'weather_accuracy_test'
fi

ms2=$(date '+%s%2N')
msDiff=$((${ms2}-${ms1}))
ms=$((msDiff-100))
s=$((msDiff/100))

printf "finished rebuilding weather_accuracy_test in ${s}.%02d seconds\n" ${ms}
