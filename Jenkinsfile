pipeline {
    agent any

    environment {
        DOCKERHUB_USER    = credentials('dockerhub-username')
        DOCKERHUB_TOKEN   = credentials('dockerhub-token')
        IMAGE_NAME        = "${DOCKERHUB_USER}/devops-u2-app"
        IMAGE_TAG         = "${BUILD_NUMBER}"
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
                echo "Construyendo imagen: ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('3 - Publicar imagen en Docker Hub') {
            steps {
                echo 'Publicando imagen en Docker Hub...'
                sh "echo ${DOCKERHUB_TOKEN} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('4 - Preparar despliegue en Kubernetes') {
            steps {
                echo 'Aplicando manifiestos en Kubernetes...'
                sh """
                    sed -i 's|IMAGE_TAG|${IMAGE_TAG}|g' k8s/deployment.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl rollout status deployment/devops-u2-app --timeout=120s
                """
            }
        }

    }

    post {
        success {
            echo "Despliegue exitoso - versión ${IMAGE_TAG} en producción"
        }
        failure {
            echo "El pipeline falló - revisar logs"
        }
        always {
            sh "docker logout"
        }
    }
}
