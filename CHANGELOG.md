# [1.1.0](https://github.com/jobiewong/loremonger/compare/v1.0.2...v1.1.0) (2025-11-25)


### Features

* enhance audio transcription and add party member creation dialog ([de2fc1c](https://github.com/jobiewong/loremonger/commit/de2fc1cc429e07a61ecaf6ed008fe42336ac79b7))

## [1.0.2](https://github.com/jobiewong/loremonger/compare/v1.0.1...v1.0.2) (2025-11-25)


### Bug Fixes

* handle windows file paths and allow writing anywhere ([6779ab3](https://github.com/jobiewong/loremonger/commit/6779ab3c1fae156c1e8dff35ec86a0c79e5b179b))
* update debug flag in audio upload component ([2dc24a2](https://github.com/jobiewong/loremonger/commit/2dc24a2fef35ab7e0d5056bc2d97abba11ef6327))

## [1.0.1](https://github.com/jobiewong/loremonger/compare/v1.0.0...v1.0.1) (2025-11-25)


### Bug Fixes

* add exception catch to workflow ([c439515](https://github.com/jobiewong/loremonger/commit/c439515af8b19b4f08acf7fab606fe1adaeb70c8))

# 1.0.0 (2025-11-24)


### Bug Fixes

* add central icons licence key to semantic_release step in workflow ([0429fef](https://github.com/jobiewong/loremonger/commit/0429fef552d07f4f1b66c772bf964cc8888be0c6))
* add central license key to global workflow env ([4d325a1](https://github.com/jobiewong/loremonger/commit/4d325a16fe8c2c554265e31006573e4d3f9b14ad))
* add CENTRAL_LICENSE_KEY to workflow and remove deprecated ffmpeg package ([9e2e0aa](https://github.com/jobiewong/loremonger/commit/9e2e0aafda7fe939cf044292fa5e1d67f54c41f0))
* add semantic-release dependencies ([40f2072](https://github.com/jobiewong/loremonger/commit/40f2072a9f60e90e08da23b50b0e6bd03acf5cd2))
* add semantic-release/exec dependency ([2a9b046](https://github.com/jobiewong/loremonger/commit/2a9b04659c93e5e174c343c9241f9c5a1c5283e2))
* update app icon and name ([38436f4](https://github.com/jobiewong/loremonger/commit/38436f424b82b81abfff35ca1c9f1bcfaf8e8a7f))
* update husky commit-msg config for linting ([0313478](https://github.com/jobiewong/loremonger/commit/0313478bf2bace51f8181b8b9c68ad7f74d250f1))


### Features

* add alert dialog component and campaign ID route ([2357a8e](https://github.com/jobiewong/loremonger/commit/2357a8e020d174b35551f9437a1b2838fbef8146))
* add audio processing functions in rust + ui changes ([e56554f](https://github.com/jobiewong/loremonger/commit/e56554fea9f045972e8fc1cd5571b1c08e22ef99))
* add audio upload component and enhance UI ([0b13a45](https://github.com/jobiewong/loremonger/commit/0b13a45eaba5c3b41212cb4f3767666cf886e89b))
* add basic UI components and styling ([9eda39d](https://github.com/jobiewong/loremonger/commit/9eda39d5d26f98bad4e2fc515722a901d5b293e6))
* add campaign creation route ([a0a60bd](https://github.com/jobiewong/loremonger/commit/a0a60bd9d3a8e656a31721ee4a4cbcb1ed2a3ff4))
* add delete campaign in header and fix duration type in database ([35dd9da](https://github.com/jobiewong/loremonger/commit/35dd9da39fc68979b46fa1e46806c644d4495e37))
* add index.html entrypoint and configure tauri updater ([37f230e](https://github.com/jobiewong/loremonger/commit/37f230ecb1bec75541f5975a07bc2052ba96a56a))
* add mention component and enhance file naming convention ([96fba1d](https://github.com/jobiewong/loremonger/commit/96fba1dff497a499698ca91a07d86c807081a772))
* add session edit and delete options and integrate date picker ([a46f7a1](https://github.com/jobiewong/loremonger/commit/a46f7a129215ca3a72f0ff763bcb2b994d3d95ca))
* add settings route and integrate stronghold plugin ([4d51dc1](https://github.com/jobiewong/loremonger/commit/4d51dc14f783198c783e5ffa91afad228fffa45d))
* basic file reading and transcript generation ([19f4ccb](https://github.com/jobiewong/loremonger/commit/19f4ccb71740cb342b54c1d5c262e052a9e4fed4))
* enhance audio upload process with progress logging and UI improvements ([798ad9a](https://github.com/jobiewong/loremonger/commit/798ad9a85790aaeeb1a887e2435bfee40dda72af))
* enhance transcription and note generation capabilities ([fa3d6ab](https://github.com/jobiewong/loremonger/commit/fa3d6ab9910f0355bd3a7995c3178cd11da6c7c5))
* enhance workbench functionality and integrate audio transcription ([396ca11](https://github.com/jobiewong/loremonger/commit/396ca11da4d63350304fba8a389f7ce808391496))
* form validation on campaign creation ([b06cbe7](https://github.com/jobiewong/loremonger/commit/b06cbe758b80082222cdf2d02fe04da9252510a4))
* home page with ascii art and campaign table ([56f7c18](https://github.com/jobiewong/loremonger/commit/56f7c18b656d4f1d6d31c09cc74a5a8f301cf3fe))
* implement custom output directory and file saves ([63902d7](https://github.com/jobiewong/loremonger/commit/63902d752fa3b44acda9a6ee332df06a850e066d))
* implement edit campaign dialog and UI enhancements ([c3de1e6](https://github.com/jobiewong/loremonger/commit/c3de1e6efb93b610be50fbd87c2d33f256ba204b))
* implement sqlite database with drizzle and tanstack db ([18c7aab](https://github.com/jobiewong/loremonger/commit/18c7aab38c120b74fc09865c3bb4e887a80eb3b3))
* implement tabs for campaign creation + party member form ([9315107](https://github.com/jobiewong/loremonger/commit/93151077280de78b9d04698ce0884446608975c5))
* integrate note creation and progress tracker ([6854d20](https://github.com/jobiewong/loremonger/commit/6854d208f58124e18cb76ef36c4ead2f8d371f5f))
* integrate stopwatch and time-ago components, enhance audio upload functionality ([085e1de](https://github.com/jobiewong/loremonger/commit/085e1de6d6239f1188bbe720df60ea44f0519989))
* new table component on party members form + database updates ([9df090c](https://github.com/jobiewong/loremonger/commit/9df090c542bb90a9aa4266ae25b55ceb4e1c7a79))
* refactor campaign routing and session page ([09c8509](https://github.com/jobiewong/loremonger/commit/09c85098d3f8d50ab121912326472d5078ed09dd))
* stronghold api key store + dropdown header menus ([0ecca1e](https://github.com/jobiewong/loremonger/commit/0ecca1ec34bd16899ead1ad400b3a6aedea58652))
