/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {Observable, Subject} from 'rxjs';
import { takeUntil} from 'rxjs/operators';

import { NbToastrService } from '@nebular/theme';

import {User, UserData} from '../../../@core/interfaces/common/users';
import {EMAIL_PATTERN, NUMBERS_PATTERN} from '../../../@auth/components';
import {NbAuthOAuth2JWTToken, NbTokenService} from '@nebular/auth';
import {UserStore} from '../../../@core/stores/user.store';

export enum UserFormMode {
  VIEW = 'View',
  EDIT = 'Edit',
  ADD = 'Add',
  EDIT_SELF = 'EditSelf',
}

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  public showLast:boolean = false;
  public radioGroupValue:string = '1st'
  protected readonly unsubscribe$ = new Subject<void>();

  get medicalHistory() { return this.userForm.get('medicalHistory'); }

  get lastDonation() { return this.userForm.get('medicalHistory'); }

  get firstName() { return this.userForm.get('firstName'); }

  get lastName() { return this.userForm.get('lastName'); }

  get login() { return this.userForm.get('login'); }

  get email() { return this.userForm.get('email'); }

  get age() { return this.userForm.get('age'); }

  get street() { return this.userForm.get('address').get('street'); }

  get city() { return this.userForm.get('address').get('city'); }

  get zipCode() { return this.userForm.get('address').get('zipCode'); }

  mode: UserFormMode;
  setViewMode(viewMode: UserFormMode) {
    this.mode = viewMode;
  }

  constructor(private usersService: UserData,
              private router: Router,
              private route: ActivatedRoute,
              private tokenService: NbTokenService,
              private userStore: UserStore,
              private toasterService: NbToastrService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initUserForm();
    this.loadUserData();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      id: this.fb.control(''),
      role: this.fb.control(''),
      medicalHistory: this.fb.control(''),
      lastDonation: this.fb.control(''),
      firstName: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      login: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      age: this.fb.control('', [Validators.required, Validators.min(1),
        Validators.max(120), Validators.pattern(NUMBERS_PATTERN)]),
      email: this.fb.control('', [
        Validators.required,
      ]),
      address: this.fb.group({
        street: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
        city: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
        zipCode: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      }),

    });
  }

  get canEdit(): boolean {
    return this.mode !== UserFormMode.VIEW;
  }


  loadUserData() {
    const id = this.route.snapshot.paramMap.get('id');
    const isProfile = this.route.snapshot.queryParamMap.get('profile');
    if (isProfile) {
      this.setViewMode(UserFormMode.EDIT_SELF);
      this.loadUser();
    } else {
      if (id) {
        const currentUserId = this.userStore.getUser().id;
        this.setViewMode(currentUserId.toString() === id ? UserFormMode.EDIT_SELF : UserFormMode.EDIT);
        this.loadUser(id);
      } else {
        this.setViewMode(UserFormMode.ADD);
      }
    }
  }

  loadUser(id?) {
    const loadUser = this.mode === UserFormMode.EDIT_SELF
      ? this.usersService.getCurrentUser() : this.usersService.get(id);
    loadUser
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.radioGroupValue = user.donor ? user.donor : ''
        this.showLast = user.lastDonation ? true : false
        this.userForm.setValue({
          id: user.id ? user.id : '',
          role: user.role ? user.role : '',
          firstName: user.firstName ? user.firstName : '',
          lastName: user.lastName ? user.lastName : '',
          login: user.login ? user.login : '',
          age: user.age ? user.age : '',
          email: user.email,
          lastDonation: user.lastDonation ? user.lastDonation : '',
          medicalHistory: user.medicalHistory ? user.medicalHistory : '',
          address: {
            street: (user.address && user.address.street) ? user.address.street : '',
            city: (user.address && user.address.city) ? user.address.city : '',
            zipCode: (user.address && user.address.zipCode) ? user.address.zipCode : '',
          }
        });

        // this is a place for value changes handling
        // this.userForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {   });
      });
  }


  convertToUser(value: any): User {
    const user: User = value;
    return user;
  }

  save() {
    const user: User = this.convertToUser(this.userForm.value);
    user.role = 'user'
    user.donor = this.radioGroupValue
    console.log(user)
    let observable = new Observable<User>();
    if (this.mode === UserFormMode.EDIT_SELF) {
      this.usersService.updateCurrent(user).subscribe((result: any) => {
          this.tokenService.set(new NbAuthOAuth2JWTToken(result, 'email', new Date()));
          this.handleSuccessResponse();
        },
        err => {
          this.handleWrongResponse();
        });
    } else {
      observable = user.id
        ? this.usersService.update(user)
        : this.usersService.create(user);
    }

    observable
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.handleSuccessResponse();
      },
      err => {
      this.handleWrongResponse();
    });
  }

  handleSuccessResponse() {
    this.toasterService.success('', `Item ${this.mode === UserFormMode.ADD ? 'created' : 'updated'}!`);
    this.back();
  }

  handleWrongResponse() {
    this.toasterService.danger('', `This email has already taken!`);
  }

  back() {
    console.log(this.radioGroupValue)
    this.router.navigate(['/pages/users/list']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onChange(event:any) {
    if(event == '2nd') {
      this.showLast = true;
    } else {
      this.showLast = false;
    }
  }

}
