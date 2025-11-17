pipeline {
	agent any

	tools {
		nodejs "NodeJS"
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

		stage('Run tests') {
			steps {
				sh 'npm test'
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
	}

	post {
		always {
			echo "Pipeline finished with status: ${currentBuild.currentResult}"
		}

		success {
			script {
				def r = env.DEFAULT_MAIL_RECIPIENTS?.trim()
				def args = [
					subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
					body: """\
Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Status: SUCCESS
Build URL: ${env.BUILD_URL}
"""
				]
				if (r) { args.to = r }
				emailext(args)
			}
		}

		failure {
			script {
				def r = env.DEFAULT_MAIL_RECIPIENTS?.trim()
				def args = [
					subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
					body: """\
Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Status: FAILURE
Build URL: ${env.BUILD_URL}

Check console output for details:
${env.BUILD_URL}console
"""
				]
				if (r) { args.to = r }
				emailext(args)
			}
		}
	}
}
