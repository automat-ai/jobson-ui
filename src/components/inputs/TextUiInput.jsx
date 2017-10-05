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

export class TextUiInput extends React.Component {

	constructor(props) {
		super(props);

		const value = props.expectedInput.default ? props.expectedInput.default : "";

		this.state = { value: value };
	}

	componentWillMount() {
		this.props.onValueChanged(this.asApiInput());
	}

	asApiInput() {
		return this.state.value;
	}

	componentWillReceiveProps(newProps) {
		const value = newProps.expectedInput.default ? newProps.expectedInput.default : "";

		this.setState({value: value}, () => this.props.onValueChanged(this.asApiInput()));
	}

	onChange(e) {
		this.setState({value: e.target.value}, () => this.props.onValueChanged(this.asApiInput()));
	}

	render() {
		return <input type="text"
									value={this.state.value}
									onChange={this.onChange.bind(this)} />;
	}
}
