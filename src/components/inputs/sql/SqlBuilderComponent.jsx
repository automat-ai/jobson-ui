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
import {SqlPredicateBuilderComponent} from "./SqlPredicateBuilderComponent";
import {Helpers} from "../../../Helpers";

export class SqlBuilderComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			table: props.table,
			columnsToExtract: new Set(),
			filters: {},
			search: "",
			onlyShowSelectedColumns: false,
		};
	}

	componentWillMount() {
		this.props.onQueryChanged(this.toSqlQuery());
	}

	componentWillReceiveProps(newProps) {
		if (newProps.table !== this.state.table) {
			this.setState({
				table: newProps.table,
				columnsToExtract: new Set(),
				filters: {},
			}, () => newProps.onQueryChanged(this.toSqlQuery()));
		}
	}

	onExtractCheckboxChange(column, e) {
		const columnsToExtract = new Set(this.state.columnsToExtract);

		if (e.target.checked) columnsToExtract.add(column.id);
		else columnsToExtract.delete(column.id);

		this.setState({columnsToExtract}, () => {
			this.props.onQueryChanged(this.toSqlQuery());
		});
	}

	onNewFilter(column, filterStr) {
		const filters = filterStr !== null ?
			Object.assign({}, this.state.filters, { [column.id]: filterStr }) :
			Helpers.dissasoc(this.state.filters, column.id);

		this.setState({filters}, () => {
			this.props.onQueryChanged(this.toSqlQuery());
		});
	}

	onSearchChanged(e) {
		this.setState({search: e.target.value})
	}

	shouldDisplayColumn(column) {
		const columnSelected = this.state.columnsToExtract.has(column.id);

		if (this.state.onlyShowSelectedColumns && !columnSelected) {
			return false;
		} else {
			return column.id.toLowerCase().includes(this.state.search.toLowerCase());
		}
	}

	onClickedSelectAll(e) {
		const allTableColumnIds = this.state.table.columns.map(col => col.id);
		this.setState({columnsToExtract : new Set(allTableColumnIds)});
	}

	onClickedClearSelection(e) {
		this.setState({columnsToExtract : new Set()});
	}

	toSqlQuery() {
		const notEmptyFilters =
			Object.keys(this.state.filters).map(k => this.state.filters[k]);

		const whereClause = notEmptyFilters.length > 0 ?
			"\nwhere " + notEmptyFilters.join(" and\n") :
			"";

		return `select ${Array.from(this.state.columnsToExtract).join(", ")}
from ${this.state.table.id}${whereClause};`;

	}

	renderColumn(column, i) {
		return (
			<tr key={column.id}>
				<td>
					<input type="checkbox"
								 checked={this.state.columnsToExtract.has(column.id)}
								 onChange={this.onExtractCheckboxChange.bind(this, column)} />
				</td>
				<td>{column.name} - {column.description}</td>
				<td>
					<SqlPredicateBuilderComponent column={column}
																				onNewFilter={this.onNewFilter.bind(this, column)}/>
				</td>
			</tr>
		);
	}

	renderTableBody() {
		const rows =
			this.state.table.columns
				.filter(this.shouldDisplayColumn.bind(this))
				.map(this.renderColumn.bind(this));

		return rows.length === 0 ?
			(
				<tbody>
				<tr>
					<td className="missing-banner" colSpan="4">
						No rows to show - are you filtering too much?
					</td>
				</tr>
				</tbody>
			) :
			(
				<tbody>
				{rows}
				</tbody>
			);
	}

	render() {
		return (
			<div>
				<div className="table-filters">
					<button className="btn-default" onClick={this.onClickedSelectAll.bind(this)}>
						Select All
					</button>

					<button className="btn-default" onClick={this.onClickedClearSelection.bind(this)}>
						Clear Selection
					</button>

					<input placeholder="Search"
								 value={this.state.search}
								 onChange={this.onSearchChanged.bind(this)} />

					<label htmlFor="only-show-selected-columns">
						Only show selected columns
					</label>
					<input id="only-show-selected-columns"
								 type="checkbox"
								 checked={this.state.onlyShowSelectedColumns}
								 onChange={(e) => this.setState({ onlyShowSelectedColumns: e.target.checked })} />
				</div>

				<div className="table-wrapper">
					<table>
						<colgroup>
							<col width="10%" />
							<col width="40%" />
							<col width="50%" />
						</colgroup>
						<thead>
						<tr>
							<th>Extract?</th>
							<th>Description</th>
							<th>Filter</th>
						</tr>
						</thead>
						{this.renderTableBody()}
					</table>
				</div>
			</div>
		);
	}
}
