pipeline {
	agent any

	tools {
		nodejs "NodeJS" 
	}

	environment {
		SONAR_SCANNER_HOME = tool name: 'SonarQube-Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
	}

	stages {
		stage('Checkout') {
			steps {
				checkout scm 
			}
		}

		stage('Install dependencies') {
			steps {
				sh 'npm install'
			}
		}

		stage('Run Jest Tests') {
			steps {
				script {
					echo 'Running Jest tests with coverage...'
					sh 'npm run test:coverage -- --ci --reporters=default --reporters=jest-junit'
				}
			}
			post {
				always {
					junit allowEmptyResults: true, testResults: 'junit.xml'
					
					publishHTML(target: [
						allowMissing: true,
						alwaysLinkToLastBuild: true,
						keepAll: true,
						reportDir: 'coverage/lcov-report',
						reportFiles: 'index.html',
						reportName: 'Code Coverage Report'
					])
				}
			}
		}

		stage('Build / Package') {
			steps {
				echo 'No build step needed for this simple Node.js app'
			}
		}

		stage('Run app (smoke test)') {
			steps {
				sh 'nohup npm start & sleep 5 && curl -f http://localhost:3000 || (echo "Smoke test failed" && exit 1)'
			}
		}

		stage('SonarQube Analysis') {
			steps {
				withSonarQubeEnv('SonarQube-Server') {
					sh """
						${SONAR_SCANNER_HOME}/bin/sonar-scanner \
						-Dsonar.projectKey=my-project-key \
						-Dsonar.sources=src \
						-Dsonar.host.url=http://localhost:9000
					"""
				}
			}
		}

		stage('Quality Gate') {
			steps {
				timeout(time: 5, unit: 'MINUTES') {
					waitForQualityGate abortPipeline: true
				}
			}
		}
	}

	post {
		always {
			echo "Pipeline finished with status: ${currentBuild.currentResult}"
		}

		success {
			emailext(
				subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
				body: """\
Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Status: SUCCESS
Build URL: ${env.BUILD_URL}
"""
			)
		}

		failure {
			emailext(
				subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
				body: """\
Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Status: FAILURE
Build URL: ${env.BUILD_URL}

Check console:
${env.BUILD_URL}console
"""
			)
		}
	}
}
