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
import {NavLink} from "react-router-dom";

export class NavbarComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			isLoadingUsername: true,
			errorLoadingUsername: false,
			username: null,
		};
	}

	componentWillMount() {
		this.props.api.fetchCurrentUser()
			.then(userId => {
				this.setState({
					isLoadingUsername: false,
					username: userId,
				});
			})
			.catch(() => {
				this.setState({
					isLoadingUsername: false,
					errorLoadingUsername: true,
					username: null,
				});
			});
	}

	render() {
		return (
			<div className="ui secondary pointing menu">
				<div className="ui container">

					<span className="header item">
						Jobson
					</span>

					<NavLink to="/jobs" className="item" activeClassName="active">
						Jobs
					</NavLink>
					<NavLink to="/submit" className="item" activeClassName="active">
						Submit Job
					</NavLink>

					<div className="right menu">
						<em className="item">
							{this.tryRenderUser()}
						</em>
					</div>
				</div>
			</div>
		);
	}

	tryRenderUser() {
		if (this.state.isLoadingUsername)
			return this.renderLoadingIcon();
		else if (this.state.errorLoadingUsername)
			return this.renderErrorTag();
		else
			return this.renderUsername();
	}

	renderLoadingIcon() {
		return (
			<div className="ui tiny active inline loader">
			</div>
		);
	}

	renderErrorTag() {
		return (
			<div className="ui tiny red horizontal basic label">
				Error loading username
			</div>
		);
	}

	renderUsername() {
		return (
			<div>
				<i className="user icon"></i>
				{this.state.username}
			</div>
		);
	}
}
