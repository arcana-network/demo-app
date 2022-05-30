# Arcana Demo App

A demo app for validating the working of Arcana Login and Storage SDK. An updated login and storage SDK is always present in this repo and you will just need to add your environment variables to get started.

This app helps you test login functionality (sso login and distributed key generation and management), uploading files, downloading files and sharing it with others

## Quick Start

- Prerequisites: You'll need an up to date **`node.js`** and **`npm`** installed in your system for this demo to work

- Clone this repo

```bash
git clone <repo-url>
```

- Install dependencies

```bash
npm install
```

- Create `.env` file in root and copy the content of `.env.example`.

```bash
cp .env.example .env
```

**Replace all variable values with actual environment variables**

- To run the project in development environment

```bash
npm run dev
```

- To build the project for production (to generate static files for hosting)

```bash
npm run build
```
## Local environment setup

#### Prerequisits

- [Docker](https://docs.docker.com/engine/install/)

1. Clone the repository

```
git clone git@github.com:arcana-network/demo-app.git
```

2. Create environment file

```
cp .env.example .env
```

3. Run local environment with demo-app

```
make run-local
```
