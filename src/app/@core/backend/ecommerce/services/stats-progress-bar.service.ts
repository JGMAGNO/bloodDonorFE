/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgressInfo, StatsProgressBarData } from '../../../interfaces/ecommerce/stats-progress-bar';
import { OrdersProfitApi } from '../api/orders-profit.api';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData {
  constructor(private api: OrdersProfitApi) {
    super();
  }

  private getDescription(trend: number): string {
    return trend > 0
      ? `Better than last week (${trend}%)`
      : `Worse than last week (${trend}%)`;
  }

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return this.api.getProfitInfo()
      .pipe(map(data => {
        return [
          {
            title: 'Today’s Profit',
            value: data.todayProfit.value,
            activeProgress: data.todayProfit.trend,
            description: this.getDescription(data.todayProfit.trend),
          },
          {
            title: 'New Orders',
            value: data.weekOrdersProfit.value,
            activeProgress: data.weekOrdersProfit.trend,
            description: this.getDescription(data.weekOrdersProfit.trend),
          },
          {
            title: 'New Comments',
            value: data.weekCommentsProfit.value,
            activeProgress: data.weekCommentsProfit.trend,
            description: this.getDescription(data.weekCommentsProfit.trend),
          },
        ];
      }));
  }
}
