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

export class SqlUiInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedTable: props.expectedInput.tables[0]
		};
	}

	onTableSelectionChange(e) {
		const selectedTable = this.props.expectedInput.tables[e.target.value];
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
			<div className="sql-input">
				<div className="expected-input">
					<select onChange={this.onTableSelectionChange.bind(this)}>
						{this.props.expectedInput.tables.map(this.renderTableOption.bind(this))}
					</select>

					<div className="selection-description">
						{this.state.selectedTable.description}
					</div>
				</div>

				<div className="expected-input">
					<label>Columns &amp; Filters</label>
					<div className="input-description">
						Select columns
					</div>
					<SqlBuilderComponent
						table={this.state.selectedTable}
						onQueryChanged={this.onQueryChanged.bind(this)}/>
				</div>
			</div>
		);
	}
}
