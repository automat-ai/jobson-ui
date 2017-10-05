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

export class StdioComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			isLoading: false,
			content: "",
			grepFilter: "",
		};
	}

	componentWillMount() {
		this.setState({ isLoading: true }, (newState) => {
			this.props
				.fetchStdio()
				.then(Helpers.fetchBlobContentsAsText)
				.then(text => {
					this.setState({isLoading: false, content: text});
				});

			this.updateSubscription = this.props
				.onStdioUpdate()
				.subscribe(update => {
					Helpers.fetchBlobContentsAsText(update)
						.then(text =>
							this.setState(oldState => {
								return {content: oldState.content + text};
							}));
				}, connectionErr => {});
		});
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

	onClickDownload() {
		this.props
			.fetchStdio()
			.then(blob => Helpers.promptUserToDownload(blob, "data"));
	}

	componentDidUpdate() {
		if (this.el) this.el.scrollTop = this.el.scrollHeight;
	}

	render() {
		if (this.state.isLoading) {
			return <span>Loading</span>;
		} else if (this.state.content.length > 0)
			return (
				<div>
					<div className="input-bar">
						<button className="btn-default"
										onClick={this.onClickDownload.bind(this)}>
							Download
						</button>

						<input placeholder="grep"
									 value={this.state.grepFilter}
									 onChange={this.onGrepFilterChanged.bind(this)} />
					</div>

					<pre ref={(el) => { this.el = el } }>
						{this.state.grepFilter.length > 0 ?
						  this.grep(this.state.content) :
							this.state.content}
					</pre>
				</div>
			);
		else return <div className="missing-banner">No content</div>;
	}

	componentWillUnmount() {
		this.updateSubscription.unsubscribe();
	}
}
