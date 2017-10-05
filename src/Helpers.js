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

	static extractWindowURIParams() {
		var pairs = window.location.search.substring(1).split("&"),
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

	static setUnion(a, b) {
		var union = new Set(a);
		for (var elem of b) {
			union.add(elem);
		}
		return union;
	}

	static setDifference(a, b) {
		var difference = new Set(a);
		for (var elem of b) {
			difference.delete(elem);
		}
		return difference;
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
}

