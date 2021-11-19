/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrafficListData, TrafficListItem } from '../../../interfaces/ecommerce/traffic-list';
import { TrafficAggregatedApi } from '../api/traffic-aggregated.api';

@Injectable()
export class TrafficListService extends TrafficListData {

  constructor(private api: TrafficAggregatedApi) {
    super();
  }

  private getPercentedValue(first: number, second: number): number {
    return Math.floor(100 * first / (first + second));
  }

  getTrafficListData(period: string): Observable<TrafficListItem[]> {
    return this.api.getList(period)
      .pipe(map(data => data.map(item => {
        return {
            date: item.period,
            value: item.value,
            delta: {
              up: item.trend >= 0,
              value: Math.floor(item.trend),
            },
            comparison: {
              prevDate: item.comparison && item.comparison.previousPeriod,
              prevValue: item.comparison
                && this.getPercentedValue(item.comparison.previousValue, item.comparison.currentValue),
              nextDate: item.comparison && item.comparison.currentPeriod,
              nextValue: item.comparison
                && this.getPercentedValue(item.comparison.currentValue, item.comparison.previousValue),
            },
          };
        },
        )));
  }
}
