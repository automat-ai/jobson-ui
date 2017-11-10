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

		this.state = {
			value: this.chooseDefaultSelection(props),
		};
	}

	chooseDefaultSelection(props) {
		return props.expectedInput.default ? props.expectedInput.default : "";
	}

	componentWillMount() {
		this.props.onValueChanged(this.state.value);
	}

	componentWillReceiveProps(newProps) {
		this.setState({value: this.chooseDefaultSelection(newProps)}, () => {
			this.props.onValueChanged(this.state.value);
		});
	}

	onChange(e) {
		this.setState({value: e.target.value}, () => {
			this.props.onValueChanged(this.asApiInput());
		});
	}

	render() {
		return (
			<div className="ui fluid input">
				<input type="text"
							 id={ "expected-input_" + this.props.expectedInput.id}
							 value={this.state.value}
							 onChange={this.onChange.bind(this)} />
			</div>
		);
	}
}
