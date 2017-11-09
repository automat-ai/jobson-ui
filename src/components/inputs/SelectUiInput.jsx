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

export class SelectUiInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selected: this.chooseDefaultSelection(props),
		};
	}

	chooseDefaultSelection(props) {
		return props.expectedInput.default ?
			props.expectedInput.default : props.expectedInput.options[0].id;
	}

	componentWillMount() {
		this.props.onValueChanged(this.state.selected);
	}

	onUiSelectionChange(e) {
		this.setState({selected: e.target.value}, () => {
			this.props.onValueChanged(this.state.selected);
		});
	}

	renderOption(option, i) {
		return (
			<option key={i} value={option.id}>
				{option.name}
			</option>
		);
	}

	render() {
		return (
			<div>
				<select onChange={this.onUiSelectionChange.bind(this)} value={this.state.selected}>
					{this.props.expectedInput.options.map(this.renderOption.bind(this))}
				</select>
				<div className="selection-description">
					{this.props.expectedInput.options
						.find(o => o.id === this.state.selected)
						.description}
				</div>
			</div>
		);
	}
}
