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

  onChange(e) {
    this.setState({ values: e.target.value.split("\n") }, () => {
			this.props.onValueChanged(this.asApiInput());
		});
  }

  onClickedFromFile() {
  	Helpers.promptUserForFile("text/plain")
			.then(Helpers.readFileAsText)
			.then(text => text
				.split(/\n|,/)
				.map(entry => entry.trim())
				.filter(entry => entry.length > 0))
			.then(values => {
				this.setState({values}, () => {
					this.props.onValueChanged(this.asApiInput());
				});
			});
	}

	onClickedClear() {
  	this.setState({ values: [] }, () => {
  		this.props.onValueChanged(this.asApiInput());
		});
	}

	onClickedDownload() {
  	const payload = [this.state.values.join("\n")];
  	const data = new Blob(payload, {type: "text/plain"});

  	Helpers.promptUserToDownload(data, "values.txt");
	}

  renderHelperButtons() {
  	return (
  		<div className="btn-bar">
				<button className="ui icon button"
								onClick={this.onClickedFromFile.bind(this)}>
					<i className="upload icon"></i>
					From File
				</button>

				<button className="ui icon button"
								onClick={this.onClickedDownload.bind(this)}
				        disabled={this.state.values.length === 0}>
					<i className="download icon"></i>
					Download
				</button>

				<button className="ui button"
								onClick={this.onClickedClear.bind(this)}
								disabled={this.state.values.length === 0}>
					Clear
				</button>
			</div>
		);
	}

	renderInput() {
		return this.state.values.length > 10 ?
			<span>{this.state.values.length} values</span> : // Prevents DOM locking from rendering too many vals.
			<textarea value={this.state.values.join("\n")}
								onChange={this.onChange.bind(this)}
			          placeholder="Entries separated by newlines" />;
	}

  render() {
  	return (
  		<div className="multivalue-input">
				{this.renderInput()}
				{this.renderHelperButtons()}
			</div>
		);
  }
}
