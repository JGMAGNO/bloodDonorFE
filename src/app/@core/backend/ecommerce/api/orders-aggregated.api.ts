/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../../common/api/http.service';

@Injectable()
export class OrdersAggregatedApi {

  private readonly apiController: string = 'orders-aggregated';

  constructor(private api: HttpService) {}

  getSummary(): Observable<any> {
    return this.api.get(`${this.apiController}/summary`);
  }

  getStatisticsCount(aggregation: string): Observable<any> {
    const params = new HttpParams()
      .set('aggregation', `${aggregation}`);

    return this.api.get(this.apiController, { params });
  }

  getStatisticsProfit(aggregation: string): Observable<any> {
    const params = new HttpParams()
      .set('aggregation', `${aggregation}`);

    return this.api.get(`${this.apiController}/profit`, { params });
  }

  getCountriesCategoriesData(countryCode: string): Observable<any[]> {
    const params = new HttpParams()
      .set('countryCode', `${countryCode}`);

    return this.api.get(`${this.apiController}/country`, { params });
  }
}
