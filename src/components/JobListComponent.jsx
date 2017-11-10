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
		params.page = parseInt(params.page || 0);
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
		params.page = parseInt(params.page || 0);
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
				<td className="center aligned">
					<Link to={"/jobs/" + jobSummary.id}>
						<code>{jobSummary.id}</code>
					</Link>
				</td>
				<td className="center aligned">{jobSummary.owner}</td>
				<td className="center aligned">{jobSummary.name}</td>
				<td className="center aligned">{this.getLatestStatus(jobSummary.timestamps)}</td>
				<td className="center aligned">
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
			if (this.state.queryInInputBar !== this.state.currentQuery) {
				this.pushHistory(this.state.pageNum, this.state.queryInInputBar);
			}
		}
	}

	pushHistory(page, query) {
		this.props.routeProps.history.push(
			this.constructPath(page,query));
	}

	constructPath(page, query) {
		const start = "jobs";
		const rest = [];

		if (page > 0) rest.push(`page=${page}`);
		if (query.length > 0) rest.push(`query=${query}`);

		return rest.length === 0 ? start : start + "?" + rest.join("&");
	}

	onClickedNextPage() {
		this.pushHistory(this.state.pageNum + 1, this.state.currentQuery);
	}

	onClickedPreviousPage() {
		this.pushHistory(this.state.pageNum - 1, this.state.currentQuery);
	}

	userHasNoJobs() {
		return !this.state.loading &&
			this.state.jobSummaries.length === 0 &&
			this.state.currentQuery.length === 0 &&
			this.state.pageNum === 0;
	}

	renderJobSummaries() {
		const renderJobSummary = this.renderJobSummary.bind(this);

		if (this.userHasNoJobs()) {
			return (
			<div className="ui info icon message">
				<i className="info circle icon"></i>
				<div className="content">
					<div className="header">
						No jobs yet!
					</div>
					<p>
						You don't seem to have any jobs yet
						, <Link className="ui primary button" to="/submit">
							Submit your first job
						</Link>
					</p>
				</div>
			</div>
			);
		} else if (this.state.jobSummaries.length === 0) {
			return (
				<div className="ui negative icon message">
					<i className="warning icon"></i>
					<div className="content">
						<div className="header">
							Your search returned no results
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<table className="ui very basic table">
						<thead>
						<tr>
							<th className="center aligned">ID</th>
							<th className="center aligned">Owner</th>
							<th className="center aligned">Name</th>
							<th className="center aligned">Status</th>
							<th className="center aligned">Actions</th>
						</tr>
						</thead>

						<tbody>
						{this.state.jobSummaries.map(renderJobSummary)}
						</tbody>
					</table>

					<div style={{textAlign: "center"}}>
						<button className="ui left attached button"
										disabled={this.state.pageNum === 0}
										onClick={this.onClickedPreviousPage.bind(this)}>
							Newer Jobs
						</button>
						<button className="ui right attached button"
										onClick={this.onClickedNextPage.bind(this)}>
							Older Jobs
						</button>
					</div>
				</div>
			);
		}
	}

	render() {
		return (
			<div>
				<div className="ui fluid left icon input" style={{ marginBottom: "2em" }}>
					<i className="search icon"></i>
					<input type="text"
								 id="jobs-search"
								 placeholder="Search jobs..."
								 onChange={this.onSearchChange.bind(this)}
								 onKeyUp={this.onSearchKeyUp.bind(this)}
								 value={this.state.queryInInputBar}
								 autoFocus
								 disabled={this.userHasNoJobs()} />
				</div>

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
