const { test, expect, request } = require("@playwright/test");
const loginPayload = {userEmail:"evilsnake_@hotmail.com",userPassword:"1983Rene@"};
const orderPayload = {orders:[{country:"India",productOrderedId:"6262e990e26b7e1a10e89bfa"}]};
let token;
let orderId;

test.beforeAll(async ()=>{
    const apiLoginURI = "https://www.rahulshettyacademy.com/api/ecom/auth/login";
    const apiOrderURI = "https://www.rahulshettyacademy.com/api/ecom/order/create-order";
    const apiContext = await request.newContext();
    const loginResponse = (await apiContext).post(apiLoginURI,
        {
            data: loginPayload
        });
    await expect((await loginResponse).ok()).toBeTruthy();
    await console.log((await loginResponse).status());
    const loginResponseJson = (await loginResponse).json();
    await console.log(await loginResponseJson);
    token = (await loginResponseJson).token;
    await console.log({token});

    // Placing order through API
    const orderResponse = (await apiContext).post(apiOrderURI, {
        data: orderPayload,
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        }
    });

    await expect((await orderResponse).ok()).toBeTruthy();
    const orderResponseJson = (await orderResponse).json();
    await console.log(await orderResponseJson);
    orderId = (await orderResponseJson).orders[0];
    await console.log((await orderResponseJson).orders[0]);

});

test.beforeEach(async ()=>{

});

test("API Test", async ({ page })=>{
    // This function will inject token to current session to skip login 
    // and login through API
    await page.addInitScript(value => {
        window.localStorage.setItem("token", value)
    }, token);
    const baseURL = "https://www.rahulshettyacademy.com/client";
    const email = "evilsnake_@hotmail.com";
    // // const context = await browser.newContext();
    // // const page = await context.newPage();
    await page.goto(baseURL);
    const usernameField = page.locator("input#userEmail");
    const passwordField = page.locator("input#userPassword");
    const signInBtn = page.locator("input#login");
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

    // await usernameField.type(email);
    // await passwordField.fill("1983Rene@");
    // await signInBtn.click();
    //console.log(await products.first().textContent());
    /* 
    This works only for microservices web pages, we can check that
    by opening the F12 inspection tool and then click to Network -> Fecht/XHR
    section, if we do see loading elements this means it microservices based web page
    and we can use this method of waitForLoadState('networkidle')
    */
    // await page.waitForLoadState('networkidle');
    // console.log(await products.locator("b").allTextContents());
// 
    // for(let i = 0; i < await products.count(); i++){
    //     if (await products.nth(i).locator("b").textContent() === productToAdd){
    //         await products.nth(i).locator("text= Add To Cart").click();
    //         break;
    //     }
    // }
    // await Promise.all([
    //     page.waitForLoadState('networkidle'),
    //     cartBtn.click()
    // ]);
    // // This is only to wait for elements to be loaded
    // await page.locator("div.cart li").first().waitFor();
    // await expect(await productAdded.isVisible()).toBeTruthy();
    // const productAddedName = await productAddedRoot.locator("h3").textContent();
    // const productPrice = (await productAddedRoot.locator("p").nth(1).textContent()).split("$")[1].trim();
    // const productId = await productAddedRoot.locator("p").first().textContent();
    // await console.log({productId});
    // await checkoutBtn.click();
// 
    // await countryDropdown.type("ind", {dealy: 100});
    // await countryOptions.first().waitFor();
    // for(let i = 0; i < await countryOptions.count(); i++){
    //     const country = (await countryOptions.nth(i).textContent()).trim();
    //     if (country === "India"){
    //         await countryOptions.nth(i).click();
    //         break;
    //     }
    // }
    // console.log(await emailLabel.textContent());
    // expect(await emailLabel.textContent()).toEqual(email);
    // await expect(emailLabel).toHaveText(email);
    // await placeOrderBtn.click();
// 
    // await expect(orderThanksMsg).toHaveText(" Thankyou for the order. ");
    // orderId = (await orderEnteredId.textContent()).split("|")[1].trim();
    // await console.log({orderId});

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