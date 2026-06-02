pipeline {
    agent any

    environment {
        DOCKER_USER  = 'luismora1998'
        IMAGE_NAME   = "luismora1998/devops-u2-app"
    }

    stages {

        stage('1 - Clonar repositorio') {
            steps {
                echo 'Clonando repositorio desde GitHub...'
                checkout scm
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('2 - Construir imagen Docker') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest"
                echo "Imagen construida: ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('3 - Publicar imagen en Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKER_TOKEN')]) {
                    sh 'echo $DOCKER_TOKEN | docker login -u luismora1998 --password-stdin'
                }
                sh "docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
                sh "docker push ${IMAGE_NAME}:latest"
                echo "Imagen publicada: ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('4 - Preparar despliegue en Kubernetes') {
            steps {
                sh "sed 's/IMAGE_TAG/${BUILD_NUMBER}/g' k8s/deployment.yaml | kubectl apply -f -"
                sh "kubectl apply -f k8s/service.yaml"
                sh "kubectl rollout status deployment/devops-u2-app --timeout=120s"
                echo "Despliegue completado en Kubernetes"
            }
        }

    }

    post {
        success {
            echo "Pipeline exitoso - version ${BUILD_NUMBER} desplegada"
        }
        failure {
            echo "Pipeline fallido - revisar logs"
        }
        always {
            sh 'docker logout || true'
        }
    }
}
