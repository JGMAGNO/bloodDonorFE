/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersApi } from '../api/orders.api';
import { OrderData, Order } from '../../../interfaces/ecommerce/orders';
import { GridData } from '../../../interfaces/common/gridData';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';

@Injectable()
export class OrdersService implements OrderData {

  constructor(private api: OrdersApi) { }

  get gridDataSource(): DataSource {
    return this.api.ordersDataSource;
  }

  list(pageNumber: number = 1, pageSize: number = 10): Observable<GridData<Order>> {
    return this.api.list(pageNumber, pageSize);
  }

  get(id: number): Observable<Order> {
    return this.api.get(id);
  }

  create(order: any): Observable<Order> {
    return this.api.add(order);
  }

  update(order: any): Observable<Order> {
    return this.api.update(order);
  }

  delete(id: number): Observable<boolean> {
    return this.api.delete(id);
  }
}
