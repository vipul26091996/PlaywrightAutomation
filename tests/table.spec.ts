import { test, expect, Locator } from '@playwright/test';

test("find row and column of a value in BookTable", async ({ page }) => {
    let value: string = "MASTER IN JS";
    await page.goto("https://testautomationpractice.blogspot.com/");
    await expect(page).toHaveTitle("Automation Testing Practice");
    const bookTable: Locator = await page.locator('table[name="BookTable"]');
    const tableRows: Locator = await bookTable.locator('tr');
    const tableColumns: Locator = await tableRows.first().locator('th');
    for (let i = 0; i < await tableRows.count(); i++) {
        if (i == 0) { continue; }
        for (let j = 0; j < await tableColumns.count(); j++) {
            const cellValue: string | null = await tableRows.nth(i).locator('td').nth(j).textContent();
            if (cellValue === value) {
                console.log(`Value "${value}" found at row ${i}, column ${j + 1}`);
            }
        }
    }
})

test("find value of webbrowser in Dynamic Table", async ({ page }) => {
    let browser: string = "Chrome";
    let attribute: string = "Network (Mbps)";
    let attributeValue: string | null = null;
    let find: boolean = false;
    await page.goto("https://testautomationpractice.blogspot.com/");
    const dynamicTable: Locator = await page.locator('#taskTable');
    const tableRows: Locator = await dynamicTable.locator('tr');
    const tableColumns: Locator = await tableRows.first().locator('th');
    for (let i = 0; i < await tableRows.count(); i++) {
        if (i == 0) { continue; }
        if (await tableRows.nth(i).locator('td').nth(0).textContent() === browser) {
            for (let j = 0; j < await tableColumns.count(); j++) {
                if (await tableColumns.nth(j).textContent() === attribute) {
                    attributeValue = await tableRows.nth(i).locator('td').nth(j).textContent();
                    console.log(`Value of "${attribute}" for browser "${browser}" is: ${attributeValue}`);
                    find = true;
                    break;
                }
            }
        }
    }
    if (!find) {
        console.log(`Value of "${attribute}" for browser "${browser}" not found`);
    }
    console.log(await page.locator("#displayValues p strong").nth(2).textContent());
    expect(await page.locator("#displayValues p strong").nth(2).textContent()).toStrictEqual(attributeValue);
    await page.waitForTimeout(20000);
})

test.only("select the checkbox in pagination table", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("https://testautomationpractice.blogspot.com/");

    let pagination: Locator = page.locator('#pagination a');
    for (let p = 0; p < await pagination.count(); p++) {
        if (await pagination.nth(p).getAttribute('class') !== 'active') { await pagination.nth(p).click(); }
        let productTable: Locator = page.locator('#productTable');
        let tableRows: Locator = productTable.locator('tr');
        let tableColumns: Locator = tableRows.locator('th');
        for (let i = 1; i < await tableRows.count(); i++) {
            for (let j = 0; j < await tableColumns.count() - 1; j++) {
                console.log(`Row ${i}, Column ${j}: ${await tableRows.nth(i).locator('td').nth(j).textContent()}`);

            }
            const priceText: string | null = await tableRows.nth(i).locator('td').nth(2).textContent();
            if (priceText !== null) {
                const price: number = parseFloat(priceText.replace('$', ''));
                console.log(`Price of product in row ${i}: ${price}`);
                if (price < 10) {
                    await tableRows.nth(i).locator('td').nth(await tableColumns.count() - 1).locator('input[type="checkbox"]').check();
                    await page.waitForTimeout(3000);
                }
            }
        }
    }
    await page.waitForTimeout(20000);
})