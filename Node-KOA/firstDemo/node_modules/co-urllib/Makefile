TESTS = test/*.test.js
COV_TESTS = test/index.test.js
REPORTER = spec
TIMEOUT = 20000
MOCHA_OPTS =
BIN = node_modules/.bin/
SRC = $(wildcard lib/*.js)
BUILD = $(subst lib/,build/,$(SRC))

install:
	@npm install --registry=http://registry.npm.taobao.org

build:
	@mkdir -p build
	@$(MAKE) $(BUILD)

build/%.js: lib/%.js
	@$(BIN)regenerator --include-runtime $< > $@

jshint: install
	@$(BIN)jshint lib

test: install
	@NODE_ENV=test $(BIN)mocha \
		--harmony \
		--require co-mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov cov:
	@NODE_ENV=test node --harmony \
		$(BIN)istanbul cover $(BIN)_mocha \
		-- -u exports \
		--require co-mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(COV_TESTS)
	@$(BIN)cov coverage

test-all: install jshint test

autod: install
	@$(BIN)autod -w -e example.js,callback_example.js --prefix "~"
	@$(MAKE) install

contributors: install
	@$(BIN)contributors -f plain -o AUTHORS

clean:
	@rm -rf build

.PHONY: test clean
