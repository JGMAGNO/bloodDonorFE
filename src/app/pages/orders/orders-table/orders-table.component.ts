/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy } from '@angular/core';

import { takeWhile } from 'rxjs/operators';
import { OrderData } from '../../../@core/interfaces/ecommerce/orders';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import {
  NgxFilterByNumberComponent,
} from '../../../@components/custom-smart-table-components/filter-by-number/filter-by-number.component';

@Component({
  selector: 'ngx-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./order-table.component.scss'],
})
export class OrdersTableComponent implements OnDestroy {

  private alive = true;

  settings = {
    mode: 'external',
    actions: {
      add: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      date: {
        title: 'Date',
        type: 'string',
        valuePrepareFunction: (cell, element) => {
          return new DatePipe('en-US').transform(element.date, 'dd/MM/yyyy');
        },
      },
      sum: {
        title: 'Amount',
        filter: {
          type: 'custom',
          component: NgxFilterByNumberComponent,
        },
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.sum, element.sum.value + ' ' + element.sum.currency),
      },
      type: {
        title: 'Type',
        type: 'string',
      },
      country: {
        title: 'Country',
        type: 'string',
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.country, element.country.name),
      },
      status: {
        title: 'Status',
        type: 'string',
      },
    },
  };

  source: DataSource;

  constructor(private ordersService: OrderData,
    private router: Router,
    private toastrService: NbToastrService) {
    this.source = this.ordersService.gridDataSource;
  }

  addOrder() {
    this.router.navigate(['/pages/orders/add/']);
  }

  onEdit($event: any) {
    this.router.navigate([`/pages/orders/edit/${$event.data.id}`]);
  }

  onDelete($event: any) {
    if (confirm('Are you sure wants to delete item?') && $event.data.id) {
      this.ordersService
        .delete($event.data.id)
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
          if (res) {
            this.toastrService.success('', 'Item deleted!');
            this.source.refresh();
          } else {
            this.toastrService.danger('', 'Something wrong.');
          }
        });
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private customDisplay(conditionValue: any, displayValue: string) {
    return conditionValue ? displayValue : '';
  }
}
