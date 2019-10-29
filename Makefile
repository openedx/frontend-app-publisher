shell: ## run a shell on the cookie-cutter container
	docker exec -it edx.pubfe /bin/bash

build:
	docker-compose build

up: ## bring up cookie-cutter container
	docker-compose up -d

up-attached: ## bring up cookie-cutter container in attached mode
	docker-compose up

logs: ## show logs for cookie-cutter container
	docker-compose logs -f

down: ## stop and remove cookie-cutter container
	docker-compose down

npm-install-%: ## install specified % npm package on the cookie-cutter container
	docker exec npm install $* --save-dev
	git add package.json

restart:
	docker-compose restart

restart-attached: down up-attached

validate-no-uncommitted-package-lock-changes:
	git diff --exit-code package-lock.json

test: up
	docker exec -it edx.pubfe npm test

snapshot:
	docker exec -it edx.pubfe npm run snapshot

lint:
	docker exec -it edx.pubfe bash -c 'npm run lint && npm run stylelint'
