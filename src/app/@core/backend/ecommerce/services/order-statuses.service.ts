/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderStatusesApi } from '../api/order-statuses.api';
import { OrderStatusData } from '../../../interfaces/ecommerce/order-status';

@Injectable()
export class OrderStatusesService implements OrderStatusData {

  constructor(private api: OrderStatusesApi) { }

  list(): Observable<string[]> {
    return this.api.list();
  }
}
