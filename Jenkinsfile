pipeline {
    agent any
    
    // Variáveis de ambiente para facilitar a manutenção
    environment {
        // Nome da imagem e do container. Uso 'edificar-backend' para evitar conflito.
        APP_NAME = 'edificar-backend'
        // Usa o número da build do Jenkins para taggear a imagem.
        IMAGE_TAG = "${APP_NAME}:${env.BUILD_NUMBER}"
        
        // Caminho relativo para a pasta do backend (assumindo que o Jenkinsfile está na raiz 'edificar-oficial/')
        BACKEND_DIR = 'edificar-oficial/backend'
    }

    stages {
        stage('Checkout do Código Fonte') {
            steps {
                // Configuração básica de checkout. Assumindo que você já tem o SCM configurado.
                // Se a URL for privada, você precisará adicionar credenciais ao checkout scm.
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/ericknathan1/edificar-oficial']]])
                echo "Repositório verificado."
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    echo 'Iniciando construção da imagem Docker...'
                    
                    // Entra no diretório do backend.
                    dir(BACKEND_DIR) {
                        echo 'Construindo JAR e Imagem Docker...'
                        
                        // O comando 'docker build' executa o Multi-Stage Build:
                        // 1. Compila o JAR (pulando os testes para evitar o erro de JVM que ocorreu).
                        // 2. Cria a imagem final leve com o JAR.
                        sh "docker build -t ${IMAGE_TAG} ."
                    }
                    echo "Imagem Docker construída: ${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy (Reiniciar Container)') {
            steps {
                script {
                    echo 'Iniciando processo de deploy...'
                    
                    // 1. Parar e remover o container existente
                    // '|| true' garante que o pipeline não falhe se o container não existir.
                    echo "Parando e removendo container antigo: ${APP_NAME}"
                    sh "docker stop ${APP_NAME} || true"
                    sh "docker rm ${APP_NAME} || true"

                    // 2. Iniciar o novo container a partir da imagem construída
                    echo "Iniciando novo container: ${APP_NAME}"
                    // -d: detached mode (em segundo plano)
                    // --restart=always: Garante que o container suba em caso de falha ou reinício do host.
                    // -p 8080:8080: Mapeia a porta interna 8080 (Java) para a porta externa 8080 do host.
                    sh "docker run -d --restart=always --name ${APP_NAME} -p 8080:8080 ${IMAGE_TAG}"
                    
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
            echo "Serviço rodando como container: ${APP_NAME}"
            echo "Imagem utilizada: ${IMAGE_TAG}"
            // Comando para checar o status no servidor, se necessário
            sh "docker ps -f name=${APP_NAME}"
        }
        failure {
            echo '=================================================='
            echo '           ❌ FALHA NO DEPLOY DO BACKEND!          '
            echo '=================================================='
            echo 'Verifique os logs da etapa de "Construir Imagem Docker" e a compilação Maven.'
        }
    }
}