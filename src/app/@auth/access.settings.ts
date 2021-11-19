/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

export const authSettings = {
  guest: {
  },
  user: {
    parent: 'guest',
      view: ['current-user', 'orders'],
      edit: ['current-user', 'orders'],
  },
  admin: {
    parent: 'user',
      view: ['current-user', 'orders', 'users'],
      edit: ['current-user', 'orders', 'users'],
  },
};
