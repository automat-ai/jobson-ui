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
import {SqlBuilderComponent} from "./sql/SqlBuilderComponent";
import {SelectUiInput} from "./SelectUiInput";

export class SqlUiInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedTable: props.expectedInput.tables[0]
		};
	}

	onTableSelectionChange(selectedTableId) {
		const selectedTable =
			this.props.expectedInput.tables.find(t => t.id === selectedTableId);
		this.setState({selectedTable});
	}

	onQueryChanged(query) {
		this.props.onValueChanged(query);
	}

	renderTableOption(option, i) {
		return <option key={i} value={i}>{option.name}</option>;
	}

	render() {
		return (
			<div>
				<label>
					Table
				</label>
				<SelectUiInput expectedInput={{ options: this.props.expectedInput.tables }}
											 onValueChanged={this.onTableSelectionChange.bind(this)} />

				<label>
					Query
				</label>

				<SqlBuilderComponent
					table={this.state.selectedTable}
					onQueryChanged={this.onQueryChanged.bind(this)}/>
			</div>
		);
	}

	toOption(table, i) {

	}
}
