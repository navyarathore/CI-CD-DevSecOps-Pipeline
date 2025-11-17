pipeline {
	agent any

	tools {
		nodejs "NodeJS"
	}

	options {
		timestamps()
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
			echo 'Pipeline finished.'
		}
		success {
			echo 'Pipeline succeeded.'
		}
		failure {
			echo 'Pipeline failed.'
		}
	}
}
