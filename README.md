<p align="center">
<a href="#start"><img height="30rem" src="https://raw.githubusercontent.com/arcana-network/branding/main/an_logo_light_temp.png"/></a>
<h2 align="center"> <a href="https://arcana.network/">Sample Demo App: Arcana Drive </a></h2>
</p>
<br/>
<p id="banner" align="center">
<br/>
<a title="MIT License" href="https://github.com/arcana-network/license/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
<a title="Beta release" href="https://github.com/arcana-network/demo-app/releases"><img src="https://img.shields.io/github/v/release/arcana-network/demo-app?style=flat-square&color=28A745"/></a>
<a title="Twitter" href="https://twitter.com/ArcanaNetwork"><img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FArcanaNetwork"/></a>
</p><p id="start" align="center">
<a href="https://docs.beta.arcana.network/"><img src="https://raw.githubusercontent.com/arcana-network/branding/main/demo_app_banner.png" alt="Arcana Network Drive"/></a>
</p>

# Sample Demo App

Sample Demo App demonstrates how a dApp can utilize Arcana Auth and Storage SDK for quickly onboarding dApp users and enable user data privacy.

You can access the [public deployment](https://demo-app.beta.arcana.network) or clone our GitHub repository to build, setup a local deployment and test drive this sample application.

# 💪 Key Features

* <p>⚙️ &nbsp; Integrates with Arcana Network SDKs
  <p><ul>
  <li>Auth SDK</li>
  <li>Storage SDK</li>
  </ul></p>

* <p>🗝️ &nbsp; Uses social authentication feature of Auth SDK to enable user onboarding via Google OAuth.</p>

* <p>👛 &nbsp;Assigns Arcana wallet address for each authenticated user.</p>

* <p>🗄️ &nbsp; Allows dApp users to upload their data in Arcana Store for access control and privacy.</p>

* <p>📂 &nbsp; Enables dApp users full ownership and control of their data residing in Arcana Store. Only data owners can download, share, revoke access, delete or transfer data ownership to another user.</p>

## Public Deployment

You can try out Arcana Network Drive here: [https://demo.beta.arcana.network](https://demo.beta.arcana.network)

## Local Development

**Prerequisites:** You'll need an up to date **`node.js`** and **`npm`** installed in your system for this demo to work. Use LTS v16 or higher.

### Clone the repository

```bash
git clone <repo-url>
```

### Installation

- Install package dependencies

```bash
npm install
```

### Setup Environment Variables

- Create `.env` file in root and copy the content of `.env.example`.

```bash
cp .env.example .env
```

**Replace all variable values with actual environment variables**

- To run the project in development environment

```bash
npm run dev
```

### Build and Run

- To build the project for production (to generate static files for hosting)

```bash
npm run build
```
## Docker: Local Development

**Prerequisites:**

- [Docker](https://docs.docker.com/engine/install/)

### Clone the repository

```
git clone git@github.com:arcana-network/demo-app.git
```

### Setup Container Environment

```
cp .env.example .env
```

### Build and Run

Run local environment with demo-app

```
make run-local
```
# 📚 Documentation

Check out [Arcana Network documentation](https://docs.beta.arcana.network/) [Sample Apps section](https://docs.beta.arcana.network/docs/overview_cs) for details.

# 💡 Support

For any support or integration related queries, contact [Arcana support team](mailto:support@arcana.network).

# 🤝 Contributing

We welcome all contributions to the Arcana Network Drive sample dApp from the community. Read our [contributing guide](https://github.com/arcana-network/license/blob/main/CONTRIBUTING.md) to learn about the our development process, how to propose bug fixes and improvements, and the code of conduct that we expect the participants to adhere to.

Refer to the build and test section of this readme for details on how to test and validate your changes to the sample demo app, before submitting your contributions.

# ℹ️ License

Arcana Network Drive is distributed under the [MIT License](https://fossa.com/blog/open-source-licenses-101-mit-license/).

For details see [Arcana License](https://github.com/arcana-network/license/blob/main/LICENSE.md).
