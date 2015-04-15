#!/usr/bin/env bash
# --execute=/bin/bash--
pushd "../../../../"
	
	ptr run-task insertCurrentDates "env=dev"

popd

# weather underground
curl "http://api.wunderground.com/api/${WEATHER_UNDERGROUND_API_KEY}/forecast10day/q/37.935758,-122.347749.json" | python3 -m json.tool > wunderground-forecast.json
curl "http://api.wunderground.com/api/${WEATHER_UNDERGROUND_API_KEY}/history_"$(date "--date=${dataset_date} -${date_diff} 1 day" +"%Y%m%d")"/q/37.935758,-122.347749.json" | python3 -m json.tool > wunderground-actual.json

#forecast.io
curl "https://api.forecast.io/forecast/${FORECAST_IO_API_KEY}/37.935758,-122.347749?units=ca" | python3 -m json.tool > fio-forecast.json
curl "https://api.forecast.io/forecast/${FORECAST_IO_API_KEY}/37.935758,-122.347749,"$(($(date +%s) + ($(date -d "$(date +00:00-07:00)" +%s)-$(date +%s)-(24*60*60))))'?units=ca' | python3 -m json.tool > fio-actual.json

#ham weather
curl "https://api.aerisapi.com/forecasts?p=37.935758,-122.347749&client_id=${HAM_WEATHER_CONSUMER_ID}&client_secret=${HAM_WEATHER_CONSUMER_SECRET}" | python3 -m json.tool > ham-forecast.json
curl "https://api.aerisapi.com/observations/summary/37.935758,-122.347749?from=yesterday&client_id=${HAM_WEATHER_CONSUMER_ID}&client_secret=${HAM_WEATHER_CONSUMER_SECRET}" | python3 -m json.tool > ham-actual.json
