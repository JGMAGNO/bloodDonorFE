/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserActivityData, UserActive } from '../../../interfaces/ecommerce/user-activity';
import { UserActivityApi } from '../api/user-activity.api';

@Injectable()
export class UserActivityService extends UserActivityData {

  constructor(private api: UserActivityApi) {
    super();
  }

  getUserActivityData(period: string): Observable<UserActive[]> {
    return this.api.list(period)
      .pipe(map(data => data.map(item => {
        return {
          date: item.label,
          pagesVisitCount: item.pagesVisit,
          deltaUp: item.trend >= 0,
          newVisits: Math.floor(item.trend),
        };
      })));
  }
}
