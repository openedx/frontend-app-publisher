# The assumption behind running any of these make commands is that the user is
# already shelled into the container using the `make frontend-app-publisher-shell`
# command in devstack

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

eslint-fix:
	bash -c 'npm run lint-fix'
