npm-install-%: ## install specified % npm package on the cookie-cutter container
	npm install $* --save-dev
	git add package.json

validate-no-uncommitted-package-lock-changes:
	git diff --exit-code package-lock.json

test:
	npm test

snapshot:
	npm run snapshot

lint:
	bash -c 'npm run lint && npm run stylelint'
