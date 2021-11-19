/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { forkJoin, of } from 'rxjs';
import { OrderTypeData } from '../../../@core/interfaces/ecommerce/order-type';
import { OrderStatusData } from '../../../@core/interfaces/ecommerce/order-status';
import { CountryData, Country } from '../../../@core/interfaces/common/countries';
import { map } from 'rxjs/operators';
import { OrderData, Order } from '../../../@core/interfaces/ecommerce/orders';

@Injectable()
export class OrderFormResolver implements Resolve<Observable<any>> {

  constructor(private ordersService: OrderData,
    private orderTypesService: OrderTypeData,
    private orderStatusesService: OrderStatusData,
    private countriesService: CountryData) {}

  resolve(route: ActivatedRouteSnapshot) {
    return forkJoin([  route.params.id ? this.ordersService.get(route.params.id) : of(this.getEmptyOrder()),
      this.orderTypesService.list(),
      this.orderStatusesService.list(),
      this.countriesService.list(),
      ]).pipe(map(([order, types, statuses, countries]: [Order, string[], string[], Country[]]) => {
      order.date = new Date(order.date);
      return {
        order,
        types,
        statuses,
        countries,
      };
    }));
  }

  private getEmptyOrder(): Order {
    return {
      id: undefined,
      country: { id: undefined, name: '' },
      date: new Date(),
      name: '',
      status: '',
      sum: { value: 0, currency: 'USD' },
      type: '',
    };
  }
}
