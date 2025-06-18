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
          sh 'ssh-add -l'  
          sh '''
            ssh -v -o StrictHostKeyChecking=no geonwoo@geonwooui-Macmini.local '
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin &&
              cd desktop/project/nginx &&
              /usr/local/bin/docker-compose -f docker-compose.service.yml pull interverse-api &&
              /usr/local/bin/docker-compose -f docker-compose.service.yml up -d interverse-api
            '
          '''
        }
      }
    }
  }
}