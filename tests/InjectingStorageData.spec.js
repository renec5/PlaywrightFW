const { test, expect } = require("@playwright/test");
let webContext;

test.beforeAll(async ({ browser })=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseURL = "https://www.rahulshettyacademy.com/client";
    const email = "evilsnake_@hotmail.com";
    // const context = await browser.newContext();
    // const page = await context.newPage();
    await page.goto(baseURL);
    const usernameField = page.locator("input#userEmail");
    const passwordField = page.locator("input#userPassword");
    const signInBtn = page.locator("input#login");

    await usernameField.type(email);
    await passwordField.fill("1983Rene@");
    await signInBtn.click();
    //console.log(await products.first().textContent());
    /* 
    This works only for microservices web pages, we can check that
    by opening the F12 inspection tool and then click to Network -> Fecht/XHR
    section, if we do see loading elements this means it microservices based web page
    and we can use this method of waitForLoadState('networkidle')
    */
    await page.waitForLoadState('networkidle');

    /*
     * This 2 lines below the first one, saves in cookies.json all 
     * login data/cookies so that we can use it in further tests to
     * bypass login process.
     * Second line creates a new browser.newContext using this cookies
     * so than we ca use them when opening pages again and bypass the
     * login process
     */
    await context.storageState({path: "cookies.json"});
    webContext = await browser.newContext({storageState: "cookies.json"});
});

test("Injecting login data from previous created json", async ()=>{
    const baseURL = "https://www.rahulshettyacademy.com/client";
    const email = "evilsnake_@hotmail.com";
    const page = await webContext.newPage({storageState: "cookies.json"});
    await page.goto(baseURL);
    const products = page.locator("div.card-body");
    const cartBtn = page.locator("button[routerlink='/dashboard/cart']");
    const productToAdd = "adidas original";
    const productAddedRoot = page.locator("div.cart");
    const productAdded = page.locator("h3:has-text('adidas original')");
    const checkoutBtn = page.locator("div.subtotal button");
    const emailLabel = page.locator("label[type='text']");
    const countryDropdown = page.locator("[placeholder='Select Country']");
    const countryOptions = page.locator("section.ta-results button");
    const placeOrderBtn = page.locator("a.action__submit");
    const orderThanksMsg = page.locator("h1.hero-primary");
    const orderEnteredId = page.locator("label.ng-star-inserted");
    const ordersTabBtn = page.locator("button[routerlink='/dashboard/myorders']");
    const rowOrdersId = page.locator("tbody tr.ng-star-inserted");

    //console.log(await products.first().textContent());
    /* 
    This works only for microservices web pages, we can check that
    by opening the F12 inspection tool and then click to Network -> Fecht/XHR
    section, if we do see loading elements this means it microservices based web page
    and we can use this method of waitForLoadState('networkidle')
    */
    await page.waitForLoadState('networkidle');
    console.log(await products.locator("b").allTextContents());

    for(let i = 0; i < await products.count(); i++){
        if (await products.nth(i).locator("b").textContent() === productToAdd){
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await Promise.all([
        page.waitForLoadState('networkidle'),
        cartBtn.click()
    ]);
    // This is only to wait for elements to be loaded
    await page.locator("div.cart li").first().waitFor();
    await expect(await productAdded.isVisible()).toBeTruthy();
    const productAddedName = await productAddedRoot.locator("h3").textContent();
    const productPrice = (await productAddedRoot.locator("p").nth(1).textContent()).split("$")[1].trim();
    const productId = await productAddedRoot.locator("p").first().textContent();
    await console.log({productId});
    await checkoutBtn.click();

    await countryDropdown.type("ind", {dealy: 100});
    await countryOptions.first().waitFor();
    for(let i = 0; i < await countryOptions.count(); i++){
        const country = (await countryOptions.nth(i).textContent()).trim();
        if (country === "India"){
            await countryOptions.nth(i).click();
            break;
        }
    }
    console.log(await emailLabel.textContent());
    expect(await emailLabel.textContent()).toEqual(email);
    await expect(emailLabel).toHaveText(email);
    await placeOrderBtn.click();

    await expect(orderThanksMsg).toHaveText(" Thankyou for the order. ");
    const orderId = (await orderEnteredId.textContent()).split("|")[1].trim();
    await console.log({orderId});

    await ordersTabBtn.click();
    await rowOrdersId.first().waitFor();
    // await page.pause();
    for (let i = 0; i < await rowOrdersId.count(); i++){
        let orderRowId = (await rowOrdersId.nth(i).locator("th").textContent()).trim();
        console.log({ orderRowId, orderId});
        if (orderRowId === orderId){
            // Commented line below works well also, but we need to avoid text=someText
            // await rowOrdersId.nth(i).locator("text=View").click();
            await rowOrdersId.nth(i).locator("button.btn-primary").click();
            break;
        }
    }

    await expect(page.locator("div.email-title")).toHaveText(" order summary ");
});
