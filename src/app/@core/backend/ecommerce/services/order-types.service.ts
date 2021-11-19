/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderTypesApi } from '../api/order-types.api';
import { OrderTypeData } from '../../../interfaces/ecommerce/order-type';

@Injectable()
export class OrderTypesService implements OrderTypeData {

  constructor(private api: OrderTypesApi) { }

  list(): Observable<string[]> {
    return this.api.list();
  }
}
