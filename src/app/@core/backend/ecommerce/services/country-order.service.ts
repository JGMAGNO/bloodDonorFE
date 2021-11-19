/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountryOrderData } from '../../../interfaces/ecommerce/country-order';
import { OrdersAggregatedApi } from '../api/orders-aggregated.api';
import { OrderTypesApi } from '../api/order-types.api';

@Injectable()
export class CountryOrderService extends CountryOrderData {

  constructor(private apiAggregated: OrdersAggregatedApi, private apiOrderTypes: OrderTypesApi) {
    super();
  }

  getCountriesCategories(): Observable<string[]> {
    return this.apiOrderTypes.list();
  }

  getCountriesCategoriesData(country: string): Observable<number[]> {
    return this.apiAggregated.getCountriesCategoriesData(country)
      .pipe(map(data => data.map(item => item.count)));
  }
}
