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

export class SignInComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			errorMessage: "",
			username: "",
			password: ""
		};
	}

	signIn(e) {
		e.preventDefault();
		this.props.api
			.fetchJobSummaries() // Triggers a GET, which responds with a HTTP Basic Auth check (uname+password panel).
			.then(() => {
				this.props.signIn();
			})
			.catch(err => {
				this.setState({ errorMessage: err.message });
			})
	}

	render() {
		return (
			<div>
				<h1>Sign In</h1>

				{this.state.errorMessage.length > 0 ?
					<div className="error-banner">
						{this.state.errorMessage}
					</div> : null}

				<form onSubmit={this.signIn.bind(this)}>
					<label htmlFor="username">Username</label>
					<input id="username"
								 type="text"
								 placeholder="username"
								 onChange={(e) => this.setState({ username: e.target.value })}/>

					<label htmlFor="password">Password</label>
					<input id="password"
								 type="password"
								 placeholder="password"
								 onChange={(e) => this.setState({ password: e.target.value })}/>

					<input className="btn-primary"
								 type="submit"
								 value="Sign In" />
				</form>
			</div>
		);
	}
}
