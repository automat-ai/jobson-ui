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

import {Link} from "react-router-dom";
import Timestamp from "react-timestamp";
import {Helpers} from "../Helpers";
import {JobOutputsComponent} from "./JobOutputsComponent";
import {JobEventsComponent} from "./JobEventsComponent";
import {JobInputsComponent} from "./JobInputsComponent";

export class JobDetailsComponent extends React.Component {

	constructor() {
		super();

		this.updateSubscription = null;

		this.state = {
			isLoadingJob: true,
			loadingError: null,
			job: null,
			activeTab: "Outputs",
			jobChangesSubject: null,
		};
	}

	componentWillMount() {
		this.updateUi();

		const jobChangesSubject =
			this.props.api.onAllJobStatusChanges();

		this.setState({jobChangesSubject});

		this.updateSubscription =
			jobChangesSubject.subscribe(this.updateUi.bind(this));
	}

	updateUi() {
		this.props.api
			.fetchJobDetailsById(this.props.params.id)
			.then(job => {
				this.setState({
					isLoadingJob: false,
					loadingError: null,
					job: job
				});
			})
			.catch(apiError => {
				this.setState({
					isLoadingJob: false,
					loadingError: apiError,
					job: null,
				});
			});
	}

	componentWillUnmount() {
		if (this.updateSubscription !== null)
			this.updateSubscription.unsubscribe();
	}

	render() {
		return (
			<div>
				{this.renderHeader()}
				{this.tryRenderMain()}
			</div>
		);
	}

	renderHeader() {
		return (
			<div className="segment">
				<div className="ui breadcrumb">
					<Link to="/jobs" className="section">
						jobs
					</Link>
					<div className="divider">
						/
					</div>
					<div className="active section">
						<h1>
							{this.props.params.id}
						</h1>
					</div>
				</div>
			</div>
		);
	}

	tryRenderMain() {
		if (this.state.isLoadingJob)
			return this.renderJobLoadingMessage();
		else if (this.state.loadingError !== null)
			return this.renderErrorMessage();
		else
			return this.renderJobDetailsUi();
	}

	renderJobLoadingMessage() {
		return Helpers.renderLoadingMessage("job details");
	}

	renderErrorMessage() {
		return Helpers.renderErrorMessage(
			"job details",
			this.state.loadingError,
			this.updateUi.bind(this));
	}

	renderJobDetailsUi() {
		return (
			<div>
				<div className="ui segment">
					<div className="ui horizontal list">
						{Object
							.keys(this.detailHeaders)
							.map(k => this.renderDetailHeader(
								k,
								this.detailHeaders[k]))}

					</div>
				</div>

				<div className="ui top tabular menu">
					{this.renderTabHeaders()}
				</div>

				<div style={{marginBottom: "2em"}}>
					{this.tabs[this.state.activeTab].call()}
				</div>
			</div>
		);
	}


	get detailHeaders() {
		return {
			"Job Name": () => this.state.job.name,
			"Created by": () => this.state.job.owner,
			"Submitted": () => {
				return <Timestamp time={this.state.job.timestamps[0].time} format='ago' />;
			},
			"Latest Status": () => {
				return (
					<div>
						{Helpers.renderStatusField(this.getLatestStatus().status)}
						(<Timestamp time={this.getLatestStatus().time} format='ago' />)
					</div>
				);
			},
		};
	}

	getLatestStatus() {
		return this.state.job.timestamps[this.state.job.timestamps.length - 1];
	}

	renderDetailHeader(header, renderer) {
		return (
			<div className="item" key={header}>
				<div className="content">
					<div className="header">
						{header}
					</div>
					{renderer.call(this)}
				</div>
			</div>
		);
	}

	get tabs() {
		return {
			"Inputs": () => {
				return (
					<JobInputsComponent jobId={this.props.params.id}
															api={this.props.api} />
				);
			},
			"Outputs": () => {
				return (
					<JobOutputsComponent jobChangesSubject={this.state.jobChangesSubject}
															 jobId={this.props.params.id}
															 api={this.props.api} />
				);
			},
			"Events": () => {
				return (
					<JobEventsComponent timestamps={this.state.job.timestamps} />
				);
			},
		};
	}

	renderTabHeaders() {
		return Object.keys(this.tabs).map(header => {
			if (header === this.state.activeTab) {
				return (
					<a className="item active" key={header}>
						{header}
					</a>
				);
			} else {
				return (
					<a className="item"
						 key={header}
						 onClick={this.setActiveTab.bind(this, header)}>
						{header}
					</a>
				);
			}
		});
	}

	setActiveTab(activeTab) {
		this.setState({activeTab});
	}
}
