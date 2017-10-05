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
				<h1>About</h1>
				<code>jobson-ui</code>

				<p>
					Jobson and Jobson UI were developed on a project where researchers and
					developers work together on a variety of data pipelines. We spent a
					lot of time handling data requests, explaining how to install
					applications, explaining how to run applications, tracing requests,
					etc.

					Attempts to systemize the process with bespoke web servers
					worked, but those systems were brittle and needed redevelopment every
					time a new workflow came along. Jobson was developed to generate a
					self-explanatory, standard API that is simple, can be changed *very*
					easily (spec files), and contained enough information (names, descriptions) for frontends to
					generate easy-to-use UIs.

					Jobson UI is a web UI that uses the Jobson API. It is a set of static web assets compiled with Webpack.
				</p>
			</div>
		);
	}
}
