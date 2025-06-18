pipeline {
  agent any
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
            docker build -t ventileco/interverse-api-server:latest ./
            docker push ventileco/interverse-api-server:latest
          '''
        }
      }
    }
    stage('Trigger Infra Deploy') {
      steps {
        sshagent(['macmini-git-key']) {
          sh '''
            ssh -o StrictHostKeyChecking=no geonwoo@geonwooui-Macmini.local '
              cd desktop/project/nginx &&
              docker-compose pull interverse-api &&
              docker-compose up -d interverse-api
            '
          '''
        }
      }
    }
  }
}