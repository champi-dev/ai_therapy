import { test, expect } from '@playwright/test';

test.describe('AI Therapy Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Therapy/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator("text=Hi, I'm here to listen")).toBeVisible();

    await page.screenshot({
      path: 'tests/screenshots/homepage.png',
      fullPage: true,
    });
  });

  test('should toggle dark mode', async ({ page }) => {
    const darkModeButton = page.getByLabel('Toggle dark mode');

    await page.screenshot({ path: 'tests/screenshots/light-mode.png' });

    await darkModeButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.screenshot({ path: 'tests/screenshots/dark-mode.png' });

    await darkModeButton.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should send and receive messages', async ({ page }) => {
    const input = page.locator('textarea[placeholder="Type your thoughts..."]');
    const sendButton = page.getByLabel('Send message');

    await input.fill('Hello, I need someone to talk to');
    await page.screenshot({ path: 'tests/screenshots/typing-message.png' });

    await sendButton.click();

    await expect(
      page.locator('text=Hello, I need someone to talk to')
    ).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/message-sent.png' });

    await expect(page.locator('.animate-wave').first()).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/typing-indicator.png' });

    await page.waitForTimeout(5000);

    const messages = page.locator('[class*="rounded-bl"]');
    await expect(messages).toHaveCount(1);
    await page.screenshot({
      path: 'tests/screenshots/conversation.png',
      fullPage: true,
    });
  });

  test('should disable input while loading', async ({ page }) => {
    const input = page.locator('textarea[placeholder="Type your thoughts..."]');
    const sendButton = page.getByLabel('Send message');

    await input.fill('Test message');
    await sendButton.click();

    await expect(input).toBeDisabled();
    await expect(sendButton).toBeDisabled();
  });

  test('should show session timer', async ({ page }) => {
    await expect(page.locator('text=Session: 00:00')).toBeVisible();

    await page.waitForTimeout(2000);

    await expect(page.locator('text=Session: 00:02')).toBeVisible();
  });

  test('should persist messages on reload', async ({ page }) => {
    const input = page.locator('textarea[placeholder="Type your thoughts..."]');
    const sendButton = page.getByLabel('Send message');

    await input.fill('Remember this message');
    await sendButton.click();

    await expect(page.locator('text=Remember this message')).toBeVisible();

    await page.reload();

    await expect(page.locator('text=Remember this message')).toBeVisible();
  });

  test('should handle quick actions', async ({ page }) => {
    const thoughtCheckButton = page.locator(
      'button:has-text("💭 Thought Check")'
    );
    await expect(thoughtCheckButton).toBeVisible();

    const setGoalButton = page.locator('button:has-text("🎯 Set Goal")');
    await expect(setGoalButton).toBeVisible();

    const breatheButton = page.locator('button:has-text("🌊 Breathe")');
    await expect(breatheButton).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Therapy')).toBeHidden();

    await page.setViewportSize({ width: 1440, height: 900 });

    await expect(page.locator('text=Therapy')).toBeVisible();
  });
});
