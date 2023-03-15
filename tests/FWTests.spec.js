const { test, expect, request } = require('@playwright/test');
const { CartPage } = require('../pages/CartPage');
const { LoginPage } = require('../pages/LoginPage');
const { OrdersPage } = require('../pages/OrdersPage');
const { OrdersPlacedPage } = require('../pages/OrdersPlacedPage');
const { PlaceOrderPage } = require('../pages/PlaceOrderPage');
const { ShoppingPage } = require("../pages/ShoppingPage");
const { APIUtils } = require('./utils/APIUtils');
const data = JSON.parse(JSON.stringify(require('../data.json')));
const loginPayload = {userEmail:"evilsnake_@hotmail.com",userPassword:"1983Rene@"};
const orderPayload = {orders:[{country:"India",productOrderedId:"6262e990e26b7e1a10e89bfa"}]};
let response;
let apiContext;

test.beforeEach(async ({ page })=>{
    // await page.goto(data.baseURL);
    apiContext = await request.newContext();
});

test("valid Login", async ({ page })=>{
    await page.goto(data.baseURL);
    const loginPage = new LoginPage(page);
    const shoppingPage = new ShoppingPage(page);
    const cartPage = new CartPage(page);
    const placeOrderPage = new PlaceOrderPage(page);
    await loginPage.login(data.username, data.password);
    await expect(await loginPage.validateLoginSuccessfull()).toBeTruthy();
});

test("Place order", async ({ page })=>{
    await page.goto(data.baseURL);
    const loginPage = new LoginPage(page);
    const shoppingPage = new ShoppingPage(page);
    const cartPage = new CartPage(page);
    const placeOrderPage = new PlaceOrderPage(page);
    const ordersPlacedPage = new OrdersPlacedPage(page);
    await loginPage.login(data.username, data.password);
    await shoppingPage.addProductToCart(data.productToAdd);
    await shoppingPage.goToCartPage();
    await cartPage.goToCheckout();
    await placeOrderPage.enterCountry("india");
    await placeOrderPage.placeOrder();
    await expect(await ordersPlacedPage.validateOrderPlaced()).toBeTruthy();
});

test("Placing order through API", async ({ page })=>{
    const shoppingPage = new ShoppingPage(page);
    const ordersPage = new OrdersPage(page);
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
    await page.addInitScript(value => {
        window.localStorage.setItem("token", value)
    }, response.token);
    await page.goto(data.baseURL);
    await shoppingPage.goToOrders();
    await expect(ordersPage.validateOrder(response.orders)).toBeTruthy();
});

test("Delete orders", async ({page})=>{
    const shoppingPage = new ShoppingPage(page);
    const ordersPage = new OrdersPage(page);
    const apiUtils = new APIUtils(apiContext, loginPayload);
    const token = await apiUtils.getToken();
    await page.addInitScript(value => {
        window.localStorage.setItem("token", value)
    }, token);
    await page.goto(data.baseURL);
    await shoppingPage.goToOrders();
    await ordersPage.deleteOrders();
    await page.pause();
});