const { OrdersPage } = require("./OrdersPage");

class ShoppingPage{

    constructor (page){
        this.page = page;
        this.cartBtn = page.locator("button[routerlink='/dashboard/cart']");
        this.products = page.locator("div.card-body");
        this.signOutBtn = page.locator("nav button").last();
        this.ordersBtn = page.locator("button[routerlink='/dashboard/myorders']");
    }

    async validateShoppingLandingPage(){
        await this.signOutBtn.waitFor({state: 'visible'});
        // await this.signOutBtn.isEnabled();
        return this.signOutBtn.isVisible();
        
    }

    async addProductToCart(productNameToAdd){
        for(let i = 0; i < await this.products.count(); i++){
            if (productNameToAdd == await this.products.nth(i).locator('b').textContent()){
                await this.products.nth(i).locator("button").nth(1).click();
            }
        }
    }

    async getAllProductNames(){
        productsNames = [];
        for(let i = 0; i < await this.products.count(); i++){
            productsNames.push(await this.products.nth(i).locator("b").textContent());
        }
        await console.log({productsNames});
        return productsNames;
    }

    async goToCartPage(){
        await this.cartBtn.click();
    }

    async goToOrders(){
        const ordersPage = new OrdersPage(this.page);
        await this.ordersBtn.click();
        await ordersPage.goBackToCartBtn.waitFor();
    }

}

module.exports = { ShoppingPage };