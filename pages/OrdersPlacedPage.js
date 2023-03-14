class OrdersPlacedPage{

    constructor(page){
        this.page = page;
        this.thankYouForTheOrderMsg = page.locator("tbody h1.hero-primary");
    }

    async validateOrderPlaced(){
        await this.thankYouForTheOrderMsg.waitFor({state: "visible"});
        return await this.thankYouForTheOrderMsg.isVisible();
    }

}

module.exports =  { OrdersPlacedPage };