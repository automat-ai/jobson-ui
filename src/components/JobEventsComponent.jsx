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
import Timestamp from "react-timestamp";
import {Helpers} from "../Helpers";
import {Timeline, TimelineEvent} from 'react-event-timeline';

export class JobEventsComponent extends React.Component {

	render() {
		return (
			<Timeline>
				{this.props.timestamps.map(this.renderTimestamp)}
			</Timeline>
		);
	}

	renderTimestamp(timestamp, i) {
		return (
			<TimelineEvent title={`Status changed to ${timestamp.status}`}
										 createdAt={<Timestamp time={timestamp.time} format='ago' />}
			               icon={<i />}
										 key={i}
			               iconColor={Helpers.jobStatusColor(timestamp.status)}>
				{timestamp.message}
			</TimelineEvent>
		);
	}
}
