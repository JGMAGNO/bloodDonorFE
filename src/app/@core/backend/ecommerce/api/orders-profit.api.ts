/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../common/api/http.service';

@Injectable()
export class OrdersProfitApi {

  private readonly apiController: string = 'orders-profit';

  constructor(private api: HttpService) {}

  getProfitInfo(): Observable<any> {
    return this.api.get(`${this.apiController}/summary`);
  }

  getProfitYear(): Observable<any> {
    return this.api.get(this.apiController);
  }

  getProfitMonth(): Observable<any> {
    return this.api.get(`${this.apiController}/short`);
  }
}
