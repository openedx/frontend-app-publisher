# The assumption behind running any of these make commands is that the user is
# already shelled into the container using the `make frontend-app-publisher-shell`
# command in devstack

intl_imports = ./node_modules/.bin/intl-imports.js
transifex_utils = ./node_modules/.bin/transifex-utils.js
i18n = ./src/i18n
transifex_input = $(i18n)/transifex_input.json

# This directory must match .babelrc .
transifex_temp = ./temp/babel-plugin-formatjs


requirements:
	npm ci

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


i18n.extract:
	# Pulling display strings from .jsx files into .json files...
	rm -rf $(transifex_temp)
	npm run-script i18n_extract

i18n.concat:
	# Gathering JSON messages into one file...
	$(transifex_utils) $(transifex_temp) $(transifex_input)

extract_translations: | requirements i18n.extract i18n.concat

pull_translations:  ## Pull translations using atlas
	rm -rf src/i18n/messages
	mkdir src/i18n/messages
	cd src/i18n/messages \
	   && atlas pull --filter=$(transifex_langs) \
	            translations/frontend-component-footer/src/i18n/messages:frontend-component-footer \
	            translations/paragon/src/i18n/messages:paragon \
	            translations/frontend-app-publisher/src/i18n/messages:frontend-app-publisher

	$(intl_imports) frontend-component-footer paragon frontend-app-publisher
