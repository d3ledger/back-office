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
    stage('Tests (unit, e2e)') {
      agent { label 'docker_3' }
      steps {
        // sh(returnStdout: true, script: "docker network create --attachable d3-${env.GIT_COMMIT}")
        writeFile file: ".env", text: "SUBNET=d3-${env.GIT_COMMIT}"
        sh(returnStdout: true, script: "docker-compose -f docker/docker-compose.yaml up --build -d")
        sh(returnStdout: true, script: "docker exec d3-back-office-${env.GIT_COMMIT} /app/docker/back-office/wait-for-up.sh")
        iC = docker.image('cypress/base:10')
        iC.inside("--network='d3-${env.GIT_COMMIT}' --shm-size 4096m --ipc=host") {
          sh(returnStdout: true, script: "yarn install --frozen-lockfile")
        //   sh(script: "yarn test:unit")
          sh(returnStdout: true, script: "yarn test:je2e")
        }
      }
    }
    post {
      cleanup {
        sh(script: "docker-compose -f docker/docker-compose.yaml down")
      //   sh(returnStdout: true, script: "docker network rm d3-${env.GIT_COMMIT}")
        cleanWs()
      }
    }
  }
}

