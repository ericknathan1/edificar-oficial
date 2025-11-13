pipeline {
    agent any

    stages {
        stage('Verificar Repositório') {
            steps {
                // O checkout busca o repositório inteiro, o que é o esperado.
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], useRemoteConfigs: [[url: 'https://github.com/ericknathan1/edificar-oficial']]])
            }
        }

        stage('Instalar Dependências e Compilar Backend') {
            steps {
                script {
                    // **Mudar para o diretório 'backend' para executar o Maven**
                    dir('backend') { 
                        // Atualiza o PATH se necessário
                        env.PATH = "/usr/bin:$PATH"
                        // Instalar as dependências Maven e compilar o backend
                        // Certifique-se de que o 'mvn clean install' deve ser executado aqui 
                        // se o pom.xml do backend estiver neste diretório.
                        bat 'mvn clean install'
                    }
                }
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    def appName = 'edificar'
                    // Recomenda-se usar BUILD_NUMBER para tags, é mais conciso.
                    def imageTag = "${appName}:${env.BUILD_NUMBER}" 
                    
                    // Acessar o diretório 'backend' para construir a imagem
                    dir('backend') {
                        // Construir a imagem Docker
                        // O '.' no final indica que o Dockerfile está no diretório atual (backend).
                        bat "docker build -t ${imageTag} ."
                    }
                }
            }
        }

        stage('Fazer Deploy') {
            steps {
                script {
                    def appName = 'edificar'
                    def imageTag = "${appName}:${env.BUILD_NUMBER}" // Usando BUILD_NUMBER

                    // **Os comandos Docker precisam ser executados no agente, não dentro do diretório 'backend'**
                    // a menos que você queira que eles executem um contexto específico, 
                    // mas comandos de gerenciamento de container (stop/rm/run) geralmente são globais.

                    // 1. Parar e remover o container existente (usa '|| true' ao invés de '|| exit 0' para Windows/bat)
                    // Note: '|| exit 0' pode funcionar, mas '|| true' é mais idiomático em shell. 
                    // No contexto de 'bat', '|| exit 0' é aceitável, mas em ambientes Linux/shell seria '|| true'
                    // Como você está usando `bat`, mantenha o `|| exit 0`.
                    echo "Parando e removendo container antigo: ${appName}"
                    bat "docker stop ${appName} || exit 0"
                    bat "docker rm -v ${appName} || exit 0"

                    // 2. Iniciar o novo container a partir da imagem construída
                    // **ASSUMIMOS** que o backend está rodando na porta 8080 e você quer expor para 8080.
                    echo "Iniciando novo container: ${appName} com imagem ${imageTag}"
                    bat "docker run -d --name ${appName} -p 8080:8080 ${imageTag}"
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy do Backend realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy do Backend.'
        }
    }
}