TRANSPILE = node_modules/.bin/tsc
COMPILE = node_modules/.bin/compile

all: haunted-router.js web.js
.PHONY: all

lib/*.js: src/*.ts
	$(TRANSPILE)
	# Add ".js" extension to module imports
	sed -i -E "/(import|from) '.\/.*\.js'/! s/(import|from) '.\/(.*?)'/\1 '.\/\2.js'/" lib/*.js

haunted-router.js: lib/*.js
	$(COMPILE) -f es -o $@ -e haunted lib/haunted-router.js
	sed -i.bu 's/haunted/https:\/\/unpkg\.com\/haunted@beta\/core\.js/' $@
	rm -f $@.bu

web.js: haunted-router.js
	sed 's/https:\/\/unpkg\.com\/haunted@beta\/core\.js/\.\.\/haunted\/core\.js/' $^ > $@

clean:
	@rm -rf lib haunted-router.js web.js
.PHONY: clean
