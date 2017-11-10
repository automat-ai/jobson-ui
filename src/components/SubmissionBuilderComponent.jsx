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
import {TextUiInput} from "./inputs/TextUiInput";
import {SelectUiInput} from "./inputs/SelectUiInput";
import {MultiValueUiInput} from "./inputs/MultiValueUiInput";
import {SqlUiInput} from "./inputs/SqlUiInput";
import {Helpers} from "../Helpers";

export class SubmissionBuilderComponent extends React.Component {

	static expectedInputUiComponentCtors = {
		string: TextUiInput,
		select: SelectUiInput,
		"string[]": MultiValueUiInput,
		sql: SqlUiInput
	};



	constructor() {
		super();

		this.state = {
			specLoaded: false,
			spec: null,
			expectedInputComponents: null,
			jobName: "default",
			inputs: {},
			errorMessage: "",
		};
	}



	componentWillMount() {
		this.fetchSpec(this.props.specId);
	}

	componentWillReceiveProps(props) {
		if (props.specId !== this.props.specId) {
			this.setState({
				specLoaded: false,
				spec: null,
				expectedInputComponents: null,
				jobName: "default",
				inputs: {},
			}, () => this.fetchSpec(props.specId));
		}
	}

	fetchSpec(specId) {
		const createExpectedInputComponent = this.createUiInput.bind(this);

		this.props.api.fetchJobSpec(specId).then(jobSpec => {
			const expectedInputComponents =
				jobSpec.expectedInputs.map(createExpectedInputComponent);

			this.setState({
				specLoaded: true,
				spec: jobSpec,
				expectedInputComponents: expectedInputComponents,
			});
		});
	}

	submitJob() {
		const jobRequest = this.generateJobRequest();
		this.props.api
			.submitJobRequest(jobRequest)
			.then(resp => {
				this.props.routeProps.history.push(`/jobs/${resp.id}`);
			})
			.catch(err => {
				this.setState({ errorMessage: err.message });
			});
	}

	generateJobRequest() {
		return {
			spec: this.state.spec.id,
			name: this.state.jobName,
			inputs: this.state.inputs,
		};
	}

	updateJobName(e) {
		this.setState({jobName: e.target.value});
	}

	downloadRequest() {
		Helpers.promptUserToDownloadAsJSON(this.generateJobRequest());
	}

	render() {
		return this.state.specLoaded ?
			(
				<div>
					{this.state.errorMessage.length > 0 ?
						<div className="error-banner">
							{this.state.errorMessage}
						</div> : null}

					<div className="field">
						<label htmlFor="job-name">
							Job Name
						</label>
						<div className="ui fluid input">
							<input type="text"
										 id="job-name"
										 placeholder="Job Name"
										 value={this.state.jobName}
										 className="ui fluid input"
										 onChange={this.updateJobName.bind(this)} />
						</div>
					</div>

					<div>
						{this.state.expectedInputComponents}
					</div>

					<div style={{marginTop: "1em", textAlign: "center"}}>
						<div>
							<button className="ui primary button"
											onClick={this.submitJob.bind(this)}>
								Submit Job
							</button>
						</div>

						<button className="ui tiny button"
										onClick={this.downloadRequest.bind(this)}>
							Download Request (debug)
						</button>
					</div>

				</div>
			) :
			<span>Loading spec</span>;
	}

	createUiInput(expectedInput) {
		const componentCtor =
			SubmissionBuilderComponent.expectedInputUiComponentCtors[expectedInput.type];

		if (componentCtor === undefined)
			throw `Unknown input type ${expectedInput.type}`;

		const componentProps = {
			expectedInput: expectedInput,
			onValueChanged: input => {
				this.setState(prevState => {
					const newInputs = Object.assign({}, prevState.inputs, { [expectedInput.id]: input });
					return Object.assign({}, prevState, { inputs: newInputs });
				});
			},
		};

		const inputComponent = React.createElement(componentCtor, componentProps, null);

		return (
			<div className="field" key={expectedInput.id}>
				<label htmlFor={"expected-input_" + expectedInput.id}>{expectedInput.name}</label>
				{expectedInput.description ? this.renderDescription(expectedInput) : null}
				{inputComponent}
			</div>
		);
	}

	renderDescription(expectedInput) {
		return (
			<div>
				{expectedInput.description}
			</div>
		);
	}
}
