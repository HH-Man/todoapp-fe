          pipeline {
             agent any
            stages {
            stage('Prepare environment') {
               steps {
		        	nodejs(nodeJSInstallationName: 'nodejs1070'){
		            	sh "npm install"      
		       }    
            }
            }

            stage('Test and Code Analysis') {
              	parallel {
                   stage('Test') {
		                steps {
			                  sh "echo 'run frontend tests'"
		                }
          			}  
              	     stage('Code Analysis') {
		                steps {
		                  nodejs(nodeJSInstallationName: 'nodejs1070') {
		                    sh "sonar-scanner -Dsonar.host.url=http://sonarqube:9000"
		                  }
		                }
              		}
              	}
              }
            stage('Create Image Builder') {
                when {
                  expression {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        return !openshift.selector("bc", "frontend").exists();
                      }
                    }
                  }
                }
                steps {
                  script {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        openshift.newBuild("--name=frontend", "http://gogs:3000/gogs/todoapp-fe.git", "--strategy=docker")
                      }
                    }
                  }
                }
              }
              stage('Build Image') {
                steps {
                  script {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        openshift.selector("bc", "frontend").startBuild("--wait=true")
                      }
                    }
                  }
                }
              }
              stage('Create DEV') {
                when {
                  expression {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        return !openshift.selector('dc', 'frontend').exists()
                      }
                    }
                  }
                }
                steps {
                  script {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        def app = openshift.newApp("frontend:latest")
                        app.narrow("svc").expose();

//                        openshift.set("probe dc/frontend --readiness --get-url=http://:80 --initial-delay-seconds=30 --failure-threshold=10 --period-seconds=10")
//                        openshift.set("probe dc/frontend --liveness  --get-url=http://:80 --initial-delay-seconds=180 --failure-threshold=10 --period-seconds=10")

                        def dc = openshift.selector("dc", "frontend")
                        while (dc.object().spec.replicas != dc.object().status.availableReplicas) {
                            sleep 10
                        }
                        openshift.set("triggers", "dc/frontend", "--manual")
                      }
                    }
                  }
                }
              }
              stage('Deploy DEV') {
                steps {
                  script {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        openshift.selector("dc", "frontend").rollout().latest();
                      }
                    }
                  }
                }
              }
            }
          }