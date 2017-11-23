all: jobson-ui-builder package image

clean: clean-artifact node_modules clean-image

jobson-ui-builder:
	docker images | grep jobson-ui-builder 2>&1 > /dev/null || docker build -t jobson-ui-builder -f container/Dockerfile-builder .

package:
	docker run -tv $(shell pwd)/container/tmp/artifact:/app/artifact -v $(shell pwd)/container/tmp/node_modules:/app/node_modules jobson-ui-builder /bin/sh -c 'cp /app/public/* /app/artifact/'

image:
	docker build -t jobson-ui -f container/Dockerfile .

clean-artifact:
	rm -rf container/tmp/artifact

clean-node_modules:
	rm -rf container/tmp/node_modules

clean-image:
	docker rmi jobson-ui-builder

run:
	docker run -tip 8000:80 jobson-ui