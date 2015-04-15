#!/usr/bin/env bash
# --execute=/bin/bash--

mocha -u tdd --no-colors --reporter spec --require mocha-clean "*.js"
