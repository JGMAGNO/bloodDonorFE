/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfitBarAnimationChartData } from '../../../interfaces/ecommerce/profit-bar-animation-chart';
import { ChartData } from '../../../interfaces/common/chart';
import { OrdersProfitApi } from '../api/orders-profit.api';

@Injectable()
export class ProfitBarAnimationChartService extends ProfitBarAnimationChartData {
  constructor(private api: OrdersProfitApi) {
    super();
  }

  getChartData(): Observable<ChartData> {
    return this.api.getProfitYear()
      .pipe(map(data => {
        return {
          chartLabel: data.chartLabel,
          axisXLabels: data.axisXLabels,
          linesData: data.lines.map(item => item.values),
          legend: data.lines.map(item => item.type),
        };
      }));
  }
}
