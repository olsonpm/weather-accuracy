#!/bin/bash
# --execute=/bin/bash--

connections=$(psql -t -c "select count(*) from pg_stat_activity where datname='weather_accuracy_temp'")

if [ ${connections} != "0" ]; then
	printf "Cannot run while there are current connections to the database\n"
	exit 1
fi

ms1=$(date '+%s%2N')

./generate-db-schema.sh
./generate-table-schemas.sh

psqlConnect="-h /run/postgresql/"
connectToDb="-h /run/postgresql/ -d weather_accuracy_temp"
psql ${psqlConnect} -c "drop database weather_accuracy_temp"
psql ${psqlConnect} -c "create database weather_accuracy_temp"

psql ${connectToDb} -1 -f ./db-schema.out
psql ${connectToDb} -1 -c "\
	grant select, insert, update, delete on all tables in schema public to heroku; \
	grant select, update on all sequences in schema public to heroku; \
	alter default privileges in schema public grant select, insert, update, delete on tables to heroku; \
	alter default privileges in schema public grant select, update on sequences to heroku; \
"

# Insert initial data
if [ -f ./initial-data/insert-all-initial-data.sh ]; then
	printf "inserting all initial data\n"
	./initial-data/insert-all-initial-data.sh "weather_accuracy_temp"
fi

ms2=$(date '+%s%2N')
msDiff=$((${ms2}-${ms1}))
ms=$((msDiff-100))
s=$((msDiff/100))

printf "finished rebuilding weather_accuracy in ${s}.%02d seconds\n" ${ms}

exit 0
