FILES=source/Matrix.js\
	node_modules/curvature/base/Bindable.js\
	node_modules/curvature/base/Mixin.js\
	 node_modules/curvature/mixin/EventTargetMixin.js

.PHONY: all package min dist prod clean

all: dist min

dist:
	NODE_ENV=prod npx babel ${FILES} --no-comments --out-file Matrix.js

min:
	NODE_ENV=prod-min npx babel ${FILES} --no-comments --out-file Matrix.min.js

dependencies:
	npm install

clean:
	rm -f Matrix.js Matrix.min.js
