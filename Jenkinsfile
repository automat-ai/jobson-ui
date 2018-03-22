#!groovy
@Library('automat-jenkins-pipeline-utils@v0.5.0')
import com.automat.pipeline.Kubernetes

def k8s = new Kubernetes(this)

notifyBuild([slackChannelName: null]) {
  node {
    def appName = "jobson-ui"
    def shortCommit
    def version
    def imageName

    stage('Fetching sources') {
      println 'Processing branch => ' + env.BRANCH_Name
      checkout scm

      gitCommit = sh(returnStdout: true, script: 'git rev-parse --verify HEAD').trim()
      println gitCommit
      shortCommit = gitCommit.take(8)
      println shortCommit

      version = "1.0.0-${shortCommit}"
      imageName = "automatai/${appName}:${version}"
    }

    stage('Logging into docker hub') {
      withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'private-docker-registry',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
        sh "docker login -u ${USERNAME} -p ${PASSWORD}"
      }
    }

    if (env.BRANCH_NAME == 'master') {
      stage('Build docker image') {
        sh "docker build -t ${imageName} -f container/Dockerfile ."
      }

      stage('Publish docker image') {
        sh "docker push ${imageName}"
      }

      stage('Deploying to Staging') {
        k8s.deploy('dmz-rad', [
            'image': imageName,
        ])
      }
    }
  }
}
