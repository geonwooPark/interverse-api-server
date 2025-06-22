pipeline {
  agent any

  environment {
    DOCKERFILE = ''
    IMAGE_NAME = ''
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          if (env.BRANCH_NAME == 'dev') {
            env.DOCKERFILE = 'Dockerfile.alpha'
            env.IMAGE_NAME = "ventileco/interverse-api-server:alpha"
          } else {
            env.DOCKERFILE = 'Dockerfile.prod'
            env.IMAGE_NAME = "ventileco/interverse-api-server:latest"
          }
        }
      }
    }

    stage('Docker Login & Build Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build -f $DOCKERFILE -t $IMAGE_NAME ./
            docker push $IMAGE_NAME
          '''
        }
      }
    }

    stage('Trigger Infra Deploy') {
      steps {
        sshagent(['macmini-git-key']) {
          sh """
            ssh -tt -o StrictHostKeyChecking=no geonwoo@geonwooui-Macmini.local bash -c '
              export PATH=\$PATH:/usr/local/bin &&
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
