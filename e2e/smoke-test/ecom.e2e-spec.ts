/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { browser, by, element } from 'protractor';
import { testUserInit } from './common.test';


describe('Smoke Test for ECom Bundle', () => {
  beforeEach(testUserInit);

  it('ECom dashboard should be opened without errors', async () => {
    // just open the page and check there's no errors in log
    await browser.get(`${browser.baseUrl}/pages/dashboard`);
  });

  it('Orders List should be opened without errors', async () => {
    // just open the page and check there's no errors in log
    await browser.get(`${browser.baseUrl}/pages/orders/list`);

    // wait till orders are loaded
    browser.sleep(2 * 1000);

    // open first order in list and check there's no errors
    element(by.css('.ng2-smart-action-edit-edit')).click();

    // find anc click button (doesn't matter submit or back button)
    element(by.tagName('button')).click();
  });
});
