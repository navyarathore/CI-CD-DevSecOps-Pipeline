# CI-CD DevSecOps Pipeline Demo

This repository contains a Task Manager REST API built with Node.js, Express, and MongoDB, demonstrating CI/CD and DevSecOps practices with comprehensive testing and automated pipelines.

## Project Overview

This is a full-stack Task Manager application featuring:

- **RESTful API** with CRUD operations for task management
- **MongoDB** integration with Mongoose ODM
- **Comprehensive testing** with Jest and Supertest
- **Code coverage reporting** with multiple formats (lcov, HTML, Cobertura)
- **CI/CD pipeline** using Jenkins
- **Email notifications** for build status
- **In-memory database** testing with MongoDB Memory Server

## Project Structure

```
.
├── app.js                          # Express application setup
├── server.js                       # Server entry point
├── Jenkinsfile                     # Jenkins CI/CD pipeline configuration
├── package.json                    # Project dependencies and scripts
├── jest.config.js                  # Jest testing configuration
├── config/
│   └── db.js                       # MongoDB connection configuration
├── models/
│   └── Task.js                     # Task mongoose model
├── controllers/
│   └── taskController.js           # Task controller with CRUD operations
├── routes/
│   └── taskRoutes.js               # API route definitions
└── __tests__/                      # Test suite
    ├── setup.js                    # Jest setup with MongoDB Memory Server
    ├── controllers/
    │   └── taskController.test.js  # Controller unit tests
    ├── models/
    │   └── Task.test.js            # Model tests
    └── routes/
        └── taskRoutes.test.js      # Route integration tests
```

## API Endpoints

The application provides the following REST API endpoints:

- **GET** `/` - Health check endpoint
- **POST** `/api/tasks` - Create a new task
- **GET** `/api/tasks` - Get all tasks
- **GET** `/api/tasks/:id` - Get a specific task by ID
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

### Task Schema

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "status": "pending | in-progress | completed (default: pending)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (for production) or MongoDB Memory Server (for testing)
- **Jenkins** (for CI/CD pipeline)

## Local Development

### Installation

```bash
cd "CI-CD DevSecOps Pipeline"
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-manager
NODE_ENV=development
```

### Run the application

```bash
npm start
```

The server will start on http://localhost:3000

### Development mode with auto-reload

```bash
npm run dev
```

### Testing the API

Health check:
```bash
curl http://localhost:3000
```

Create a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description","status":"pending"}'
```

Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```

## Testing

The project uses **Jest** as the testing framework with **Supertest** for API testing and **MongoDB Memory Server** for isolated database testing.

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **Cobertura**: `coverage/cobertura-coverage.xml`
- **JUnit XML**: `junit.xml`

### Run tests with verbose output

```bash
npm run test:verbose
```

## CI/CD Pipeline (Jenkins)

The `Jenkinsfile` defines a comprehensive declarative pipeline with the following stages:

### Pipeline Stages

1. **Checkout** - Checks out the source code from SCM (GitHub)
2. **Install dependencies** - Runs `npm install` to install all project dependencies
3. **Run Jest Tests** - Executes the complete test suite with coverage reporting
   - Runs tests in CI mode with JUnit reporter
   - Publishes test results to Jenkins
   - Generates and publishes HTML coverage reports
4. **Build / Package** - Placeholder for build steps (not required for this Node.js app)
5. **Run app (smoke test)** - Starts the application and performs a smoke test using curl

### Pipeline Features

- **Automated Testing**: Runs Jest tests with coverage on every build
- **Test Reporting**: Publishes JUnit test results for visualization in Jenkins
- **Coverage Reporting**: Generates and archives HTML coverage reports
- **Email Notifications**: Sends email notifications on build success/failure
- **Smoke Testing**: Validates the application starts correctly

### Prerequisites for Jenkins

#### 1. Install Required Plugins

Go to **Manage Jenkins → Manage Plugins → Available** and install:
- **NodeJS Plugin** - For Node.js environment setup
- **HTML Publisher Plugin** - For publishing coverage reports
- **Email Extension Plugin** - For email notifications (usually pre-installed)

#### 2. Configure NodeJS Tool

1. Go to **Manage Jenkins → Tools**
2. Under **NodeJS installations**, click **Add NodeJS**
3. Name: `NodeJS` (must match the name in Jenkinsfile)
4. Select installation method (e.g., Install automatically)
5. Choose Node.js version (v18+ recommended)
6. Save

#### 3. Configure Email Notifications (Optional)

1. Go to **Manage Jenkins → Configure System**
2. Scroll to **Extended E-mail Notification**
3. Configure SMTP server settings:
   - SMTP server: Your SMTP server address
   - Default user e-mail suffix: Your domain
   - Configure credentials if required
4. Save

#### 4. System Requirements

Ensure the Jenkins agent has:
- Internet access for downloading npm packages
- `curl` installed for smoke tests
- Sufficient permissions to run Node.js applications

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
