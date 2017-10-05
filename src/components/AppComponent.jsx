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

import React from 'react';
import '../../styles/index.scss';
import {HttpService} from "../HttpService";
import {JobsonAPI} from "../JobsonAPI";
import {JobListComponent} from "./JobListComponent";
import {SubmitJobComponent} from "./SubmitJobComponent";
import {SignInComponent} from "./SignInComponent";
import {JobDetailsComponent} from "./JobDetailsComponent";
import {Switch, Route, Link} from "react-router-dom";
import {AboutComponent} from "./AboutComponent";

export default class AppComponent extends React.Component {

	constructor() {
		super();

		const httpService = new HttpService();
		const api = new JobsonAPI(httpService);

		this.state = {
			httpService: httpService,
			api: api,
			requests: [],
		};
	}

	componentWillMount() {
		this.state.httpService.onRequestsChanged.subscribe(requests => {
			this.setState({ requests: requests });
		});

		if (document.cookie.indexOf("session=") >= 0) {
			this.setState({loggedIn: true});
		}
	}

	render() {
		return (
			<div>
				{this.state.requests.length > 0 ?
				<div className="loading-bar enabled"></div> :
				<div className="loading-bar"></div>}

				<div id="root-container">
					<div>
						<div id="navbar">
							<span id="title">Jobson</span>

							<nav>
								<Link to="/jobs">Jobs</Link>
								<Link to="/jobs/submit">Submit Job</Link>
							</nav>

							<div className="navbar-right">
						<span id="navbar-username">
							akewley
						</span>
							</div>
						</div>

						<main>
							<Switch>
								<Route exact path="/" render={props => <JobListComponent api={this.state.api}/>}/>
								<Route exact path="/jobs" render={props => <JobListComponent api={this.state.api}/>}/>
								<Route exact path="/jobs/submit" render={props => <SubmitJobComponent api={this.state.api}/>}/>
								<Route exact path="/about" render={props => <AboutComponent />}/>
								<Route path="/jobs/:id"
											 render={props => <JobDetailsComponent params={props.match.params} api={this.state.api}/>}/>
							</Switch>
						</main>

						<footer>
							<Link to="/about">about</Link>
						</footer>
					</div>
				</div>
			</div>
		);
	}
}
