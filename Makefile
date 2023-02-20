#!/usr/bin/env make

SHELL=bash -euxo pipefail

.PHONY: all package dependencies clean dist/matrix-api.js dist/matrix-api.standalone.js

all: dependencies dist/matrix-api.js dist/matrix-api.standalone.js package
	mv node_modules mode_nodules

package:
	NODE_ENV=prod npx babel source/Matrix.js --no-comments --out-file Matrix.js;

dist/matrix-api.js: source/Matrix.js
	brunch b -p;

dist/matrix-api.standalone.js: source/ dist/matrix-api.js
	cat dist/matrix-api.js >> dist/vendor.js
	mv dist/vendor.js dist/matrix-api.standalone.js

dependencies:
	mv mode_nodules node_modules || true

clean:
	rm -f Matrix.js dist/matrix-api.js dist/matrix-api.standalone.js dist/vendor.js
