/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Helpers } from "./Helpers";

export class JobsonAPI {

  constructor(httpService) {
    this.http = httpService;
  }


  urlToJobSpecSummaries() {
  	return `${API_PREFIX}/v1/specs`;
	}

	buildAPIPathTo(subPath) {
  	return `${API_PREFIX}` + subPath;
	}

  fetchJobSpecSummaries() {
    return this.http
			.get(this.urlToJobSpecSummaries())
			.then(resp => JSON.parse(resp).entries);
  }


  urlToJobSpec(id) {
		return `${API_PREFIX}/v1/specs/${id}`
	}

	fetchJobSpec(id) {
		return this.http
			.get(this.urlToJobSpec(id))
			.then(resp => JSON.parse(resp));
	}


	urlToJobSummaries(query = "", page = 0) {
		return query.length > 0 ?
			`${API_PREFIX}/v1/jobs?query=${query}&page=${page}` :
			`${API_PREFIX}/v1/jobs?page=${page}`;
	}

  fetchJobSummaries(query = "", page = 0) {
  	return this.http
			.get(this.urlToJobSummaries(query, page))
			.then(resp => JSON.parse(resp));
  }


  urlToSubmitJobRequest() {
  	return `${API_PREFIX}/v1/jobs`;
	}

  submitJobRequest(jobRequest) {
    return this.http
			.post(this.urlToSubmitJobRequest(), jobRequest)
			.then(resp => JSON.parse(resp));
  }


  urlToGetJobDetailsById(jobId) {
  	return `${API_PREFIX}/v1/jobs/${jobId}`;
	}

  fetchJobDetailsById(jobId) {
    return this.http
			.get(this.urlToGetJobDetailsById(jobId))
			.then(resp => JSON.parse(resp));
  }


  urlToGetJobStderr(jobId) {
  	return `${API_PREFIX}/v1/jobs/${jobId}/stderr`;
	}

  fetchJobStderr(jobId) {
    return this.http.getRaw(this.urlToGetJobStderr(jobId));
  }


  urlToGetJobStdout(jobId) {
  	return `${API_PREFIX}/v1/jobs/${jobId}/stdout`;
	}

  fetchJobStdout(jobId) {
    return this.http.getRaw(this.urlToGetJobStdout(jobId));
  }


  postEmptyRequestToHref(href) {
    return this.http.post(`${API_PREFIX}/${href}`);
  }


  urlToGetJobOutputs(jobId) {
  	return `${API_PREFIX}/v1/jobs/${jobId}/outputs`;
	}

  fetchJobOutputs(jobId) {
  	return this.http
			.get(this.urlToGetJobOutputs(jobId))
			.then(resp => JSON.parse(resp).entries);
	}


	urlToGetJobInputs(jobId) {
		return `${API_PREFIX}/v1/jobs/${jobId}/inputs`;
	}

	fetchJobInputs(jobId) {
  	return this.http
			.get(this.urlToGetJobInputs(jobId))
			.then(resp => JSON.parse(resp));
	}


	urlToCurrentUser() {
		return `${API_PREFIX}/v1/users/current`;
	}

	fetchCurrentUser() {
  	return this.http
			.get(this.urlToCurrentUser())
			.then(resp => JSON.parse(resp).id);
	}


	// WebSockets:


	onJobStderrUpdate(jobId) {
		const url = Helpers.makeWebsocketPath(`${API_PREFIX}/v1/jobs/${jobId}/stderr/updates`);
		return Helpers.createObservableSocket(url).map(e => e.data);
	}

	onJobStdoutUpdate(jobId) {
		const url = Helpers.makeWebsocketPath(`${API_PREFIX}/v1/jobs/${jobId}/stdout/updates`);
		return Helpers.createObservableSocket(url).map(e => e.data);
	}

	onAllJobStatusChanges() {
		const url = Helpers.makeWebsocketPath(`${API_PREFIX}/v1/jobs/events`);
		return Helpers.createObservableSocket(url).map(e => JSON.parse(e.data));
	}
}
