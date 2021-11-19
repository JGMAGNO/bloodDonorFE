/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderData, Order} from '../../../@core/interfaces/ecommerce/orders';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Country} from '../../../@core/interfaces/common/countries';
import {NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {DOUBLE_PATTERN} from '../../../@auth/components';
import {Subject} from 'rxjs';

enum OrderMode {
  EDIT = 'Edit',
  ADD = 'Add',
}

@Component({
  selector: 'ngx-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;

  countries: Country[];
  orderTypes: string[];
  orderStatuses: string[];
  mode: OrderMode;
  order: Order;

  protected readonly unsubscribe$ = new Subject<void>();

  get name() {
    return this.orderForm.get('name');
  }

  get value() {
    return this.orderForm.get('sum').get('value');
  }

  get date() {
    return this.orderForm.get('date');
  }

  get type() {
    return this.orderForm.get('type');
  }

  get status() {
    return this.orderForm.get('status');
  }

  get countryId() {
    return this.orderForm.get('country').get('id');
  }

  constructor(private ordersService: OrderData,
              private router: Router,
              private route: ActivatedRoute,
              private toastrService: NbToastrService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initOrderForm();
    const id = this.route.snapshot.paramMap.get('id');
    this.loadOrderData(id);
    this.initOrdersData();

    if (this.order.id) {
      this.setViewMode(OrderMode.EDIT);
    } else {
      this.setViewMode(OrderMode.ADD);
    }

    if (this.order && !this.order.country.id) {
      // select first country
      this.order.country = this.countries[0];
    }
  }

  initOrdersData() {
    const orderData = this.route.snapshot.data.orderData;
    this.order = orderData.order;
    this.countries = orderData.countries;
    this.orderTypes = orderData.types;
    this.orderStatuses = orderData.statuses;
  }

  loadOrderData(id) {
    if (id) {
      this.ordersService.get(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((order) => {
          this.orderForm.setValue({
            id: order.id,
            name: order.name ? order.name : '',
            date: order.date ? new Date(order.date) : '',
            sum: {
              value: (order.sum && order.sum.value) ? this.order.sum.value : '',
            },
            type: order.type ? order.type : '',
            country: {
              id: (order.country && order.country.id) ? order.country.id : '',
              name: (order.country && order.country.name) ? order.country.name : '',
            },
            status: order.status ? order.status : '',
          });
          // this is a place for value changes handling
          // this.userForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {   });
        });
    }
  }

  initOrderForm() {
    this.orderForm = this.fb.group({
      id: this.fb.control(undefined),
      name: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      date: this.fb.control('', [Validators.required]),
      sum: this.fb.group({
        value: this.fb.control('', [Validators.required,
          Validators.min(1), Validators.max(99999), Validators.pattern(DOUBLE_PATTERN)]),
      }),
      type: this.fb.control('', [Validators.required]),
      country: this.fb.group({
        id: this.fb.control('', [Validators.required]),
        name: this.fb.control(''),
      }),
      status: this.fb.control('', [Validators.required]),
    });
  }

  save() {
    this.order = this.orderForm.value;
    this.order.sum.currency = 'USD';
    const orderDate: Date = this.order.date;

    // remove timezone shift
    this.order.date.setMinutes(orderDate.getMinutes() - orderDate.getTimezoneOffset());

    // binding goes by country id, but we need to update name as well
    this.order.country.name = this.countries.find(x => x.id === this.order.country.id).name;

    const observable = this.order.id
      ? this.ordersService.update(this.order)
      : this.ordersService.create(this.order);

    observable
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.toastrService.success('', `Item ${this.order.id ? 'updated' : 'created'}!`);
        this.back();
      });
  }

  back() {
    this.router.navigate(['/pages/orders/list']);
  }

  setViewMode(viewMode: OrderMode) {
    this.mode = viewMode;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
