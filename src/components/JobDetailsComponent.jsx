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
import {StdioComponent} from "./StdioComponent";
import {Link} from "react-router-dom";

export class JobDetailsComponent extends React.Component {

	constructor() {
		super();
		this.state = {
			jobLoaded: false,
			job: null,
			outputsLoaded: false,
			outputs: null,
		};
	}

	updateUi() {
		this.props.api
			.fetchJobDetailsById(this.props.params.id)
			.then(job => {
				this.setState({jobLoaded: true, job: job});
			})
			.then(() => this.props.api.fetchJobOutputs(this.props.params.id))
			.then(outputs => {
				this.setState({outputsLoaded: true, outputs: outputs});
			})
	}

	componentWillMount() {
		this.updateUi();

		this.updateSubscription = this.props.api
			.onAllJobStatusChanges()
			.subscribe(() => this.updateUi());
	}

	renderStatusChange(statusChange, i) {
		return (
			<li key={i}>
				{statusChange.time} - {statusChange.status} - {statusChange.message}
			</li>
		);
	}

	getLatestStatus() {
		return this.state.job.timestamps[this.state.job.timestamps.length - 1].status;
	}

	renderJobOutput(jobOutput, key) {
		return (
			<li key={key}>
				<a href={API_PREFIX + jobOutput.href}>{key}</a>
			</li>
		);
	}

	renderOutputs() {
		return Object
			.keys(this.state.outputs)
			.map(k => this.renderJobOutput(this.state.outputs[k], k));
	}

	render() {
		return this.state.jobLoaded ?
			(
				<div id="job-details">
					<h1><Link to="/jobs">jobs</Link> / {this.state.job.id}</h1>
					<div>
						<span className="prop-name">
							Created by
						</span>
						<span className="prop-value">
							{this.state.job.owner}
						</span>

						<span className="prop-name">
							Name
						</span>
						<span className="prop-value">
							{this.state.job.name}
						</span>

						<span className="prop-name">
							Status
						</span>
						<span className="prop-value">
							{this.getLatestStatus()}
						</span>
					</div>

					<ul>
						{this.state.job.timestamps.map(this.renderStatusChange)}
					</ul>

					<h2>Outputs</h2>
					<ul>
						{this.state.outputsLoaded ? this.renderOutputs() : null }
					</ul>

					<h2>Stdout</h2>
					<StdioComponent
						fetchStdio={() => this.props.api.fetchJobStdout(this.state.job.id)}
						onStdioUpdate={() => this.props.api.onJobStdoutUpdate(this.state.job.id)}/>

					<h2>Stderr</h2>
					<StdioComponent
						fetchStdio={() => this.props.api.fetchJobStderr(this.state.job.id)}
						onStdioUpdate={() => this.props.api.onJobStderrUpdate(this.state.job.id)}/>
				</div>
			) :
			(
				<h1>{this.props.params.id} not loaded</h1>
			);
	}

	componentWillUnmount() {
		this.updateSubscription.unsubscribe();
	}
}
