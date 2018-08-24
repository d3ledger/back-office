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
        script {
            // sh(returnStdout: true, script: "docker network create --attachable d3-${env.GIT_COMMIT}")
            writeFile file: ".env", text: "SUBNET=${env.GIT_COMMIT}"
            sh(returnStdout: true, script: "docker-compose -f docker/docker-compose.yaml up --build -d")
            sh(returnStdout: true, script: "docker exec d3-back-office-${env.GIT_COMMIT} /app/docker/back-office/wait-for-up.sh")
            // iC = docker.image('docker_d3-back-office')
            // iC.inside("--network='d3-${env.GIT_COMMIT}' --entrypoint 'ls -al'") {
            //   sh 'ls -al'
            // //   sh(returnStdout: true, script: "yarn --cwd /app test:je2e") 
            // }

            iC = docker.image('cypress/base:10')
            iC.inside("--network='d3-${env.GIT_COMMIT}' --shm-size 4096m --ipc=host") {
              sh(script: "yarn global add cypress")
            //   sh(script: "yarn test:unit")
              sh(script: "CYPRESS_baseUrl=http://d3-back-office:8080 CYPRESS_IROHA=http://grpcwebproxy:8080 cypress run")
            //   sh(returnStdout: true, script: "yarn --cwd /app test:je2e") 
            }
            // sh(returnStdout: true, script: "docker exec d3-back-office-${env.GIT_COMMIT} yarn --cwd /app test:je2e")
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
}
