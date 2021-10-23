FILES=node_modules/curvature/base/Bindable.js\
	node_modules/curvature/base/Mixin.js\
	node_modules/curvature/mixin/EventTargetMixin.js\
	source/Matrix.js

.PHONY: all package npm dist dist-min prod clean

all: npm

npm:
	NODE_ENV=prod npx babel source/Matrix.js --no-comments --out-file Matrix.js

# dist:
# 	NODE_ENV=prod npx babel --no-comments --out-file dist/matrix-api.js source/Matrix.js
# 	NODE_ENV=prod npx babel --no-comments --out-file dist/matrix-api.standalone.js ${FILES}

# dist-min:
# 	NODE_ENV=prod-min npx babel --no-comments --out-file dist/matrix-api.min.js source/Matrix.js

dependencies:
	npm install

clean:
	rm -f Matrix.js dist/matrix-api.js dist/matrix-api.standalone.js
