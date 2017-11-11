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
import {Helpers} from "../Helpers";
import {SubmissionBuilderComponent} from "./SubmissionBuilderComponent";

export class SubmitJobComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoadingJobSpecSummaries: true,
			loadingError: null,
			jobSpecSummaries: null,
			selectedSpecId: undefined,
		};
	}

	componentWillMount() {
		this.loadJobSpecSummaries();
	}

	loadJobSpecSummaries() {
		const params =
			Helpers.extractParams(this.props.routeProps.location.search);

		this.props.api.fetchJobSpecSummaries()
			.then(jobSpecSummaries => {
				this.setState({
					isLoadingJobSpecSummaries: false,
					loadingError: null,
					jobSpecSummaries: jobSpecSummaries,
					selectedSpecId: params.spec || undefined,
				});
			})
			.catch(apiError => {
				this.setState({
					isLoadingJobSpecSummaries: false,
					loadingError: apiError,
					jobSpecSummaries: null,
					selectedSpecId: undefined,
				});
			});
	}

	render() {
		if (this.state.isLoadingJobSpecSummaries)
			return this.renderLoadingMessage();
		else if (this.state.loadingError !== null)
			return this.renderErrorMessage();
		else if (this.state.jobSpecSummaries.length === 0)
			return this.renderNoJobSpecsAvailableMessage();
		else
			return this.renderJobSubmissionUi();
	}

	renderLoadingMessage() {
		return Helpers.renderLoadingMessage("job specs");
	}

	renderErrorMessage() {
		return Helpers.renderErrorMessage(
			"job specs",
			this.state.loadingError,
		  this.loadJobSpecSummaries.bind(this));
	}

	renderNoJobSpecsAvailableMessage() {
		return (
			<div className="ui info icon message">
				<i className="info circle icon"></i>
				<div className="content">
					<div className="header">
						No jobs yet!
					</div>
					<p>
						The server doesn't appear to have any jobs you can submit.
						This is probably because the server hasn't been configured
						with any job specs yet. The server admin should add job specs
						to this system (e.g. with <code>jobson generate spec</code>)
					</p>
				</div>
			</div>
		);
	}

	renderJobSubmissionUi() {
		const selectedSpec = this.selectedSpec;

		return (
			<div className="ui form">
				<h1>Submit Job</h1>

				<div className="field">
					<label htmlFor="job-spec">
						Job Spec
					</label>
					<select id="job-spec"
									className="ui fluid dropdown"
									value={this.state.selectedSpecId}
									onChange={this.onChangedSelectedSpec.bind(this)}>

						{this.state.jobSpecSummaries.map(this.renderJobSpecSummary)}
					</select>
				</div>

				<div className="ui info message">
					{selectedSpec.description}
				</div>

				<h4 className="ui dividing header">
					Job Details
				</h4>

				<SubmissionBuilderComponent
					specId={selectedSpec.id}
					api={this.props.api}
					routeProps={this.props.routeProps} />
			</div>
		);
	}

	get selectedSpec() {
		if (this.state.selectedSpecId !== undefined) {
			const maybeSelectedSpec =
				this.state.jobSpecSummaries
					.find(summary => summary.id === this.state.selectedSpecId);

			if (maybeSelectedSpec !== undefined) {
				return maybeSelectedSpec;
			} else {
				alert(`Cannot find a spec with id = ${this.state.selectedSpecId}. Defaulting to the first spec.`);
				return this.state.jobSpecSummaries[0];
			}
		} else return this.state.jobSpecSummaries[0];
	}

	onChangedSelectedSpec(e) {
		this.setState({
			selectedSpecId: e.target.value,
		});
	}

	renderJobSpecSummary(jobSpecSummary, i) {
		return (
			<option key={i} value={jobSpecSummary.id}>
				{jobSpecSummary.name}
			</option>
		);
	}
}
