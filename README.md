# Electron App Scripts

![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/SadraSamadi/electron-app-scripts)
![npm](https://img.shields.io/npm/dw/electron-app-scripts)
![npm](https://img.shields.io/npm/v/electron-app-scripts)
![npm (tag)](https://img.shields.io/npm/v/electron-app-scripts/beta)
![GitHub last commit](https://img.shields.io/github/last-commit/SadraSamadi/electron-app-scripts)
![GitHub](https://img.shields.io/github/license/SadraSamadi/electron-app-scripts)

Configuration and scripts for Electron App.

## Install

* **NPM** `npm i -D electron-app-scripts` and `npm i electron-app-runtime`
* **Yarn** `yarn add -D electron-app-scripts` and `yarn add electron-app-runtime`

## Usage

`package.json`
```json5
{
  // ...
  "scripts": {
    // ...
    "dev": "electron-app-scripts dev",
    "prod": "electron-app-scripts prod"
    // ...
  },
  // ...
}
```

## Options

```text
Usage: electron-app-scripts command [options]

Commands:
  electron-app-scripts dev    Start application for development
  electron-app-scripts prod   Build application for production
  electron-app-scripts clean  Clean up distributable files

Options:
  --env            Scripts environment mode    [string] [choices: "dev", "prod"]
  --externals      Path to webpack external modules file
                                                [string] [default: ".externals"]
  --src.main       Main source folder             [string] [default: "src/main"]
  --src.renderer   Renderer source folder     [string] [default: "src/renderer"]
  --dist.main      Main distributable folder     [string] [default: "dist/main"]
  --dist.renderer  Renderer distributable folder
                                             [string] [default: "dist/renderer"]
  --dist.out       Outputs folder                 [string] [default: "dist/out"]
  --babel          Babel config file          [string] [default: "babel.eas.js"]
  --typescript     Typescript config file    [string] [default: "tsconfig.json"]
  --tailwind       Tailwind config file    [string] [default: "tailwind.eas.js"]
  --postcss        Postcss config file      [string] [default: "postcss.eas.js"]
  --webpack        Webpack config file      [string] [default: "webpack.eas.js"]
  --verbose        Enable/Disable logs                [boolean] [default: false]
  -c, --config     Path to JSON config file
  -v, --version    Show version number                                 [boolean]
  -h, --help       Show help                                           [boolean]
```

## Related

[electron-app-runtime](https://github.com/SadraSamadi/electron-app-runtime)
