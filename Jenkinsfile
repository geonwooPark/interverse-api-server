pipeline {
  agent any

  environment {
    IMAGE_NAME = 'ventileco/interverse-api-server:alpha'
    DOCKER_FILE = 'Dockerfile.alpha'
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
            docker build -f $DOCKER_FILE -t $IMAGE_NAME .
            docker push $IMAGE_NAME
          '''
        }
      }
    }

   stage('Trigger Infra Deploy') {
    steps {
      sshagent(['macmini-git-key']) {
        sh """
          ssh -tt -o StrictHostKeyChecking=no geonwoo@geonwooui-Macmini.local bash -c \\
          "security -v unlock-keychain ~/Library/Keychains/login.keychain-db && \\
          export PATH=\\\$PATH:/usr/local/bin && \\
          cd ~/desktop/project/nginx && \\
          docker-compose -f docker-compose.service.yml pull interverse-api && \\
          docker-compose -f docker-compose.service.yml up -d interverse-api"
        """
      }
    }
}
  }
}
