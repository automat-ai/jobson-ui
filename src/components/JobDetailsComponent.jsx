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

		this.tabs = {
			"Inputs": () => {
				return <JobInputsComponent jobId={this.props.params.id}
																	 api={this.props.api} />;
			},
			"Outputs": () => {
				return (
					<JobOutputsComponent jobId={this.props.params.id}
															 api={this.props.api} />
				);
			},
			"Events": () => {
				return <JobEventsComponent timestamps={this.state.job.timestamps}/>;
			},
		};

		this.detailHeaders = {
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

		this.state = {
			jobLoaded: false,
			job: null,
			activeTab: "Outputs",
		};
	}

	componentWillMount() {
		this.updateUi();

		this.updateSubscription = this.props.api
			.onAllJobStatusChanges()
			.subscribe(() => this.updateUi());
	}

	updateUi() {
		this.props.api
			.fetchJobDetailsById(this.props.params.id)
			.then(job => {
				this.setState({jobLoaded: true, job: job});
			});
	}

	componentWillUnmount() {
		this.updateSubscription.unsubscribe();
	}


	getLatestStatus() {
		return this.state.job.timestamps[this.state.job.timestamps.length - 1];
	}

	renderTabHeaders() {
		return Object.keys(this.tabs).map(header => {
			if (header === this.state.activeTab) {
				return <a className="item active">
					{header}
				</a>;
			} else {
				return <a className="item" onClick={this.setActiveTab.bind(this, header)}>
					{header}
				</a>;
			}
		});
	}

	setActiveTab(activeTab) {
		this.setState({activeTab});
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

							{Object.keys(this.detailHeaders).map(k => this.renderDetailHeader(k, this.detailHeaders[k]))}

						</div>
					</div>

					<div className="ui top tabular menu">
						{this.renderTabHeaders()}
					</div>

					<div style={{marginBottom: "2em"}}>
						{this.tabs[this.state.activeTab].call()}
					</div>



				</div>
			) :
			(
				<h1>{this.props.params.id} not loaded</h1>
			);
	}

	renderDetailHeader(header, renderer) {
		return (
			<div className="item">
				<div className="content">
					<div className="header">
						{header}
					</div>
					{renderer.call(this)}
				</div>
			</div>
		);
	}
}
