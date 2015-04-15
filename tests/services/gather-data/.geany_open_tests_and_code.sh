DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
geanyy "\
	${DIR}/../../../services/gather-data/forecast-io.js \
	${DIR}/forecast-io.js \
	${DIR}/../../../services/gather-data/ham-weather.js \
	${DIR}/ham-weather.js \
	${DIR}/../../../services/gather-data/weather-underground.js \
	${DIR}/weather-underground.js \
"
