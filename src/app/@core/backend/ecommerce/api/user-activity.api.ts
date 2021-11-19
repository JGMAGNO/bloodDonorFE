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
export class UserActivityApi {

  private readonly apiController: string = 'user-activity';

  constructor(private api: HttpService) {}

  list(period: string): Observable<any> {
    const params = new HttpParams()
      .set('date', `${period}`);

    return this.api.get(this.apiController, { params });
  }
}
