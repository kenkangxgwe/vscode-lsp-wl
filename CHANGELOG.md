# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.10] - 2021-03-07

## Changed

- Upgrade vscode-languageclient to 7.0.0 (protocol 3.16).

## [0.1.9] - 2021-01-29 🧨🐂

### Changed

- Update the dependencies in README.

### Fixed

- Unrecognizable `dap-wl` in `launch.json` configuration.

## [0.1.8] - 2021-01-24

### Added

- Debug adapter support.

## [0.1.7] - 2020-02-01

### Added

- Automatic port detection if preferred one is in use.

## [0.1.6] - 2020-02-01 🏮🐀

### Changed

- Update the documentations for server version 0.2.1.
- Update the installation instructions.

### Remove

- `createFileSystemWatcher` to suppress the LSP error

## [0.1.5] - 2019-07-23 🏖️

### Changed

- Update the documentations for server version 0.2.0.

## [0.1.4] - 2019-05-16

### Remove

- Automatic port detection that causes extension broken.


## [0.1.3] - 2019-05-15 ❌

### Added

- Automatic port detection if preferred one is in use.

### Fixed

- Remove `npm` dependency to avoid security issue.

## [0.1.2] - 2019-02-05 🧧🐖

### Added

- Markdown text-based document information

### Fixed

- Security issues due to event-stream

### Removed

- SVG image for document information

### Known issues

- Incompatible with latest Vim emulation extension `1.0.7`, please use version no later than `1.0.4`.

## [0.1.0] - 2019-01-12

### Added

- Add support to wolfram language format

- Lauch server via node module in `serverOption`.

- Passing `theme` via `intializationOptions`.
