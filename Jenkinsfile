pipeline {
    agent any

    environment {
        IMAGE_NAME = "naamiahmed/django-devops"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$TAG .'
            }
        }

        stage('Login & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME:$TAG
                    docker logout
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop django-container || true
                docker rm django-container || true

                docker pull $IMAGE_NAME:$TAG

                docker run -d \
                  --restart always \
                  -p 8000:8000 \
                  --name django-container \
                  $IMAGE_NAME:$TAG
                '''
            }
        }

        stage('Cleanup Docker Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}