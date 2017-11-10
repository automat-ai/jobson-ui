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
import Timestamp from "react-timestamp";

export class JobDetailsComponent extends React.Component {

	constructor() {
		super();
		this.state = {
			jobLoaded: false,
			showMoreDetails: false,
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
			<div className="item" key={i}>
				<div className="content">
					<div className="header">
						{statusChange.message}
					</div>
					<div className="description">
						Status changed to {statusChange.status}&nbsp;
						<Timestamp time={statusChange.time} format='ago' />
					</div>
				</div>
			</div>
		);
	}

	getLatestStatus() {
		return this.state.job.timestamps[this.state.job.timestamps.length - 1];
	}

	renderJobOutput(jobOutput, key) {
		return (
		<div className="item" key={key}>
			<div className="content">
				<div className="header">
					{key}
				</div>
				<div className="description">
					<a className="ui primary button"
						 href={API_PREFIX + jobOutput.href}>
						<i className="download icon"></i>
						Download
					</a>
				</div>
			</div>
		</div>
		);
	}

	renderOutputs() {
		return Object
			.keys(this.state.outputs)
			.map(k => this.renderJobOutput(this.state.outputs[k], k));
	}

	renderEvents() {
		return (
			<div>
				<h4>Events</h4>
				<div className="ui relaxed divided list">
					{this.state.job.timestamps.map(this.renderStatusChange)}
				</div>
			</div>
		);
	}

	toggleDetails() {
		this.setState({showMoreDetails: !this.state.showMoreDetails});
	}

	render() {
		return this.state.jobLoaded ?
			(
				<div>
					<div className="segment">
						<div className="ui breadcrumb">
							<Link to="/jobs" className="section">jobs</Link>
							<div className="divider">/</div>
							<div className="active section">
								<h1>{this.state.job.id}</h1>
							</div>
						</div>
					</div>

					<div className="ui segment">

						<div className="ui horizontal list">

							<div className="item">
								<div className="content">
									<div className="header">
										Job Name
									</div>
									{this.state.job.name}
								</div>
							</div>

							<div className="item">
								<div className="content">
									<div className="header">
										Created by
									</div>
									{this.state.job.owner}
								</div>
							</div>

							<div className="item">
								<div className="content">
									<div className="header">
										Latest Status Change
									</div>
									{this.getLatestStatus().status} (<Timestamp time={this.getLatestStatus().time} format='ago' />), <a onClick={this.toggleDetails.bind(this)}>
										{this.state.showMoreDetails ? "hide" : "show" } events
									</a>
								</div>
							</div>

						</div>
					</div>

					{this.state.showMoreDetails ? this.renderEvents() : null}

					<h2 className="ui dividing header">
						Outputs
					</h2>

					<div className="ui relaxed divided list">
						{this.state.outputsLoaded ? this.renderOutputs() : null }

						<div className="item">
							<div className="content">
								<div className="header">
									stdout
								</div>
								<div className="description">
									<StdioComponent
										fetchStdio={() => this.props.api.fetchJobStdout(this.state.job.id)}
										onStdioUpdate={() => this.props.api.onJobStdoutUpdate(this.state.job.id)}/>
								</div>
							</div>
						</div>

						<div className="item">
							<div className="content">
								<div className="header">
									stderr
								</div>
								<div className="description">
									<StdioComponent
										fetchStdio={() => this.props.api.fetchJobStderr(this.state.job.id)}
										onStdioUpdate={() => this.props.api.onJobStderrUpdate(this.state.job.id)}/>
								</div>
							</div>
						</div>
					</div>
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
