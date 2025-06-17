pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm 
      }
    }
    stage('Build Image') {
      steps {
        sh 'docker build -t ventileco/interverse-api-server:latest ./'
        sh 'docker push ventileco/interverse-api-server:latest'
      }
    }
    stage('Trigger Infra Deploy') {
      steps {
        build job: 'deploy-infra'  
      }
    }
  }
}
