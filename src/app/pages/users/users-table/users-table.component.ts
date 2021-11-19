/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy } from '@angular/core';

import { takeWhile } from 'rxjs/operators';
import { UserData } from '../../../@core/interfaces/common/users';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import {
  NgxFilterByNumberComponent,
} from '../../../@components/custom-smart-table-components/filter-by-number/filter-by-number.component';

@Component({
  selector: 'ngx-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],

})
export class UsersTableComponent implements OnDestroy {

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
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      login: {
        title: 'Blood Type',
        type: 'string',
      },
      email: {
        title: 'Cellphone Number',
        type: 'string',
      },
      age: {
        title: 'Age',
        filter: {
          type: 'custom',
          component: NgxFilterByNumberComponent,
        },
      },
      street: {
        title: 'House# / Street / Brgy.',
        type: 'string',
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.address, element.address.street),
      },
      city: {
        title: 'City and Province',
        type: 'string',
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.address, element.address.city),
      },
      zipcode: {
        title: 'Zip Code',
        type: 'number',
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.address, element.address.zipCode),
      },
      role: {
        title: '',
        hide: true,
        type: 'string',
      },
    },
  };

  source: DataSource;

  constructor(private usersService: UserData, private router: Router,
    private toastrService: NbToastrService) {
    this.loadData();
  }

  loadData() {
    this.source = this.usersService.gridDataSource;
    this.source.setFilter( [ { field: 'role', search: 'user' } ]);
  }

  createUser() {
    this.router.navigate(['/pages/users/add/']);
  }

  onEdit($event: any) {
    this.router.navigate([`/pages/users/edit/${$event.data.id}`]);
  }

  onDelete($event: any) {
    if (confirm('Are you sure wants to delete item?') && $event.data.id) {
      this.usersService
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
