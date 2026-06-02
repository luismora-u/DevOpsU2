pipeline {
    agent any

    stages {

        stage('1 - Clonar repositorio') {
            steps {
                echo 'Clonando repositorio desde GitHub...'
                checkout scm
                echo "Branch: ${env.GIT_BRANCH} | Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('2 - Construir imagen Docker') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-username', variable: 'DOCKER_USER')]) {
                    sh "docker build -t ${DOCKER_USER}/devops-u2-app:${BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_USER}/devops-u2-app:${BUILD_NUMBER} ${DOCKER_USER}/devops-u2-app:latest"
                    echo "Imagen construida: ${DOCKER_USER}/devops-u2-app:${BUILD_NUMBER}"
                }
            }
        }

        stage('3 - Publicar imagen en Docker Hub') {
            steps {
                withCredentials([
                    string(credentialsId: 'dockerhub-username', variable: 'DOCKER_USER'),
                    string(credentialsId: 'dockerhub-token', variable: 'DOCKER_TOKEN')
                ]) {
                    sh 'echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${DOCKER_USER}/devops-u2-app:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_USER}/devops-u2-app:latest"
                    echo "Imagen publicada en Docker Hub"
                }
            }
        }

        stage('4 - Preparar despliegue en Kubernetes') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-username', variable: 'DOCKER_USER')]) {
                    sh """
                        sed 's/IMAGE_TAG/${BUILD_NUMBER}/g' k8s/deployment.yaml > k8s/deployment-final.yaml
                        sed -i 's|luismora1998/devops-u2-app|${DOCKER_USER}/devops-u2-app|g' k8s/deployment-final.yaml
                        kubectl apply -f k8s/deployment-final.yaml
                        kubectl apply -f k8s/service.yaml
                        kubectl rollout status deployment/devops-u2-app --timeout=120s
                    """
                }
            }
        }

    }

    post {
        success {
            echo "Despliegue exitoso - version ${BUILD_NUMBER} en produccion"
        }
        failure {
            echo "El pipeline fallo - revisar logs"
        }
        always {
            sh 'docker logout || true'
        }
    }
}
