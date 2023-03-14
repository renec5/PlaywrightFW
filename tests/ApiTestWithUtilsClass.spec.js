const { test, request, expect } = require("@playwright/test");
const { APIUtils } = require("./utils/APIUtils");
const loginPayload = {userEmail:"evilsnake_@hotmail.com",userPassword:"1983Rene@"};
const orderPayload = {orders:[{country:"India",productOrderedId:"6262e990e26b7e1a10e89bfa"}]};
let response;

test.beforeAll(async ()=>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    /*
     * This will login and place the order through API, we do not need
     * the UI to login and place the order, once we login and create the order
     * on the test section we will inject the token before navigating to the URL
     * to avoid normal username/password authentication. 
    */
    response = await apiUtils.createOrder(orderPayload);
});

test.beforeEach(async ()=>{

});

test.only("API Test", async ({ page })=>{
    // This function will inject token to current session to skip login 
    // and login through API
    await page.addInitScript(value => {
        window.localStorage.setItem("token", value)
    }, response.token);
    const baseURL = "https://www.rahulshettyacademy.com/client";
    await page.goto(baseURL);
    const ordersTabBtn = page.locator("button[routerlink='/dashboard/myorders']");
    const rowOrdersId = page.locator("tbody tr.ng-star-inserted");

    await ordersTabBtn.click();
    await rowOrdersId.first().waitFor();
    // await page.pause();
    for (let i = 0; i < await rowOrdersId.count(); i++){
        let orderRowId = (await rowOrdersId.nth(i).locator("th").textContent()).trim();
        console.log( orderRowId, response.orderId);
        if (orderRowId === response.orderId){
            // Commented line below works well also, but we need to avoid text=someText
            // await rowOrdersId.nth(i).locator("text=View").click();
            await rowOrdersId.nth(i).locator("button.btn-primary").click();
            break;
        }
    }

    await expect(page.locator("div.email-title")).toHaveText(" order summary ");
});