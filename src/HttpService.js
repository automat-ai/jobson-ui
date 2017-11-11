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

import {BehaviorSubject} from "rxjs";
import {Helpers} from "./Helpers";

export class HttpService {

	constructor() {
		this.onRequestsChanged = new BehaviorSubject([]);
	}

	dispatch(req, body = null) {
		return new Promise((resolve, reject) => {

			this.onRequestsChanged.next(
				this.onRequestsChanged.getValue().concat([req]));

			req.onload = () => {
				const oldReqs = this.onRequestsChanged.getValue();
				const newReqs = Helpers.reject(oldReqs, req);
				this.onRequestsChanged.next(newReqs);

				if (200 <= req.status && req.status < 300) {
					resolve(req.response);
				} else {
					try {
						reject(JSON.parse(req.response));
					} catch (e) {
						reject({
							code: req.status,
							message: "Error",
						});
					}
				}
			};

			req.onerror = () => {
				const oldReqs = this.onRequestsChanged.getValue();
				const newReqs = Helpers.reject(oldReqs, req);
				this.onRequestsChanged.next(newReqs);

				reject(req.response);
			};

			if (body !== null) req.send(body);
			else req.send();
		});
	}

  get(href) {
		const req = new XMLHttpRequest();
		req.open("GET", href);
		req.setRequestHeader("Accept", "application/json");

		return this.dispatch(req);
  }

  getRaw(href) {
		const req = new XMLHttpRequest();
		req.open("GET", href);
		req.responseType = "blob";

		return this.dispatch(req);
	}

  post(href, body) {
		const req = new XMLHttpRequest();
		req.open("POST", href);
		req.setRequestHeader("Content-Type", "application/json");
		req.setRequestHeader("Accept", "application/json");
		req.overrideMimeType("text/plain");

		return this.dispatch(req, JSON.stringify(body));
  }
}
