pipeline {
    // Define que o pipeline pode ser executado em qualquer agente disponível.
    agent any

    stages {
        stage('Checkout do Código Fonte') {
            steps {
                // Configuração para buscar o código do GitHub
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/ericknathan1/edificar-oficial']]])
                echo "Repositório verificado."
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    // Definições locais (substituindo o bloco environment)
                    def APP_NAME = 'edificar-backend'
                    def IMAGE_TAG = "${APP_NAME}:${env.BUILD_NUMBER}"
                    def BACKEND_DIR = 'edificar-oficial/backend'

                    echo 'Iniciando construção da imagem Docker...'
                    
                    // Entra no diretório do backend (onde está o Dockerfile)
                    dir(BACKEND_DIR) {
                        echo 'Construindo JAR e Imagem Docker...'
                        
                        // 'sh' executa o comando Shell no agente Linux.
                        // O Dockerfile (com Multi-Stage Build) fará o mvn clean package -DskipTests.
                        sh "docker build -t ${IMAGE_TAG} ."
                    }
                    echo "Imagem Docker construída: ${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy (Reiniciar Container)') {
            steps {
                script {
                    // As variáveis precisam ser definidas novamente neste novo bloco 'script'
                    def APP_NAME = 'edificar-backend'
                    def IMAGE_TAG = "${APP_NAME}:${env.BUILD_NUMBER}"

                    echo 'Iniciando processo de deploy...'
                    
                    // 1. Parar e remover o container existente
                    // '|| true' previne que o pipeline falhe se o container não existir (comportamento Linux).
                    echo "Parando e removendo container antigo: ${APP_NAME}"
                    sh "docker stop ${APP_NAME} || true"
                    sh "docker rm ${APP_NAME} || true"

                    // 2. Iniciar o novo container
                    echo "Iniciando novo container: ${APP_NAME}"
                    // Mapeamento de porta: -p 8080 (host):8080 (container)
                    sh "docker run -d --restart=always --name ${APP_NAME} -p 8080:8080 ${IMAGE_TAG}"
                    
                    echo "Container ${APP_NAME} iniciado com sucesso e rodando na porta 8080."
                }
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo '           ✅ DEPLOY DO BACKEND CONCLUÍDO!         '
            echo '=================================================='
            // Aqui as variáveis persistem apenas como variáveis de ambiente padrão, como BUILD_NUMBER.
            sh "echo Imagem utilizada: ${env.BUILD_NUMBER}"
        }
        failure {
            echo '=================================================='
            echo '           ❌ FALHA NO DEPLOY DO BACKEND!          '
            echo '=================================================='
            echo 'Verifique os logs.'
        }
    }
}