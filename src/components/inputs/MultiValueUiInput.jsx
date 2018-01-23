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
import {Helpers} from "../../Helpers";

export class MultiValueUiInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			values: props.expectedInput.default || [],
		};
	}

	componentWillMount() {
		this.props.onValueChanged(this.asApiInput());
	}

	asApiInput() {
		return this.state.values;
	}


	render() {
		return (
			<div>
				{this.renderInput()}
				{this.renderHelperButtons()}
			</div>
		);
	}

	renderInput() {
		if (this.state.values.length > 500)
			return this.renderHighPerformanceInput();
		else
			return this.renderInteractiveInput();
	}

	renderHighPerformanceInput() {
		const values = this.state.values;
		return (
			<div className="ui message">
				<div className="header">
					{values.length} values
				</div>
				<ul>
					<li>
						First 5: {values.slice(0, 5).map(this.renderValueLabel)}
					</li>
					<li>
						Last 5: {values.slice(values.length - 5).map(this.renderValueLabel)}
					</li>
				</ul>
			</div>
		);
	}

	renderValueLabel(value, i) {
		return (
			<div className="ui horizontal label"
					 key={i}>
				{value}
			</div>
		);
	}

	renderInteractiveInput() {
		return (
			<textarea value={this.state.values.join("\n")}
								onChange={this.onChange.bind(this)}
								placeholder="Entries separated by newlines"/>
		);
	}

	onChange(e) {
		const values = e.target.value.length > 0 ?
			e.target.value.split("\n") : [];

		this.setState({values}, () => {
			this.props.onValueChanged(this.asApiInput());
		});
	}

	renderHelperButtons() {
		return (
			<div className="ui buttons">
				<button className="ui basic icon button"
								onClick={this.onClickImportValuesFromFile.bind(this)}>
					<i className="upload icon"></i>
					Import
				</button>

				<button className="ui basic icon button"
								onClick={this.onClickDownloadValues.bind(this)}
								disabled={this.state.values.length === 0}>
					<i className="download icon"></i>
					Download
				</button>

				<button className="ui basic icon button"
								onClick={this.onClickClearValues.bind(this)}
								disabled={this.state.values.length === 0}>
					<i className="remove icon"></i>
					Clear
				</button>
			</div>
		);
	}

	onClickImportValuesFromFile() {
    console.log("csv support");
		Helpers.promptUserForFile("text/plain")
			.then(Helpers.readFileAsText)
			.then(text => text
				.split(/\n/)
				.map(entry => entry.trim())
				.filter(entry => entry.length > 0))
			.then(importedValues => {
				const newValues =
					this.state.values.concat(importedValues);

				this.setState({values: newValues}, () => {
					this.props.onValueChanged(this.asApiInput());
				});
			})
			.catch(() => {
				// User cancelled out of dialog: do nothing.
			});
	}

	onClickDownloadValues() {
		const payload = [this.state.values.join("\n")];
		const data = new Blob(payload, {type: "text/plain"});

		Helpers.promptUserToDownload(data, "values.txt");
	}

	onClickClearValues() {
		this.setState({values: []}, () => {
			this.props.onValueChanged(this.asApiInput());
		});
	}
}
