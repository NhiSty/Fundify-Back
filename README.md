<h1 align="center">Welcome to Fundify-Back 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D12.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/yarn-%3E%3D3.5.1-blue.svg" />
  <a href="https://choosealicense.com/licenses/gpl-3.0/" target="_blank">
    <img alt="License: GNU General Public License v3.0" src="https://img.shields.io/badge/License-GNU General Public License v3.0-yellow.svg" />
  </a>
</p>

> Backend for the Fundify app

### 🏠 [Homepage](https://github.com/NhiSty/Fundify-Back#readme)

### ✨ [Demo](https://test.com)

## Prerequisites

- Docker
- docker-compose

## Install

First, copy the .env.example file and rename it .env and fill it with your own values.
Then you need to start your environment with docker-compose

```sh
# Start the environment
docker-compose up --build

# sync the database with the models
docker compose exec node node migrate.js
```

The container will automatically install the dependencies and start the server on the port you specified in the .env file.

## Usage

You can access the API at http://localhost:[port]/api

You can also access the front at http://localhost:[port]

## Run tests

```sh
yarn test
```

## Author

👤 **Nhisty**

* Website: https://github.com/NhiSty

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/NhiSty/Fundify-Back/issues). You can also take a look at the [contributing guide](git@github.com:NhiSty/Fundify-Back/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
