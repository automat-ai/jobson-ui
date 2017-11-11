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
import ReactJson from 'react-json-view';
import {Helpers} from "../Helpers";

// use the component in your app!


export class JobInputsComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			isLoading: true,
			canBeRenderedInBrowser: false,
		};
	}

	componentWillMount() {
		this.props.api
			.fetchJobInputs(this.props.jobId)
			.then(inputs => {
				const canBeRenderedInBrowser = JSON.stringify(inputs).length < 200000;
				this.setState({inputs, isLoading: false, canBeRenderedInBrowser});
			});
	}

	render() {
		if (!this.state.isLoading) {
			return (
				<div className="ui grid jobson-condensed-grid">
					<div className="twelve wide column">
						<h3 className="header">
							inputs.json
						</h3>
					</div>
					<div className="four wide column">
						{Helpers.renderDownloadButton(`${API_PREFIX}/v1/jobs/${this.props.jobId}/inputs`)}
					</div>

					<div className="sixteen wide column">
						{this.state.canBeRenderedInBrowser ?
							this.renderJSONViewer() :
							this.renderWarning()}
					</div>
				</div>
			);
		} else return <div>Loading inputs</div>;
	}

	renderJSONViewer() {
		return (
				<ReactJson src={this.state.inputs}
									 name={null}
									 theme="monokai"
									 collapseStringsAfterLength={100}
									 displayDataTypes={false}/>
		);
	}

	renderWarning() {
		return (
			<div className="ui icon warning message">
				<i className="warning icon"></i>
				<div className="content">
					<div className="header">
						Cannot Display Inputs
					</div>
					<p>
						The inputs used in this job are too big to show in the browser.
						You can try viewing them in with your own software by downloading
						them.
					</p>
					{Helpers.renderDownloadButton(`${API_PREFIX}/v1/jobs/${this.props.jobId}/inputs`)}
				</div>
			</div>
		);
	}
}
