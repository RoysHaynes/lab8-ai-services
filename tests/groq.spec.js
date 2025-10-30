import { test, expect } from '@playwright/test';

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

test('Groq provider shows mocked reply', async ({ page }) => {
    // Mock the Groq API before navigation
    await page.route(ENDPOINT, async (route) => {
        const mock = {
            id: 'mock-1',
            choices: [{ index: 0, message: { role: 'assistant', content: '(mock) Hi from Groq!' } }],
        };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mock) });
    });

    // Preload provider + fake key
    await page.addInitScript(() => {
        localStorage.setItem('groq_Key', 'TEST_KEY');
        localStorage.setItem('chat_provider', 'groq');
    });

    await page.goto('/');

    const provider = page.locator('#provider-select');
    await expect(provider).toHaveValue('groq');

    const input = page.locator('.chat-input input');
    const send = page.locator('.chat-input button[type="submit"]');
    await input.fill('ping');
    await send.click();

    const last = page.locator('.chat-body article').nth(-1);
    await expect(last).toHaveClass(/bot-messages/);
    await expect(last.locator('p')).toHaveText('(mock) Hi from Groq!');
});
