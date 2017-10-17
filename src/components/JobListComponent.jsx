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
import {Helpers} from "../Helpers";

export class JobListComponent extends React.Component {

	constructor(props) {
		super(props);

		const params = Helpers.extractParams(props.routeProps.location.search);
		params.page = params.page || 0;
		params.query = params.query || "";

		this.state = {
			loading: true,
			currentQuery: params.query,
			queryInInputBar: params.query,
			pageNum: params.page,
			jobSummaries: [],
		};
	}

	componentWillMount() {
		this.updateSubscription = this.props.api
			.onAllJobStatusChanges()
			.subscribe(() => this.updateJobList());

		this.updateJobList();
	}

	componentWillReceiveProps(newProps) {
		const params = Helpers.extractParams(newProps.routeProps.location.search);
		params.page = params.page || 0;
		params.query = params.query || "";

		if (params.page != this.state.pageNum ||
		    params.query != this.state.currentQuery) {

			this.setState({
				pageNum: params.page,
				currentQuery: params.query,
				queryInInputBar: params.query
			}, () => this.updateJobList());
		}
	}

	updateJobList() {
		this.setState({loading: true}, () => {
			this.props.api
				.fetchJobSummaries(this.state.currentQuery, this.state.pageNum)
				.then(page => {
					this.setState({loading: false, jobSummaries: page.entries});
				});
		});
	}

	generateJobActions(jobSummary) {
		const self = this;

		return Object.keys(jobSummary._links)
			.map((linkName, i) => {
				switch (linkName) {
					case "abort":
						const href = jobSummary._links[linkName].href;
						return (
							<button key={i}
											onClick={() => self.props.api.postEmptyRequestToHref(href)}>
								abort
							</button>
						);
					default:
						return null;
				}
			})
			.filter(el => el !== null);
	}

	getLatestStatus(timestamps) {
		return timestamps[timestamps.length - 1].status;
	}

	renderJobSummary(jobSummary, i) {
		return (
			<tr key={i}>
				<td>
					<Link to={"/jobs/" + jobSummary.id}>
						{jobSummary.id}
					</Link>
				</td>
				<td>{jobSummary.owner}</td>
				<td>{jobSummary.name}</td>
				<td>{this.getLatestStatus(jobSummary.timestamps)}</td>
				<td>
					{this.generateJobActions.bind(this)(jobSummary)}
				</td>
			</tr>
		);
	}

	onSearchChange(e) {
		this.setState({ queryInInputBar: e.target.value });
	}

	onSearchKeyUp(e) {
		if (e.key === "Enter") {
			this.props.routeProps.history.push(`jobs?page=${this.state.pageNum}&query=${this.state.queryInInputBar}`);
		}
	}

	onClickedNextPage() {
		this.props.routeProps.history.push(`jobs?page=${this.state.pageNum + 1}&query=${this.state.currentQuery}`);
	}

	onClickedPreviousPage() {
		this.props.routeProps.history.push(`jobs?page=${this.state.pageNum - 1}&query=${this.state.currentQuery}`);
	}

	renderJobSummaries() {
		const renderJobSummary = this.renderJobSummary.bind(this);

		if (this.state.jobSummaries.length > 0) {
			return (
				<div>
					<table>
						<thead>
						<tr>
							<th>ID</th>
							<th>Owner</th>
							<th>Name</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
						</thead>

						<tbody>
						{this.state.jobSummaries.map(renderJobSummary)}
						</tbody>
					</table>

					<button className="btn-default"
									disabled={this.state.pageNum === 0}
									onClick={this.onClickedPreviousPage.bind(this)}>
						Newer Jobs
					</button>
					<button className="btn-default"
									onClick={this.onClickedNextPage.bind(this)}>
						Older Jobs
					</button>
				</div>
			)
		} else {
			return <div className="missing-banner">No jobs found</div>;
		}
	}

	render() {
		return (
			<div id="jobs-list">
				<input type="text"
							 id="jobs-search"
							 placeholder="Search jobs..."
							 onChange={this.onSearchChange.bind(this)}
							 onKeyUp={this.onSearchKeyUp.bind(this)}
							 value={this.state.queryInInputBar}
							 autoFocus />

				{this.renderJobSummaries()}

				{this.state.loading ? <span>Loading...</span> : null}
			</div>
		);
	}

	componentWillUnmount() {
		if (this.updateSubscription)
			this.updateSubscription.unsubscribe();
	}
}
