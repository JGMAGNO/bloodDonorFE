/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ChartData, ChartSummary } from '../../../interfaces/common/chart';
import { OrdersProfitChartData } from '../../../interfaces/ecommerce/orders-profit-chart';
import { OrdersAggregatedApi } from '../api/orders-aggregated.api';

@Injectable()
export class OrdersProfitChartService extends OrdersProfitChartData {
  constructor(private api: OrdersAggregatedApi) {
    super();
  }

  getOrderProfitChartSummary(): Observable<ChartSummary[]> {
    return this.api.getSummary()
      .pipe(map(data => {
        return [{
            title: 'Marketplace',
            value: data.marketplace,
          },
          {
            title: 'Last Month',
            value: data.lastMonth,
          },
          {
            title: 'Last Week',
            value: data.lastWeek,
          },
          {
            title: 'Today',
            value: data.today,
          }];
      }));
  }

  getOrdersChartData(aggregation: string): Observable<ChartData> {
    return this.api.getStatisticsCount(aggregation)
      .pipe(map((data: any) => {
        return {
          chartLabel: data.chartLabel,
          axisXLabels: data.axisXLabels,
          linesData: data.lines.map(item => item.values),
          legend: data.lines.map(item => item.type),
        };
      }));
  }

  getProfitChartData(aggregation: string): Observable<ChartData> {
    return this.api.getStatisticsProfit(aggregation)
      .pipe(map((data: any) => {
        return {
          chartLabel: data.chartLabel,
          axisXLabels: data.axisXLabels,
          linesData: data.lines.map(item => item.values),
          legend: data.lines.map(item => item.type),
        };
      }));
  }
}
