const { reloadApp } = require('detox-expo-helpers');

describe('Login flow', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('login to iNaturalist', async () => {
    // Check for the auth screen
    await expect(element(by.id('auth_screen'))).toBeVisible();
    // Check for the login button
    await expect(element(by.id('login_button'))).toBeVisible();
    // Press the login button
    await element(by.id('login_button')).tap();
  });

  it('skip login and set', async () => {
    // Check for the auth screen
    await expect(element(by.id('auth_screen'))).toBeVisible();
    // Check for the login button
    await expect(element(by.id('dev_skip_login'))).toBeVisible();
    // Press the login button
    await element(by.id('dev_skip_login')).tap();
    // Check for the entry screen
    await expect(element(by.id('entry_screen'))).toBeVisible();
    // Check for the settings header button
    await expect(element(by.id('header_settings_button'))).toBeVisible();
    // Press the settings header button
    await element(by.id('header_settings_button')).tap();
    // Check for the settings screen ad elements
    await expect(element(by.id('settings_screen'))).toBeVisible();
    await expect(element(by.id('filter_tab'))).toBeVisible();
    await expect(element(by.id('actions_tab'))).toBeVisible();
    // Press the actions tab
    await element(by.id('actions_tab')).tap();
    // Check for actions tab components
    await expect(element(by.id('subscribe_left'))).toBeVisible();
    await expect(element(by.id('subscribe_right'))).toBeVisible();
    await expect(element(by.id('subscribe_top'))).toBeVisible();
    // Press the unsubscribe to left and top buttons
    await element(by.id('subscribe_left')).tap();
    await element(by.id('subscribe_top')).tap();
    // Press the filter tab
    await element(by.id('filter_tab')).tap();

    // TODO: Should be a check for List.Accordion dropdown by ID?
    // Check for place dropdown by label
    await expect(element(by.label('by place = Europe'))).toBeVisible();
    // Press the place dropdown by label to open it
    await element(by.label('by place = Europe')).tap();
    // Check for Asia selection
    await expect(element(by.label('Asia').withAncestor(by.label('Asia')))).toBeVisible();
    // Press the Asia selection
    await element(by.label('Asia').withAncestor(by.label('Asia'))).tap();
    // Check that place dropdown label has changed
    await expect(element(by.label('by place = Asia'))).toBeVisible();
    // Press the place dropdown by label to close it
    await element(by.label('by place = Asia')).tap();

    // TODO: Should be a check for List.Accordion dropdown by ID?
    // Check for number photos dropdown by label
    await expect(element(by.label('by number photos = Infinity'))).toBeVisible();
    // Press the number photos dropdown by label to open it
    await element(by.label('by number photos = Infinity')).tap();
    // Check for 1 selection
    await expect(element(by.label('1').withAncestor(by.label('1')))).toBeVisible();
    // Press the 1 selection
    await element(by.label('1').withAncestor(by.label('1'))).tap();
    // Check that number photos dropdown label has changed
    await expect(element(by.label('by number photos = 1'))).toBeVisible();
    // Press the number photos dropdown by label to close it
    await element(by.label('by number photos = 1')).tap();

    // Navigate by back button
    await element(by.traits(['button'])).atIndex(0).tap();
    await expect(element(by.id('entry_screen'))).toBeVisible();
    // Go to swiper
    await expect(element(by.id('start_swiper'))).toBeVisible();
    await element(by.id('start_swiper')).tap();
  });
});
