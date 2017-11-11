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
//import '../../styles/index.scss';
import {HttpService} from "../HttpService";
import {JobsonAPI} from "../JobsonAPI";
import {JobListComponent} from "./JobListComponent";
import {SubmitJobComponent} from "./SubmitJobComponent";
import {JobDetailsComponent} from "./JobDetailsComponent";
import {Switch, Route, Link, Redirect} from "react-router-dom";
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
			username: "Loading...",
		};
	}

	componentWillMount() {
		this.state.httpService.onRequestsChanged.subscribe(requests => {
			this.setState({ requests: requests });
		});

		this.state.api.fetchCurrentUser().then(userId => {
			this.setState({ username: userId });
		})
	}

	render() {
		return (
			<div>
				{this.state.requests.length > 0 ?
				<div className="loading-bar enabled"></div> :
				<div className="loading-bar"></div>}

				<div id="root-container">
					<div>

						<div className="ui secondary pointing menu">
							<div className="ui container">
								<span className="header item">
									Jobson
								</span>

								<Link to="/jobs" className="item">Jobs</Link>
								<Link to="/submit" className="item">Submit Job</Link>

								<div className="right menu">
									<em className="item">
										<i className="user icon"></i>
										{this.state.username}
									</em>
								</div>
							</div>
						</div>


						<main className="ui container" style={{marginBottom: "1em"}}>
							<Switch>
								<Route path="/submit"
											 render={props => <SubmitJobComponent api={this.state.api} routeProps={props} />}/>
								<Route path="/jobs/:id"
											 render={props => <JobDetailsComponent params={props.match.params} api={this.state.api}/>}/>
								<Route path="/jobs"
											 render={props => <JobListComponent api={this.state.api} routeProps={props} />}/>
								<Route path="/about" component={AboutComponent} />
								<Redirect from={"/"} to={"/jobs"} />
							</Switch>
						</main>

						<div className="ui inverted vertical footer segment">
							<div className="ui container">
								<div className="ui stackable inverted divided equal height stackable grid">
									<div className="ten wide column">
										<h4 className="ui inverted header">Jobson UI</h4>
										<p>
											An open-source (Apache v2) project that webifies command-line
											applications.
										</p>
									</div>
									<div className="six wide column">
										<div className="ui inverted link list">
											<a className="item" href="https://github.com/adamkewley/jobson-ui">Jobson UI Source Code</a>
											<a className="item" href="https://github.com/adamkewley/jobson-ui/releases">Jobson UI Releases</a>
											<a className="item" href="https://github.com/adamkewley/jobson">Jobson Source Code</a>
											<a className="item" href="https://github.com/adamkewley/jobson/releases">Jobson Releases</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
