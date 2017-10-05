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
import {EqualsFilter} from "./filters/EqualsFilter";
import {GreaterThanFilter} from "./filters/GreaterThanFilter";
import {LessThanFilter} from "./filters/LessThanFilter";
import {BetweenFilter} from "./filters/BetweenFilter";
import {InFilter} from "./filters/InFilter";
import {NullFilter} from "./filters/NullFilter";

export class SqlPredicateBuilderComponent extends React.Component {

	static filters = {
		equals: { name: "Equal To", ctor: EqualsFilter },
		greaterThan: { name: "Greater Than", ctor: GreaterThanFilter },
		lessThan: { name: "Less Than", ctor: LessThanFilter },
		between: { name: "Between", ctor: BetweenFilter },
		inFilter: { name: "In", ctor: InFilter },
		unfiltered: { name: "Unfiltered", ctor: NullFilter },
	};

	static getFiltersForDataType(dataType) {

		const filterMappings = {
			byte: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			integer: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.greaterThan,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			int: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.greaterThan,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			short: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.greaterThan,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			long: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.greaterThan,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			float: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.greaterThan,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			double: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.equals,
				SqlPredicateBuilderComponent.filters.greaterThan,
				SqlPredicateBuilderComponent.filters.lessThan,
				SqlPredicateBuilderComponent.filters.between,
				SqlPredicateBuilderComponent.filters.inFilter,
			],
			char: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.inFilter,
				SqlPredicateBuilderComponent.filters.equals,
			],
			in: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.inFilter,
				SqlPredicateBuilderComponent.filters.equals,
			],
			enum: [
				SqlPredicateBuilderComponent.filters.unfiltered,
				SqlPredicateBuilderComponent.filters.inFilter,
				SqlPredicateBuilderComponent.filters.equals,
			]
		};

		const typeStrWithoutOptionalAnnotations = dataType.replace("?", "");

		if (typeStrWithoutOptionalAnnotations.includes("[")) {
			return [];
		} else if (typeStrWithoutOptionalAnnotations.includes("enum")) {
			return filterMappings.enum;
		} else return filterMappings[typeStrWithoutOptionalAnnotations] || [];
	}



	constructor(props) {
		super(props);

		this.state = {
			filters: SqlPredicateBuilderComponent.getFiltersForDataType(props.column.type),
			selectedFilterIdx: 0,
		};
	}

	onFilterChanged(e) {
		this.setState({
			selectedFilterIdx: e.target.value
		});
	}

	onFilterValueChanged(newFilterVal) {
		this.props.onNewFilter(newFilterVal);
	}

	renderFilterOption(filter, i) {
		return <option key={i} value={i}>{filter.name}</option>;
	}

	renderFilters() {
		const filterComponentCtor = this.state.filters[this.state.selectedFilterIdx].ctor;

		const selectedFilterComponent =
			React.createElement(filterComponentCtor, {
				column: this.props.column,
				onFilterChanged: this.onFilterValueChanged.bind(this),
			}, null);

		return (
			<div>
				<select className="filter-selector"
								onChange={this.onFilterChanged.bind(this)}>
					{this.state.filters.map(this.renderFilterOption.bind(this))}
				</select>
				{selectedFilterComponent}
			</div>
		);
	}

  render() {
		return this.state.filters.length > 0 ?
			this.renderFilters() : <span>Cannot filter</span>;
  }
}
