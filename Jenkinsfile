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

        stage('Compilar APK React Native') { // NOVO STAGE: Compilação do APK
            steps {
                script {
                    // ATENÇÃO: O agente Jenkins precisa ter o Node.js, Android SDK e credenciais de assinatura (keystore) configuradas.
                    dir('frontend/android') {
                        // Comando para gerar a APK de release
                        sh './gradlew assembleRelease'
                    }
                    echo 'APK de Release gerado em frontend/android/app/build/outputs/apk/release/app-release.apk'
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

                    // Para e remove container existente, se houver
                    sh "docker stop ${appName} || exit 0"
                    sh "docker rm -v ${appName} || exit 0"

                    // Executar o novo container
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