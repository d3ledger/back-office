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
      agent { label 'x86_64' }
      steps {
        script {
            writeFile file: ".env", text: "SUBNET=${env.GIT_COMMIT}"
            sh(returnStdout: true, script: "docker-compose -f docker/docker-compose.yaml up --build -d")
            sh(returnStdout: true, script: "docker exec d3-back-office-${env.GIT_COMMIT} /app/docker/back-office/wait-for-up.sh")
            // iC = docker.image('cypress/base:10')
            // iC.inside("--network='d3-${env.GIT_COMMIT}' --shm-size 4096m --ipc=host") {
            //   sh(script: "yarn global add cypress")
            //   var = sh(returnStatus:true, script: "yarn test:unit")
            //   if (var != 0) {
            //     echo '[FAILURE] Unit tests failed'
            //     currentBuild.result = 'FAILURE';
            //     return var
            //   }
            //   var = sh(returnStatus:true, script: "CYPRESS_baseUrl=http://d3-back-office:8080 CYPRESS_IROHA=http://grpcwebproxy:8080 cypress run")
            //   if (var != 0) {
            //     echo '[FAILURE] E2E tests failed'
            //     currentBuild.result = 'FAILURE';
            //     return var
            //   }
            // }
            // if (env.GIT_LOCAL_BRANCH in ["develop"] || env.CHANGE_BRANCH_LOCAL == 'develop') {
              def branch = env.CHANGE_BRANCH_LOCAL == 'develop' ? env.CHANGE_BRANCH_LOCAL : env.GIT_LOCAL_BRANCH
              sshagent(['jenkins-back-office']) {
                sh "ssh-agent"
                sh """
                  rsync \
                  -e 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no' \
                  -rzcv --delete \
                  dist/* \
                  root@95.179.153.222:/var/www/dev/
                """
              }
            // }
        }
      }
      post {
        cleanup {
          sh(script: "docker-compose -f docker/docker-compose.yaml down")
          cleanWs()
        }
      }
    }
  }
}
