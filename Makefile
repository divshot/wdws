build: client/*
	@browserify --standalone WDWSClient -o dist/wdws-client.js client/index.js