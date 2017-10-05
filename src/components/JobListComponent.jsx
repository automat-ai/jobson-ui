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

	constructor() {
		super();

		this.state = {
			loading: true,
			jobSummaries: [],
			query: "",
			page: 0,
		};
	}

	componentWillMount() {
		const pageParams = Helpers.extractWindowURIParams();
		const query = pageParams.query || "";
		const page = parseInt(pageParams.page) || 0;

		const setup = () => {
			this.updateSubscription = this.props.api
				.onAllJobStatusChanges()
				.subscribe(update => {
					this.updateJobList();
				});

			this.updateJobList();
		};

		this.setState({page: page, query: query}, setup);
	}

	updateJobList() {
		const newQuery = `?page=${this.state.page}&query=${encodeURIComponent(this.state.query)}`;
		const newLocation = window.location.href.split("?")[0] + newQuery;

		if (newQuery !== window.location.search) {
			window.history.pushState({}, null, newLocation);
		}

		this.setState({loading: true}, () => {
			this.props.api
				.fetchJobSummaries(this.state.query, this.state.page)
				.then(page => {
					this.setState({loading: false, jobSummaries: page.entries});
				});
		});
	}

	generateJobActions(jobSummary) {
		const actionNames = ["abort"];
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

	renderJobSummary(jobSummary, i) {
		return (
			<tr key={i}>
				<td>
					<Link to={"/jobs/" + jobSummary.id}>
						{jobSummary.id}
					</Link>
				</td>
				<td>{jobSummary.owner.id}</td>
				<td>{jobSummary.description}</td>
				<td>{jobSummary.status}</td>
				<td>
					{this.generateJobActions.bind(this)(jobSummary)}
				</td>
			</tr>
		);
	}

	onSearchChange(e) {
		this.setState({query: e.target.value});
	}

	onSearchKeyUp(e) {
		if (e.key === "Enter") {
			this.setState({ page: 0 }, () => this.updateJobList());
		}
	}

	onClickedNextPage() {
		this.setState((oldState) =>{
			return { page: oldState.page + 1};
		}, () => this.updateJobList());
	}

	onClickedPreviousPage() {
		this.setState(oldState => {
			if (oldState.page > 0)
				return {page: oldState.page - 1};
		}, () => this.updateJobList());
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
							<th>Description</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
						</thead>

						<tbody>
						{this.state.jobSummaries.map(renderJobSummary)}
						</tbody>
					</table>

					<button className="btn-default"
									disabled={this.state.page == 0}
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
			<div id="jobs-list" ref={(el) => {
				this.el = el
			} }>
				<input type="text"
							 id="jobs-search"
							 placeholder="Search jobs..."
							 onChange={this.onSearchChange.bind(this)}
							 onKeyUp={this.onSearchKeyUp.bind(this)}
							 value={this.state.query}
							 autoFocus />

				{this.renderJobSummaries()}

				{this.state.loading ? <span>Loading...</span> : null}
			</div>
		);
	}

	componentWillUnmount() {
		this.updateSubscription.unsubscribe();
	}
}
