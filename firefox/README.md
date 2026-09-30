# KZT to RUB Converter — Source Code

## Overview

This archive contains the complete source code and build configuration for the **KZT to RUB Converter** Firefox extension.

The extension detects prices displayed in Kazakhstani tenge (KZT) on web pages and displays their approximate value in Russian rubles (RUB).

The source code in this archive is the original human-written source code. The final extension files are generated during the build process using the tools and dependencies specified below.

## Build Environment

The submitted version was built on the following environment:

* **Operating system:** Windows 11 Pro
* **OS build:** 26200.9168
* **Node.js:** v24.21.0
* **npm:** 11.19.0

Please use the specified Node.js and npm versions to reproduce the build environment as closely as possible.

## Build Tools

The project uses the following open-source build tools:

* **Vite:** 5.4.21
* **Rollup:** 4.60.0
* **esbuild:** 0.21.5
* **vite-plugin-static-copy:** 3.4.0

The exact dependency versions are recorded in `package-lock.json`.

Vite uses Rollup and esbuild as part of the build process.

`vite-plugin-static-copy` is used to copy `manifest.json` into the final build directory.

## Installing the Required Environment

Install:

* Node.js v24.21.0
* npm 11.19.0

Verify the installed versions:

```text
node --version
npm --version
```

The expected output is:

```text
v24.21.0
11.19.0
```

## Installing Dependencies

Open a terminal in the root directory of this source archive and run:

```text
npm ci
```

`npm ci` installs the exact dependency versions specified in `package-lock.json`.

No manual installation of Vite, Rollup, esbuild, or other npm dependencies is required.

## Building the Extension

After installing the dependencies, run:

```text
npm run build
```

The build command executes:

```text
vite build
```

The generated extension files are placed into:

```text
dist/
```

The `dist` directory is the build output used to create the submitted Firefox extension package.

## Reproducing the Build

To reproduce the submitted extension from the provided source code:

1. Install Node.js v24.21.0.
2. Verify that npm 11.19.0 is installed.
3. Open a terminal in the project root.
4. Install the exact project dependencies:

```text
npm ci
```

5. Build the extension:

```text
npm run build
```

6. The resulting extension files will be available in:

```text
dist/
```

The resulting `dist` directory can then be packaged as a Firefox extension.

## Project Structure

The relevant source files are organized as follows:

```text
├── manifest.json
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── background/
    │   └── background.js
    ├── content/
    │   ├── content.js
    │   ├── converter.js
    │   ├── dom.js
    │   └── observer.js
    └── shared/
        └── constants.js
```

## Build Configuration

The build configuration is located in:

```text
vite.config.js
```

It defines the JavaScript entry points for the extension and the output directory.

The main source entry points are:

```text
src/content/content.js
src/background/background.js
```

The build process resolves the JavaScript module dependencies and generates the corresponding files in `dist/`.

## Third-Party Dependencies

The project uses open-source npm packages required for the build process.

The dependency declarations are stored in:

```text
package.json
```

The exact resolved dependency versions are stored in:

```text
package-lock.json
```

The source archive does not include copies of third-party npm libraries. They are installed automatically by:

```text
npm ci
```

## Runtime Network Request

During normal operation, the extension retrieves exchange-rate data from:

```text
https://www.cbr-xml-daily.ru/daily_json.js
```

The extension uses the KZT exchange-rate value returned by this service to convert prices from KZT to RUB.

The exchange rate is cached locally by the extension and periodically refreshed.

## Source Code and Build Output

The JavaScript files under `src/` are the original source files.

The files in `dist/` are generated build output and are not the original source files.

The build process is fully described by:

```text
package.json
package-lock.json
vite.config.js
```

Running:

```text
npm ci
npm run build
```

recreates the generated extension files from the provided source code.

## Reproducibility

The project uses `package-lock.json` to lock the dependency tree.

The intended build environment for the submitted version is:

```text
Windows 11 Pro
OS build 26200.9168
Node.js v24.21.0
npm 11.19.0
```

Using these versions together with:

```text
npm ci
npm run build
```

provides the procedure required to reproduce the extension build from the supplied source code.
