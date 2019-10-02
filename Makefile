TRANSPILE = node_modules/.bin/tsc

all: lib/*.js
.PHONY: all

lib/*.js: src/*.ts
	$(TRANSPILE)
	# Add ".js" extension to module imports
	sed -i -E "/(import|from) '.\/.*\.js'/! s/(import|from) '.\/(.*?)'/\1 '.\/\2.js'/" lib/*.js

clean:
	@rm -rf lib
.PHONY: clean
