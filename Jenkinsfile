pipeline {
    agent any

    environment {
        // Nome da imagem e do container
        APP_NAME = 'edificar-backend'
        // Usa o número da build para tag, ou 'latest'
        IMAGE_TAG = "${APP_NAME}:${env.BUILD_NUMBER}"
    }

    stages {
        stage('Verificar Repositório') {
            steps {
                // O Jenkins fará o checkout da branch main automaticamente
                checkout scm
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    // Entra no diretório do backend onde está o Dockerfile e o pom.xml
                    dir('edificar-oficial/backend') {
                        echo 'Construindo imagem Docker...'
                        // O comando docker build já executa o mvn package dentro dele (devido ao multi-stage build)
                        // Não é necessário rodar 'mvn clean install' fora do Docker se o Dockerfile já o faz.
                        if (isUnix()) {
                            sh "docker build -t ${IMAGE_TAG} ."
                        } else {
                            bat "docker build -t ${IMAGE_TAG} ."
                        }
                    }
                }
            }
        }

        stage('Deploy (Reiniciar Container)') {
            steps {
                script {
                    echo 'Iniciando processo de deploy...'
                    
                    // Comandos compatíveis com Windows (bat)
                    // || exit 0 garante que o pipeline não falhe se o container não existir ainda
                    bat "docker stop ${APP_NAME} || exit 0"
                    bat "docker rm ${APP_NAME} || exit 0"

                    echo "Iniciando novo container: ${APP_NAME}"
                    // Roda o container na porta 8080 e reinicia automaticamente se cair
                    bat "docker run -d --restart=always --name ${APP_NAME} -p 8080:8080 ${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo 'Backend implantado com sucesso!'
        }
        failure {
            echo 'Falha no deploy do Backend.'
        }
    }
}