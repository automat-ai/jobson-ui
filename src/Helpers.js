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

import React from "react";
import { Subject } from "rxjs";

export class Helpers {

	static promptUserToDownloadAsJSON(obj) {
		const objJSON = JSON.stringify(obj, null, 2);
		const blob = new Blob([objJSON], {type: "application/json"});
		Helpers.promptUserToDownload(blob, "query.json");
	}

	static promptUserToDownload(blob, fileName) {
		// If it's shitty IE
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, fileName);
		} else {
			const blobUrl = URL.createObjectURL(blob);

			const downloadLink = document.createElement("a");
			downloadLink.href = blobUrl;
			downloadLink.download = fileName;
			downloadLink.visibility = "hidden";

			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
	}

	static extractParams(search) {
		if (!search) return {};

		var pairs = search.substring(1).split("&"),
			obj = {},
			pair,
			i;

		for (i in pairs) {
			if (pairs[i] === "") continue;

			pair = pairs[i].split("=");
			obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}

		return obj;
	}

	static promptUserForFiles(mimeTypes = "", allowMultipleFiles = true) {

		return new Promise((resolve, reject) => {
			const fileInputEl = document.createElement("input");

			if (allowMultipleFiles)
				fileInputEl.multiple = true;

			fileInputEl.style.visibility = "hidden";
			fileInputEl.type = "file";
			fileInputEl.accept = mimeTypes;

			const onBodyFocus = () => {
				fileInputEl.removeEventListener("change", onChange);

				reject("User cancelled out of dialog");
			};

			const onChange = () => {
				document.removeEventListener("focus", onBodyFocus);

				if (fileInputEl.files !== null && fileInputEl.files.length === 1)
					resolve(fileInputEl.files);
				else reject("User did not select a file");
			};

			fileInputEl.addEventListener("change", onChange, false);
			document.addEventListener("focus", onBodyFocus, false);

			// Otherwise, the click will propagate upto the root click
			// handler and angular will cry
			fileInputEl.onclick = (e) => e.stopPropagation();

			document.body.appendChild(fileInputEl);

			fileInputEl.click();

			document.body.removeChild(fileInputEl);
		});
	}

	static createObservableSocket(url) {
		const ws = new WebSocket(url);

		const subject = new Subject();

		ws.onmessage = (e) => subject.next(e);
		ws.onclose = (e) => subject.complete();
		ws.onerror = (e) => subject.error(e);

		return subject;
	}

	static promptUserForFile(mimeTypes = "") {
		return Helpers.promptUserForFiles(mimeTypes, false).then(files => files[0]);
	}

	static readFileAsText(file) {
		return new Promise((resolve, reject) => {
			const textReader = new FileReader();
			textReader.onload = (e) => resolve(textReader.result);
			textReader.onerror = (e) => reject(textReader.error);
			textReader.readAsText(file);
		});
	}

	static dissasoc(o, k) {
		const copy = Object.assign({}, o);
		delete copy[k];
		return copy;
	}

	static fetchBlobContentsAsText(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.readAsText(blob);
		});
	}

	static reject(a, el) {
		const i = a.indexOf(el);
		return a.filter((e, j) => j !== i);
	}

	static makeWebsocketPath(p) {
		const scheme = window.location.protocol.startsWith("https") ? "wss" : "ws";
		const prefix = `${scheme}://${window.location.host}`;

		if (p.startsWith("/")) {
			return prefix + p;
		} else if (window.location.pathname.endsWith("/")) {
			return prefix + window.location.pathname + p;
		} else {
			return prefix + window.location.pathname + "/" + p;
		}
	}

	static renderStatusField(status) {
		switch (status) {
			case "aborted":
				return <div className="ui orange horizontal basic label">{status}</div>;
			case "fatal-error":
				return <div className="ui red horizontal basic label">{status}</div>;
			case "finished":
				return <div className="ui green horizontal basic label">{status}</div>;
			case "running":
				return <div className="ui horizontal basic label">
					<div className="ui tiny active inline loader"></div> Running
				</div>;
			default:
				return <div className="ui horizontal basic label">{status}</div>;
		}
	}

	static renderDownloadButton(href) {
		return (
			<a className="ui right floated primary button"
				 href={href}>
				<i className="download icon"></i>
				Download
			</a>
		);
	}

	static jobStatusColor(jobStatus) {
		switch (jobStatus) {
			case "submitted":
				return "grey";
			case "fatal-error":
				return "red";
			case "finished":
				return "green";
			case "running":
				return "grey";
			case "aborted":
				return "orange";
			default:
				return "grey";
		}
	}

	static renderLoadingMessage(noun) {
		return (
			<div className="ui icon message">
				<i className="notched circle loading icon"></i>
				<div className="content">
					<div className="header">
						Loading
					</div>
					<p>
						Fetching {noun} from the Jobson API.
					</p>
				</div>
			</div>
		);
	}

	static renderErrorMessage(noun, apiError, retryCallback) {
		return (
			<div className="ui negative icon message">
				<i className="warning circle icon"></i>
				<div className="content">
					<div className="header">
						Error loading {noun}
					</div>
					<p>
						There was an error loading {noun} from the Jobson API.
						The API's error message was: {apiError.message}.
					</p>
					<button className="ui primary icon button"
									onClick={retryCallback}>
						<i className="refresh icon"></i>
						Try Again
					</button>
				</div>
			</div>
		);
	}
}

