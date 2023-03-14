const { test, expect } = require("@playwright/test")



    test("First test", async ({ browser, page })=>{
        const baseURL = "https://www.rahulshettyacademy.com/loginpagePractise/";
        /*
        like cookies or other specific things, we can pass "page" fixtures
        and call directly page.goto(url), it will create an automatic context
        and add a new page to the context
        */
        // const context = await browser.newContext();
        // const page = await context.newPage();
        const usernameField = page.locator("input#username");
        const passwordField = page.locator("input#password");
        const signInBtn = page.locator("input#signInBtn");
        await page.goto(baseURL);
        console.log(await page.title());
        await expect(await page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
        await usernameField.type("rahulshettyacadem");
        await passwordField.type("learning");
        await signInBtn.click();
        const errorMsg = await page.locator("div[style='display: block;']").textContent();
        await expect(errorMsg).toEqual("Incorrect username/password.");
        await expect(page.locator("div[style='display: block;']")).toHaveText("Incorrect username/password.")
        await usernameField.fill("");
        await usernameField.fill("rahulshettyacademy");
        /*
        with this Promise.all ([command lines ]) we can wait for next page to load
        completely before performing any action when page is not microservices based page
        we need to pass the commands into the list without await for it to work
        */
        await Promise.all(
            [
                page.waitForNavigation(),
                signInBtn.click()
            ]
        );
        
        // Getting 1 element out of multiple elements found with locator
        //console.log(await page.locator("div.card-body a").first().textContent());
        //console.log(await page.locator("div.card-body a").nth(1).textContent());
        console.log(await page.locator("div.card-body a").allTextContents());
    });

    test("Second test", async ({ browser, page })=>{
        const baseURL = "https://www.rahulshettyacademy.com/loginpagePractise/";
        await page.goto(baseURL);
        const selector = page.locator("select.form-control");
        await selector.selectOption("teach");
        const userRadioBtn = page.locator("span.checkmark").last();
        const termsCheckbox = page.locator("input#terms");
        const documentsBlink = page.locator("a[href*=documents-request]");
        await userRadioBtn.click();
        await page.locator("#okayBtn").click();
        console.log(await userRadioBtn.isChecked());
        await expect(await userRadioBtn).toBeChecked();
        await termsCheckbox.click();
        await expect(await termsCheckbox).toBeChecked();
        await termsCheckbox.uncheck();
        await expect(await termsCheckbox.isChecked()).toBeFalsy();
        await expect(await documentsBlink).toHaveAttribute("class", "blinkingText");
        // await page.pause();

    });

    test("Child Windows handling", async ( { browser } )=>{
        /*
        For handling new tabs we need to create context and page independently
        for this to work, we need to pass the waitForEvent on the Promise.all
        so when it clicks on the element and opens the new tab it will wait for
        the page to load completely and will return the new tab DOM/Info into the 
        [newPage] which is a list of new tabs opened, to search on this new tab we
        need to do newPage.locator because this object is the one that contains 
        the new tab elements.
        */
        const baseURL = "https://www.rahulshettyacademy.com/loginpagePractise/";
        const context = await browser.newContext();
        const page = await context.newPage();
        const usernameField = page.locator("input#username");
        await page.goto(baseURL);
        const documentBlinkLink = page.locator("a[href*=documents-request]");
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            documentBlinkLink.click(),
        ]);
        const msg = await newPage.locator("p.red").textContent();
        const domain = msg.split("@")[1].split(" ")[0];
        await console.log({msg});
        console.log({domain});
        await usernameField.type(domain);
    });

    
