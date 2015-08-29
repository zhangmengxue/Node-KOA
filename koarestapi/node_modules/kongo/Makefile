MOCHA_PATH = ./node_modules/mocha/bin/mocha

test:
	NODE_ENV=test $(MOCHA_PATH) --reporter=spec -w

test-once:
	NODE_ENV=test $(MOCHA_PATH) --reporter=spec

test-debug:
	NODE_ENV=test $(MOCHA_PATH) --reporter=spec debug

test-coverage:
	NODE_ENV=test KONGO_COVERAGE=1 $(MOCHA_PATH) --require blanket --reporter html-cov > coverage.html

test-coveralls:
	NODE_ENV=test KONGO_COVERAGE=1 $(MOCHA_PATH) --require blanket --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

.PHONY: test test-once test-debug test-coverage test-coveralls
