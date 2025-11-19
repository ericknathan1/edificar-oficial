pipeline {
    // Nota: O erro indica que este pipeline está rodando em um AGENTE WINDOWS.
    agent any
    
    // Variáveis de ambiente para facilitar a manutenção
    environment {
        // Nome da imagem e do container. Uso 'edificar-backend' para evitar conflito.
        APP_NAME = 'edificar-backend'
        // Usa o número da build do Jenkins para taggear a imagem.
        IMAGE_TAG = "${APP_NAME}:${env.BUILD_NUMBER}"
        
        // Caminho relativo para a pasta do backend
        BACKEND_DIR = 'edificar-oficial/backend'
    }

    stages {
        stage('Checkout do Código Fonte') {
            steps {
                // O Jenkins faz o checkout
                checkout scm
                echo "Repositório verificado."
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    echo 'Iniciando construção da imagem Docker...'
                    
                    // Entra no diretório do backend (compatível com Windows)
                    dir(BACKEND_DIR) {
                        echo 'Construindo JAR e Imagem Docker...'
                        
                        // COMANDO CORRIGIDO: Usando 'bat' para Windows
                        bat "docker build -t ${IMAGE_TAG} ."
                    }
                    echo "Imagem Docker construída: ${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy (Reiniciar Container)') {
            steps {
                script {
                    echo 'Iniciando processo de deploy...'
                    
                    // COMANDOS CORRIGIDOS: Usando 'bat' para Windows
                    // '|| exit 0' garante que o pipeline não falhe se o container não existir.
                    echo "Parando e removendo container antigo: ${APP_NAME}"
                    bat "docker stop ${APP_NAME} || exit 0"
                    bat "docker rm ${APP_NAME} || exit 0"

                    // Iniciar o novo container
                    echo "Iniciando novo container: ${APP_NAME}"
                    bat "docker run -d --restart=always --name ${APP_NAME} -p 8080:8080 ${IMAGE_TAG}"
                    
                    echo "Container ${APP_NAME} iniciado com sucesso."
                }
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo '           ✅ DEPLOY DO BACKEND CONCLUÍDO!         '
            echo '=================================================='
        }
        failure {
            echo '=================================================='
            echo '           ❌ FALHA NO DEPLOY DO BACKEND!          '
            echo '=================================================='
            echo 'Verifique os logs.'
        }
    }
}