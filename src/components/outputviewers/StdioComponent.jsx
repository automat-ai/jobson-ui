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

export class StdioComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			isLoading: true,
			loadingError: null,
			content: "",
			grepFilter: "",
		};
	}

	componentWillMount() {
		this.loadDataAndSubscribeToUpdates();
	}

	componentWillUnmount() {
		this.unsubscribeFromDataUpdates();
	}

	loadDataAndSubscribeToUpdates() {
		this
			.loadData()
			.then(this.subscribeToDataUpdates.bind(this));
	}

	loadData() {
		return this.props
			.fetchStdio()
			.then(Helpers.fetchBlobContentsAsText)
			.then(text => {
				this.setState({
					isLoading: false,
					loadingError: null,
					content: text,
				});
			})
			.catch(apiError => {
				if (apiError.code === 404) {
					// It may not have been written to yet.
					this.setState({
						isLoading: false,
						loadingError: null,
						content: "",
					});
				} else {
					this.setState({
						isLoading: false,
						loadingError: apiError,
						content: "",
					});
				}
			});
	}

	subscribeToDataUpdates() {
		this.unsubscribeFromDataUpdates();

		this.updateSubscription = this.props
			.onStdioUpdate()
			.subscribe(update => {
				Helpers.fetchBlobContentsAsText(update)
					.then(text =>
						this.setState(oldState => {
							return {content: oldState.content + text};
						}));
			}, connectionErr => {});
	}

	unsubscribeFromDataUpdates() {
		if (this.updateSubscription) {
			this.updateSubscription.unsubscribe();
			this.updateSubscription = null;
		}
	}

	onGrepFilterChanged(e) {
		this.setState({ grepFilter: e.target.value });
	}

	grep(str) {
		let regex;
		try {
			regex = new RegExp(this.state.grepFilter);
		} catch (e) {
			return str; // Incase regex mis-compiles
		}

		return str
			.split("\n")
			.filter(line => regex.test(line))
			.join("\n");
	}

	componentDidUpdate() {
		if (this.el) this.el.scrollTop = this.el.scrollHeight;
	}


	render() {
		if (this.state.isLoading)
			return this.renderLoadingMessage();
		else if (this.state.loadingError !== null)
			return this.renderErrorMessage();
		else if (this.state.content.length === 0)
			return this.renderEmptyDataMessage();
		else
			return this.renderUi();
	}

	renderLoadingMessage() {
		return Helpers.renderLoadingMessage("output");
	}

	renderErrorMessage() {
		return Helpers.renderErrorMessage(
			"output",
			this.state.loadingError,
			this.loadDataAndSubscribeToUpdates.bind(this));
	}

	renderEmptyDataMessage() {
		return (
			<div className="ui icon message">
				<i className="square outline icon"></i>
				<div className="content">
					<div className="header">
						No content
					</div>
					<p>
						This output is empty
					</p>
				</div>
			</div>
		);
	}

	renderUi() {
		return (
			<div>
				<div className="ui icon input">
					<input placeholder="grep"
								 value={this.state.grepFilter}
								 onChange={this.onGrepFilterChanged.bind(this)} />
					<i className="search icon"></i>
				</div>

				<pre ref={(el) => { this.el = el } }>
						{this.state.grepFilter.length > 0 ?
							this.grep(this.state.content) :
							this.state.content}
					</pre>
			</div>
		);
	}
}
