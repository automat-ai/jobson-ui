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

		const selectedItem = this.chooseDefaultSelection(props);

		this.state = {
			selected: selectedItem,
		};
	}

	chooseDefaultSelection(props) {
		return props.expectedInput.default ?
			props.expectedInput.default :
			this.optionToSelection(props.expectedInput.options[0]);
	}

	optionToSelection(option) {
		return option.id;
	}

	componentWillMount() {
		this.props.onValueChanged(this.state.selected);
	}

	componentWillReceiveProps(newProps) {
		const selectedItem = this.chooseDefaultSelection(newProps);
		this.setState(
			{selected: selectedItem},
			() => this.props.onValueChanged(this.state.selected));
	}

	onUiSelectionChange(e) {
		const selectedOption = this.props.expectedInput.options[e.target.value];
		const selection = this.optionToSelection(selectedOption);

		this.setState(
			{selected: selection},
			() => this.props.onValueChanged(this.state.selected));
	}

	renderOption(option, i) {
		return <option key={i} value={i}>{option.name}</option>;
	}

	render() {
		return (
			<div>
				<select onChange={this.onUiSelectionChange.bind(this)}>
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
