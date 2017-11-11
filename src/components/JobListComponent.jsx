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
			isLoadingJobs: true,
			jobLoadingError: null,
			activeQuery: params.query,
			enteredQuery: params.query,
			page: params.page,
			jobs: [],
			jobUpdatesSubscription: null,
		};
	}

	componentWillMount() {
		this.jobUpdatesSubscription = this.props.api
			.onAllJobStatusChanges()
			.subscribe(this.updateJobList.bind(this));

		this.updateJobList();
	}

	componentWillReceiveProps(newProps) {
		const params = Helpers.extractParams(newProps.routeProps.location.search);
		params.page = parseInt(params.page || 0);
		params.query = params.query || "";

		if (params.page != this.state.page ||
		    params.query != this.state.activeQuery) {

			this.setState({
				page: params.page,
				activeQuery: params.query,
				enteredQuery: params.query,
			}, this.updateJobList.bind(this));
		}
	}

	componentWillUnmount() {
		if (this.jobUpdatesSubscription !== null)
			this.jobUpdatesSubscription.unsubscribe();
	}

	updateJobList() {
		this.setState({isLoadingJobs: true}, () => {
			this.props.api
				.fetchJobSummaries(this.state.activeQuery, this.state.page)
				.then(page => {
					this.setState({isLoadingJobs: false, jobLoadingError: null, jobs: page.entries});
				})
				.catch(loadingError => {
					this.setState({isLoadingJobs: false, jobLoadingError: loadingError});
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
											onClick={() =>
												self.props.api.postEmptyRequestToHref(href)}>
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

	onSearchInputChange(e) {
		this.setState({ enteredQuery: e.target.value });
	}

	onSearchKeyUp(e) {
		if (e.key === "Enter") {
			if (this.state.enteredQuery !== this.state.activeQuery) {
				this.pushHistory(this.state.page, this.state.enteredQuery);
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

		return rest.length === 0 ?
			start :
			start + "?" + rest.join("&");
	}

	onClickedNextPage() {
		this.pushHistory(this.state.page + 1, this.state.activeQuery);
	}

	onClickedPreviousPage() {
		this.pushHistory(this.state.page - 1, this.state.activeQuery);
	}

	userHasNoJobs() {
		return !this.state.isLoadingJobs &&
			this.state.jobs.length === 0 &&
			this.state.activeQuery.length === 0 &&
			this.state.page === 0;
	}


	render() {
		return (
			<div>
				{this.renderSearchBar()}
				{this.renderMainArea()}
			</div>
		);
	}

	renderSearchBar() {
		return (
			<div className="ui fluid left icon input" style={{ marginBottom: "2em" }}>
				<i className="search icon"></i>
				<input type="text"
							 id="jobs-search"
							 placeholder="Search jobs..."
							 onChange={this.onSearchInputChange.bind(this)}
							 onKeyUp={this.onSearchKeyUp.bind(this)}
							 value={this.state.enteredQuery}
							 autoFocus
							 disabled={this.userHasNoJobs()} />
			</div>
		);
	}

	renderMainArea() {
		if (this.state.isLoadingJobs)
			return this.renderLoadingMessage();
		else if (this.state.jobLoadingError !== null)
		  return this.renderLoadingErrorMessage();
		else if (this.userHasNoJobs())
			return this.renderUserHasNoJobsMessage();
		else if (this.state.jobs.length === 0)
			return this.renderNoResultsMessage();
		else
			return this.renderJobSummaries();
	}

	renderLoadingMessage() {
		return (
			<div className="ui icon message">
				<i className="notched circle loading icon"></i>
				<div className="content">
					<div className="header">
						Loading
					</div>
					<p>Fetching jobs from the Jobson API</p>
				</div>
			</div>
		);
	}

	renderLoadingErrorMessage() {
		return (
			<div className="ui negative icon message">
				<i className="warning circle icon"></i>
				<div className="content">
					<div className="header">
						Error Loading Jobs
					</div>
					<p>
						There was an error loading jobs from the Jobson API.
						The error message is: {this.state.jobLoadingError.message}.
					</p>
					<button className="ui primary icon button"
					        onClick={this.updateJobList.bind(this)}>
						<i className="refresh icon"></i>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	renderUserHasNoJobsMessage() {
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
	}

	renderNoResultsMessage() {
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
	}

	renderJobSummaries() {
		const renderJobSummary = this.renderJobSummary.bind(this);

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
					{this.state.jobs.map(renderJobSummary)}
					</tbody>
				</table>

				<div style={{textAlign: "center"}}>
					<button className="ui left attached button"
									disabled={this.state.page === 0}
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

	renderJobSummary(jobSummary, i) {
		return (
			<tr key={i}>
				<td className="center aligned">
					<Link to={"/jobs/" + jobSummary.id}>
						<code>{jobSummary.id}</code>
					</Link>
				</td>
				<td className="center aligned">
					{jobSummary.owner}
				</td>
				<td className="center aligned">
					{jobSummary.name}
				</td>
				<td className="center aligned">
					{this.getLatestStatus(jobSummary.timestamps)}
				</td>
				<td className="center aligned">
					{this.generateJobActions.bind(this)(jobSummary)}
				</td>
			</tr>
		);
	}
}
