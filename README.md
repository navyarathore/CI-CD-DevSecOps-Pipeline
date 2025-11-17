# CI-CD DevSecOps Pipeline Demo

This repository contains a very simple Node.js application and a Jenkins pipeline (`Jenkinsfile`) to demonstrate a basic CI/CD setup.

## Node.js application

Files:

- `package.json` – Node.js project metadata and scripts
- `app.js` – Express HTTP server with a single `/` endpoint
- `test/app.test.js` – Minimal test script that starts the app and validates the response
- `Jenkinsfile` – Declarative Jenkins pipeline definition

### Run the app locally

Make sure you have Node.js (v18+ recommended) and npm installed.

```bash
cd "CI-CD DevSecOps Pipeline"
npm install
npm start
```

Then open http://localhost:3000 in your browser or run:

```bash
curl http://localhost:3000
```

You should see a JSON message: `{"message":"Hello from CI/CD DevSecOps demo app!"}`.

### Run tests locally

```bash
cd "CI-CD DevSecOps Pipeline"
npm install
npm test
```

If everything is working, you should see `All tests passed` in the output.

## Jenkins pipeline

The `Jenkinsfile` defines a simple declarative pipeline with these stages:

1. **Checkout** – checks out the source code from your SCM (e.g., GitHub).
2. **Install dependencies** – runs `npm install`.
3. **Run tests** – runs `npm test`.
4. **Build / Package** – placeholder; echoes that no build is needed.
5. **Run app (smoke test)** – starts the app and uses `curl` to verify it responds.

The pipeline expects Jenkins to have a Node.js tool named **`NodeJS`** configured (Manage Jenkins → Tools → NodeJS installations).

### Prerequisites in Jenkins

1. **Install NodeJS plugin (if not already installed)**
	- Go to **Manage Jenkins → Manage Plugins → Available**.
	- Search for **NodeJS** and install it (restart Jenkins if required).

2. **Configure NodeJS tool named `NodeJS`**
	- Go to **Manage Jenkins → Tools**.
	- Under **NodeJS installations**, click **Add NodeJS**.
	- Name: `NodeJS` (must match the name used in the `Jenkinsfile`).
	- Select an installation method (e.g., install automatically with a chosen version).
	- Save.

3. **Ensure Jenkins agent can run Node and npm**
	- The agent/node where the pipeline runs must have internet access to download npm packages.
	- `curl` must be available for the smoke test stage (or adapt the script if you prefer another tool like `wget`).

### Create a Jenkins pipeline job

1. In Jenkins, click **New Item**.
2. Enter a name, e.g., `ci-cd-devsecops-pipeline-demo`.
3. Select **Pipeline** and click **OK**.
4. Under **Pipeline** section:
	- Set **Definition** to **Pipeline script from SCM**.
	- **SCM**: choose **Git**.
	- **Repository URL**: use the HTTPS or SSH URL of this repository (e.g., `https://github.com/navyarathore/CI-CD-DevSecOps-Pipeline.git`).
	- Branches to build: `*/main` (or whichever branch you want Jenkins to build).
	- Script Path: `Jenkinsfile` (default).
5. Click **Save**.

### Run the pipeline in Jenkins

1. Open the pipeline job page.
2. Click **Build Now**.
3. Watch the build in **Build History** and click the build number to see the console output.

You should see Jenkins executing the stages:

- Checkout
- Install dependencies (`npm install`)
- Run tests (`npm test`)
- Build / Package
- Run app (smoke test)

If everything succeeds, the build result will be **SUCCESS** and the console output will include:

- `All tests passed` from the test script.
- `Pipeline succeeded.` from the `post { success { ... } }` block.

### Common troubleshooting tips

- **NodeJS tool not found**
  - Error like `No tools matched the pattern 'NodeJS'` means the NodeJS tool is not configured or the name doesn’t match.
  - Fix: double-check **Manage Jenkins → Tools → NodeJS installations** and ensure the name is exactly `NodeJS`.

- **npm install fails**
  - Check that your Jenkins agent has internet access and proper proxy settings (if behind a corporate proxy).

- **Smoke test fails**
  - The `Run app (smoke test)` stage uses:
	 - `nohup npm start &` to start the server in the background.
	 - `sleep 5` to give it time to boot.
	 - `curl -f http://localhost:3000` to verify it responds.
  - If it fails, check the console log to see if the server started correctly or if the port is blocked.
