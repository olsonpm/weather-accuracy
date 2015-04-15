DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
geanyy "\
	${DIR}/data.js \
	${DIR}/data-point.js \
	${DIR}/measurement-name.js \
	${DIR}/source.js \
	${DIR}/type.js \
	${DIR}/location.js \
	${DIR}/unit.js \
	${DIR}/ymd.js \
"
c_geany_open "${DIR}/dal"
c_geany_open "${DIR}/extensions"
