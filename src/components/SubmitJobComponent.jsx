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
import {SubmissionBuilderComponent} from "./SubmissionBuilderComponent";

export class SubmitJobComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			specsLoaded: false,
			jobSpecSummaries: [],
			selected: 0,
		};
	}

	componentWillMount() {
		this.props.api.fetchJobSpecSummaries().then(jobSpecSummaries => {
			this.setState({
				specsLoaded: true,
				jobSpecSummaries: jobSpecSummaries,
			});
		});
	}

	onSelectSpecSummary(e) {
		this.setState({
			selected: parseInt(e.target.value)
		});
	}

	renderSpecSummary(specSummary, i) {
		return <option key={i} value={i}>{specSummary.name}</option>;
	}

	renderJobSubmissionUi() {
		const selectedSpec = this.state.jobSpecSummaries[this.state.selected];

		return (
			<div id="submit-job">
				<h1>Submit Job</h1>

				<label htmlFor="job-spec">Job Spec</label>
				<select id="job-spec" value={this.state.selected} onChange={(e) => this.onSelectSpecSummary(e)}>
					{this.state.jobSpecSummaries.map(this.renderSpecSummary)}
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
		if (this.state.specsLoaded) {
			if (this.state.jobSpecSummaries.length > 0) {
				return this.renderJobSubmissionUi();
			} else {
				return (
					<em>
						The server responded fine, but the response contained no job specs.
						This is probably because the system hasn't been configured with jobs yet.
					</em>
				);
			}
		} else return <em>Loading job specs</em>;
	}
}
