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

export class AboutComponent extends React.Component {
	render() {

		return (
			<div>
				<h1>About Jobson UI</h1>
				<a href="https://github.com/adamkewley/jobson-ui">
					Source code (Apache v2 license)
				</a>

				<p>
					Jobson UI is a frontend for <a href="https://github.com/adamkewley/jobson">Jobson</a>.
				</p>

				<p>
					Jobson and Jobson UI were developed for a project where researchers, data
					scientists, and developers work together on huge data pipelines. A lot of time
					was spent explaining how to install/run applications, handling data requests, and
					tracing data requests.
				</p>

				<p>

					Earlier attempts to systemize around the issue with hand-coded web servers
					worked fine, but they were brittle and needed redevelopment every
					time a new workflow came along. <a href="https://github.com/adamkewley/jobson">Jobson</a> automates around
					the most common patterns, such as developing a persistence layer, designing an
					API, designing a frontend, and delivering outputs.
				</p>

				<p>
					Jobson was inspired by a mixture of the Linux kernel (processes, IO, signals),
					Ruby on Rails (CLI configuration generation), declarative programming
					(spec files), and functional reactive programming (data streams, websockets).
				</p>
			</div>
		);
	}
}
