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

### Create a Jenkins Pipeline Job

1. In Jenkins, click **New Item**
2. Enter a name, e.g., `task-manager-ci-cd-pipeline`
3. Select **Pipeline** and click **OK**
4. Under **Pipeline** section:
   - **Definition**: Select **Pipeline script from SCM**
   - **SCM**: Choose **Git**
   - **Repository URL**: `https://github.com/navyarathore/CI-CD-DevSecOps-Pipeline.git`
   - **Branches to build**: `*/main`
   - **Script Path**: `Jenkinsfile`
5. Click **Save**

### Run the Pipeline

1. Open the pipeline job page
2. Click **Build Now**
3. Watch the build in **Build History**
4. Click the build number to view:
   - **Console Output** - Full build logs
   - **Test Result** - JUnit test results
   - **Code Coverage Report** - HTML coverage report

### Expected Build Results

On successful build, you should see:

- ✅ All stages completed successfully
- ✅ Test results published (with pass/fail counts)
- ✅ Code coverage report available
- ✅ Email notification sent (if configured)
- ✅ Smoke test passed with HTTP 200 response

### Build Artifacts

Each build produces:
- **junit.xml** - JUnit test results
- **coverage/** - Code coverage reports in multiple formats
- **Console logs** - Full execution logs

## Troubleshooting

### NodeJS Tool Not Found

**Error**: `No tools matched the pattern 'NodeJS'`

**Solution**: Ensure the NodeJS tool is configured in Jenkins with the exact name `NodeJS`
- Go to **Manage Jenkins → Tools → NodeJS installations**
- Verify the name matches exactly

### npm install Fails

**Error**: Package installation errors

**Solution**:
- Check Jenkins agent has internet access
- Configure proxy settings if behind corporate firewall
- Verify npm registry is accessible

### Tests Fail in Jenkins

**Error**: Tests pass locally but fail in Jenkins

**Solution**:
- Check environment variables (NODE_ENV should be 'test')
- Verify MongoDB Memory Server can run in Jenkins environment
- Check console output for specific error messages

### Smoke Test Fails

**Error**: Smoke test returns non-200 status code

**Solution**:
- Ensure port 3000 is not already in use
- Increase sleep time in Jenkinsfile if app takes longer to start
- Check application logs in console output
- Verify no MongoDB connection errors (app should skip DB in test mode)

### Coverage Report Not Published

**Error**: HTML Publisher plugin not working

**Solution**:
- Install HTML Publisher plugin
- Check `coverage/lcov-report/index.html` exists after test run
- Verify Jenkins has permission to read coverage directory

### Email Notifications Not Sent

**Error**: No emails received on build success/failure

**Solution**:
- Configure SMTP settings in Jenkins
- Add recipient email addresses in Jenkinsfile
- Test email configuration using Jenkins built-in test feature

## Project Features

### Technology Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing Framework**: Jest
- **HTTP Testing**: Supertest
- **In-Memory DB**: MongoDB Memory Server
- **CI/CD**: Jenkins
- **Code Coverage**: Istanbul (via Jest)

### DevSecOps Practices

- ✅ Automated testing on every commit
- ✅ Code coverage reporting and tracking
- ✅ Continuous integration with Jenkins
- ✅ Automated smoke testing
- ✅ Email notifications for build status
- ✅ JUnit test result reporting
- ✅ Multiple coverage report formats for different tools

### Testing Strategy

- **Unit Tests**: Controller and model testing
- **Integration Tests**: API route testing with Supertest
- **Isolation**: MongoDB Memory Server for database isolation
- **Coverage**: Comprehensive code coverage reporting
- **CI Ready**: Tests run reliably in CI environment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

Repository: [CI-CD-DevSecOps-Pipeline](https://github.com/navyarathore/CI-CD-DevSecOps-Pipeline)

---

**Happy Coding! 🚀**
