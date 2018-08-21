pipeline {
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
    stage('Tests (unit, e2e') {
      agent { label 'x86_64' }
      steps {
        script {
          iC = docker.image("cypress/base:10")
          iC.inside("--shm-size 4096m --ipc=host") { //--cap-add=SYS_ADMIN
            sh(script: "yarn install --frozen-lockfile")
            sh(script: "yarn global add serve cypress")
            sh(script: "nohup yarn serve &")
            sh(script: "yarn test:unit && cypress run --env URL=http://127.0.0.1:8080,IROHA_URL=http://95.179.153.222:8081")
          }
        }
      }
      post {
        cleanup {
          cleanWs()
        }
      }
    }
  }
}
