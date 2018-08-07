properties([parameters([
  ])])


pipeline {
  environment {
    GIT_RAW_BASE_URL = "https://raw.githubusercontent.com/d3ledger/back-office"
    DOCKER_REGISTRY_BASENAME = "d3ledger/back-office"

  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  agent any
  stages {
    stage ('Stop same job builds') {
      agent { label 'master' }
      steps {
        script {
          // need this for develop->master PR cases
          // CHANGE_BRANCH is not defined if this is a branch build
          try {
            CHANGE_BRANCH_LOCAL = env.CHANGE_BRANCH
          }
          catch(MissingPropertyException e) { }
          if (GIT_LOCAL_BRANCH != "develop" && CHANGE_BRANCH_LOCAL != "develop") {
            def builds = load ".jenkinsci/cancel-builds-same-job.groovy"
            builds.cancelSameJobBuilds()
          }
        }
      }
    }
    stage('Build project') {
      agent { label 'x86_64' }
      steps {
        script {
          docker {image 'node:10-alpine'}
        }
      }
      post {
        // success {
        //   script {
        //   }
        // }
        cleanup {
          cleanWs()
        }
      }
    }
  }
}