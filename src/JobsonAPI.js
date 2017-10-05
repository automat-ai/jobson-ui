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

import { Subject } from "rxjs";

export class JobsonAPI {

  constructor(httpService) {
    this.http = httpService;
  }

  fetchJobSpecSummaries() {
    return this.http.get("/api/v1/specs").then(resp => JSON.parse(resp).entries);
  }

  fetchJobSummaries(query = "", page = 0) {
    if (query.length > 0) {
      return this.http.get(`/api/v1/jobs?query=${query}&page=${page}`).then(resp => JSON.parse(resp));
    } else {
      return this.http.get(`/api/v1/jobs?page=${page}`).then(resp => JSON.parse(resp));
    }
  }

  fetchJobSpec(id) {
    return this.http.get(`/api/v1/specs/${id}`).then(resp => JSON.parse(resp));
  }

  submitJobRequest(jobRequest) {
    return this.http.post("/api/v1/jobs", jobRequest).then(resp => JSON.parse(resp));
  }

  createObservableSocket(url) {
    const ws = new WebSocket(url);

    const subject = new Subject();

    ws.onmessage = (e) => subject.next(e);
    ws.onclose = (e) => subject.complete();
    ws.onerror = (e) => subject.error(e);

    return subject;
  }

  onAllJobStatusChanges() {
    const url = "ws://" + window.location.host + "/api/v1/jobs/events";
    return this.createObservableSocket(url).map(e => JSON.parse(e.data));
  }

  fetchJobDetailsById(jobId) {
    return this.http.get(`/api/v1/jobs/${jobId}`).then(resp => JSON.parse(resp));
  }

  fetchJobStderr(jobId) {
    return this.http.getRaw(`/api/v1/jobs/${jobId}/stderr`);
  }

  fetchJobStdout(jobId) {
    return this.http.getRaw(`/api/v1/jobs/${jobId}/stdout`);
  }

  onJobStderrUpdate(jobId) {
    const url = "ws://" + window.location.host + `/api/v1/jobs/${jobId}/stderr/updates`;
    return this.createObservableSocket(url).map(e => e.data);
  }

  onJobStdoutUpdate(jobId) {
    const url = "ws://" + window.location.host + `/api/v1/jobs/${jobId}/stdout/updates`;
    return this.createObservableSocket(url).map(e => e.data);
  }

  postEmptyRequestToHref(href) {
    return this.http.post(`/api/${href}`);
  }
}
