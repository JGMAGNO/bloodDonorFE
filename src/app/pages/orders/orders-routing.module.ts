/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrderComponent } from './order/order.component';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { OrderFormResolver } from './order/order.resolver';

const routes: Routes = [{
  path: '',
  component: OrdersComponent,
  children: [
    {
      path: 'list',
      component: OrdersTableComponent,
    },
    {
      path: 'edit/:id',
      component: OrderComponent,
      resolve: { orderData: OrderFormResolver },
    },
    {
      path: 'add',
      component: OrderComponent,
      resolve: { orderData: OrderFormResolver },
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {

}
