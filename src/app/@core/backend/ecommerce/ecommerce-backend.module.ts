/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonBackendModule } from '../common/common-backend.module';

import { OrderTypesApi } from './api/order-types.api';
import { OrderStatusesApi } from './api/order-statuses.api';
import { OrdersApi } from './api/orders.api';
import { OrdersAggregatedApi } from './api/orders-aggregated.api';
import { OrdersProfitApi } from './api/orders-profit.api';
import { TrafficAggregatedApi } from './api/traffic-aggregated.api';
import { UserActivityApi } from './api/user-activity.api';


import { CountryOrderData } from '../../interfaces/ecommerce/country-order';
import { OrderTypeData } from '../../interfaces/ecommerce/order-type';
import { OrderStatusData } from '../../interfaces/ecommerce/order-status';
import { OrderData } from '../../interfaces/ecommerce/orders';
import { OrdersProfitChartData } from '../../interfaces/ecommerce/orders-profit-chart';
import { ProfitBarAnimationChartData } from '../../interfaces/ecommerce/profit-bar-animation-chart';
import { StatsBarData } from '../../interfaces/ecommerce/stats-bar';
import { StatsProgressBarData } from '../../interfaces/ecommerce/stats-progress-bar';
import { TrafficListData } from '../../interfaces/ecommerce/traffic-list';
import { UserActivityData } from '../../interfaces/ecommerce/user-activity';


import { CountryOrderService } from './services/country-order.service';
import { OrderTypesService } from './services/order-types.service';
import { OrderStatusesService } from './services/order-statuses.service';
import { OrdersService } from './services/orders.service';
import { OrdersProfitChartService } from './services/orders-profit-chart.service';
import { ProfitBarAnimationChartService } from './services/profit-bar-animation-chart.service';
import { StatsBarService } from './services/stats-bar.service';
import { StatsProgressBarService } from './services/stats-progress-bar.service';
import { TrafficListService } from './services/traffic-list.service';
import { UserActivityService } from './services/user-activity.service';

const API = [
  OrderTypesApi,
  OrderStatusesApi,
  OrdersApi,
  OrdersAggregatedApi,
  OrdersProfitApi,
  TrafficAggregatedApi,
  UserActivityApi,
];

const SERVICES = [
  { provide: CountryOrderData, useClass: CountryOrderService },
  { provide: OrderData, useClass: OrdersService },
  { provide: OrderStatusData, useClass: OrderStatusesService },
  { provide: OrderTypeData, useClass: OrderTypesService },
  { provide: OrdersProfitChartData, useClass: OrdersProfitChartService },
  { provide: ProfitBarAnimationChartData, useClass: ProfitBarAnimationChartService },
  { provide: StatsBarData, useClass: StatsBarService },
  { provide: StatsProgressBarData, useClass: StatsProgressBarService },
  { provide: TrafficListData, useClass: TrafficListService },
  { provide: UserActivityData, useClass: UserActivityService },
];

@NgModule({
  imports: [CommonModule, CommonBackendModule],
  exports: [CommonBackendModule],
})
export class EcommerceBackendModule {
  static forRoot(): ModuleWithProviders<EcommerceBackendModule> {
    return {
      ngModule: EcommerceBackendModule,
      providers: [
        ...API,
        ...SERVICES,
      ],
    };
  }
}
