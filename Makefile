.PHONY: all package dist dependencies clean

all: npm dist

package:
	NODE_ENV=prod npx babel source/Matrix.js --no-comments --out-file Matrix.js

dist:
	brunch b -p

dependencies:
	npm install

clean:
	rm -f Matrix.js dist/matrix-api.js dist/matrix-api.standalone.js
