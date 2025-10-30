import { test, expect } from '@playwright/test';

test('Eliza replies to a user message', async ({ page }) => {
    await page.goto('/');

    // Selects Eliza as the option
    const provider = page.locator('#provider-select');
    await provider.selectOption('Eliza (Local)');

    // Sends eliza a message
    const input = page.locator('.chat-input input');
    const send = page.locator('.chat-input button[type="submit"]');
    await input.fill('hello');
    await send.click();

    // Expect the counter to increment
    const messages = page.locator('.chat-body article');
    await expect(messages).toHaveCount(2, { timeout: 5000 });

    //expects bot reply
    const botMessage = messages.nth(1);
    await expect(botMessage).toHaveClass(/bot-messages/);
    await expect(botMessage.locator('p')).not.toHaveText('');
});
