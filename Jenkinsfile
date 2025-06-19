pipeline {
  agent any

  environment {
    IMAGE_NAME = 'ventileco/interverse-api-server:latest'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Docker Login & Build Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build -t $IMAGE_NAME ./
            docker push $IMAGE_NAME
          '''
        }
      }
    }

    stage('Trigger Infra Deploy') {
      steps {
        sshagent(['macmini-git-key']) {
          withCredentials([usernamePassword(credentialsId: 'docker-hub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh """
              ssh -tt -o StrictHostKeyChecking=no geonwoo@geonwooui-Macmini.local bash -c '
                export PATH=\$PATH:/usr/local/bin &&
                export DOCKER_CONFIG=\$HOME/.jenkins-docker &&
                export DOCKER_USER="${DOCKER_USER}" &&
                export DOCKER_PASS="${DOCKER_PASS}" &&
                mkdir -p \$DOCKER_CONFIG &&
                echo "\$DOCKER_PASS" | docker --config \$DOCKER_CONFIG login -u "\$DOCKER_USER" --password-stdin || echo "login failed" &&
                cd ~/desktop/project/nginx &&
                docker-compose -f docker-compose.service.yml pull interverse-api &&
                docker-compose -f docker-compose.service.yml up -d interverse-api
              '
            """
          }
        }
      }
    }
  }
}
