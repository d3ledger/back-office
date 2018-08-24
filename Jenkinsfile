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
            sh(script: "echo \"SUBNET=${env.GIT_COMMIT}\" > .env && docker-compose -f docker/docker-compose.yaml up --build -d")
            sh(script: "docker exec d3-back-office-${env.GIT_COMMIT} /app/docker/back-office/wait-for-up.sh")
            sh(script: "docker exec d3-back-office-${env.GIT_COMMIT} CYPRESS_baseUrl=http://localhost:8080 CYPRESS_IROHA=http://grpcwebproxy:8080 cypress -P=/app run")
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
