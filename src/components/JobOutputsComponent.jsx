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
import {StdioComponent} from "./outputviewers/StdioComponent"
import {Helpers} from "../Helpers";

export class JobOutputsComponent extends React.Component {

	constructor() {
		super();

		this.jobChangesSubscription = null;

		this.state = {
			isLoadingJobOutputs: true,
			loadingError: null,
			jobOutputs: null,
		};
	}

	componentWillMount() {
		this.loadJobOutputs();
		this.jobChangesSubscription =
			this.props.jobChangesSubject.subscribe(
				this.loadJobOutputs.bind(this));
	}

	componentWillUnmount() {
		if (this.jobChangesSubscription !== null)
			this.jobChangesSubscription.unsubscribe();
	}

	loadJobOutputs() {
		this.props.api
			.fetchJobOutputs(this.props.jobId)
			.then(jobOutputs => {
				this.setState({
					isLoadingJobOutputs: false,
					loadingError: null,
					jobOutputs: jobOutputs,
				});
			})
			.catch(apiError => {
				this.setState({
					isLoadingJobOutputs: false,
					loadingError: apiError,
					jobOutputs: null,
				});
			});
	}

	render() {
		if (this.state.isLoadingJobOutputs)
			return this.renderLoadingMessage();
		else if (this.state.loadingError !== null)
			return this.renderErrorMessage();
		else
			return this.renderOutputsUi();
	}

	renderLoadingMessage() {
		return Helpers.renderLoadingMessage("job outputs");
	}

	renderErrorMessage() {
		return Helpers.renderErrorMessage(
			"job outputs",
			this.state.loadingError,
			this.loadJobOutputs.bind(this));
	}

	renderOutputsUi() {
		return (
			<div>
				{this.renderFileOutputs()}
				{this.renderStdioOutput(
					"stdout",
					this.props.api.urlToGetJobStdout(this.props.jobId),
					() => this.props.api.fetchJobStdout(this.props.jobId),
					() => this.props.api.onJobStdoutUpdate(this.props.jobId))}
				{this.renderStdioOutput(
					"stderr",
					this.props.api.urlToGetJobStderr(this.props.jobId),
					() => this.props.api.fetchJobStderr(this.props.jobId),
					() => this.props.api.onJobStderrUpdate(this.props.jobId))}
			</div>
		);
	}

	renderFileOutputs() {
		return this.state.jobOutputs.map((output, i) => {
			return this.renderFileOutput(output, i);
		});
	}

	renderFileOutput(jobOutput, key) {
		const viewer =
			(jobOutput.metadata && jobOutput.metadata.embed) ?
				<embed className="ui image" src={this.props.api.buildAPIPathTo(jobOutput.href)} /> :
				null;

		return this.renderJobOutput({
			title: jobOutput.name || jobOutput.id,
			description: jobOutput.description || null,
			downloadHref: this.props.api.buildAPIPathTo(jobOutput.href),
			viewer: viewer,
		});
	}

	renderStdioOutput(title, href, fetchStdio, onStdioUpdate) {
		const stdioViewer = <StdioComponent fetchStdio={fetchStdio}
																	 onStdioUpdate={onStdioUpdate} />;

		return this.renderJobOutput({
			title: title,
			description: null,
			downloadHref: href,
			viewer: stdioViewer
		});
	}

	renderJobOutput({title, description, downloadHref, viewer}) {
		return (
			<div className="ui grid jobson-condensed-grid" key={downloadHref}>
				<div className="twelve wide column">
					<h3 className="header">
						{title}
					</h3>
					{description}
				</div>

				<div className="four wide column">
					<div className="ui right floated">
						{Helpers.renderDownloadButton(downloadHref)}
					</div>
				</div>

				<div className="sixteen wide column">
					{viewer}
					<div className="ui divider"></div>
				</div>
			</div>
		);
	}
}
