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
import {StdioComponent} from "./StdioComponent"
import {Helpers} from "../Helpers";

export class JobOutputsComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			jobOutputs: null,
			jobOutputsLoaded: false,
		};
	}

	componentWillMount() {
		this.props.api
			.fetchJobOutputs(this.props.jobId)
			.then(jobOutputs => {
				this.setState({ jobOutputs: jobOutputs, jobOutputsLoaded: true });
			});
	}

	render() {

		if (this.state.jobOutputsLoaded) {
			return (
				<div>
					{this.state.jobOutputsLoaded ? this.renderFileOutputs() : null }
					{this.renderStdioComponent(
						"stdout",
						() => this.props.api.fetchJobStdout(this.props.jobId),
						() => this.props.api.onJobStdoutUpdate(this.props.jobId))}
					{this.renderStdioComponent(
						"stderr",
						() => this.props.api.fetchJobStderr(this.props.jobId),
						() => this.props.api.onJobStderrUpdate(this.props.jobId))}
				</div>
			);
		} else {
			return <div>Loading job outputs</div>;
		}
	}

	renderFileOutputs() {
		return Object
			.keys(this.state.jobOutputs)
			.map(k => this.renderJobOutput(this.state.jobOutputs[k], k));
	}

	renderJobOutput(jobOutput, key) {
		return this.renderJobOutputComplete(key, API_PREFIX + jobOutput.href, null);
	}

	renderStdioComponent(title, fetchStdio, onStdioUpdate) {
		const viewer = <StdioComponent fetchStdio={fetchStdio} onStdioUpdate={onStdioUpdate} />;
		return this.renderJobOutputComplete(title, API_PREFIX, viewer);
	}

	renderJobOutputComplete(title, downloadHref, viewer) {
		return (
			<div className="ui grid jobson-condensed-grid">
				<div className="twelve wide column">
					<h3 className="header">
						{title}
					</h3>
				</div>

				<div className="four wide column">
					<div className="ui right floated">
						{Helpers.renderDownloadButton(downloadHref)}
					</div>
				</div>

				<div className="sixteen wide column">
					{viewer}
				</div>
			</div>
		);
	}
}
