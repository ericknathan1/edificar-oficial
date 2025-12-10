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

                    dir('backend') {
                        sh "docker build -t ${imageTag} ."
                    }
                    
                }
            }
        }

        stage('Fazer Deploy') {
            steps {
                script {
                    def appName = 'edificar'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    sh "docker stop ${appName} || exit 0"
                    sh "docker rm -v ${appName} || exit 0"
                    sh "docker run -d --name ${appName} -p 8417:8417 ${imageTag}"
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