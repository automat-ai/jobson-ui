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
			jobSpecSummariesLoaded: false,
			jobSpecSummaries: [],
			selectedSpecId: undefined,
		};
	}

	componentWillMount() {
		const params =
			Helpers.extractParams(this.props.routeProps.location.search);

		this.props.api.fetchJobSpecSummaries()
			.then(jobSpecSummaries => {
				this.setState({
					jobSpecSummariesLoaded: true,
					jobSpecSummaries: jobSpecSummaries,
					selectedSpecId: params.spec || undefined,
				});
			});
	}

	onSelectSpecSummary(e) {
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

	renderJobSubmissionUi() {
		selectedSpec = this.state.jobSpecSummaries[0];
		let selectedSpec;
		if (this.state.selectedSpecId !== undefined) {
			const maybeSelectedSpec =
				this.state.jobSpecSummaries
					.find(summary => summary.id === this.state.selectedSpecId);

			if (maybeSelectedSpec !== undefined) {
				selectedSpec = maybeSelectedSpec;
			} else {
				alert(`Cannot find a spec with id = ${this.state.selectedSpecId}. Defaulting to the first spec.`);
				selectedSpec = this.state.jobSpecSummaries[0];
			}
		} else selectedSpec = this.state.jobSpecSummaries[0];

		return (
			<div id="submit-job">
				<h1>Submit Job</h1>

				<label htmlFor="job-spec">Job Spec</label>
				<select id="job-spec"
								value={this.state.selectedSpecId}
								onChange={this.onSelectSpecSummary.bind(this)}>

					{this.state.jobSpecSummaries.map(this.renderJobSpecSummary)}
				</select>

				<div id="spec-description">
					<code>{selectedSpec.id}</code>: {selectedSpec.description}
				</div>

				<SubmissionBuilderComponent
					specId={selectedSpec.id}
					api={this.props.api}
					routeProps={this.props.routeProps} />
			</div>
		);
	}

	render() {
		if (this.state.jobSpecSummariesLoaded) {
			if (this.state.jobSpecSummaries.length > 0) {
				return this.renderJobSubmissionUi();
			} else {
				return (
					<div className="missing-banner">
						The server doesn't appear to have any jobs you can submit.
						This is probably because the server hasn't been configured
						with any job specs yet. The server admin should add job specs
						to this system (e.g. with <code>jobson generate spec</code>)
					</div>
				);
			}
		} else return <em>Loading job specs</em>;
	}
}
