.PHONY: all package min dist prod clean

all: dist min

dist:
	NODE_ENV=prod npx babel source/Matrix.js --no-comments --out-file Matrix.js

min:
	NODE_ENV=prod-min npx babel source/ --no-comments --out-file Matrix.min.js

dependencies:
	npm install

clean:
	rm -f Matrix.js Matrix.min.js
