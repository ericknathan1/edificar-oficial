pipeline {
    agent any
    stages {
        stage('Verificar Repositório') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], useRemoteConfigs: [[url: 'https://github.com/ericknathan1/edificar-oficial.git']]])
            }
        }

        stage('Instalar Dependências') {
            steps {
                script {
                    env.PATH = "/usr/bin:$PATH"
                     dir('backend') {
                        sh 'mvn clean install'
                     }
                }
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    def appName = 'edificar'
                    def imageTag = "${appName}:${env.BUILD_ID}"
                    // O build aqui será muito mais rápido agora
                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Fazer Deploy') {
            steps {
                script {
                    def appName = 'edificar'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    // Limpa container anterior
                    sh "docker stop ${appName} || exit 0"
                    sh "docker rm -v ${appName} || exit 0"
                     
                   sh """
                        docker run -d \
                        --name ${appName} \
                        --memory=2g \
                        --cpus="1" \
                        -v /data/app_producao:/var/lib/app_dados \
                        -p 8417:8417 \
                        ${imageTag}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy.'
        }
    }
}