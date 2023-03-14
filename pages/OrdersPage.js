class OrdersPage{

    constructor(page){
        this.page = page;
        this.orderRows = page.locator("table.table tbody tr");

    }

    async validateOrder(orderNumber){
        let flag = false;
        for(let i = 0; i < await this.orderRows.count(); i++){
            if (orderNumber == (await this.orderRows.nth(i).locator(th).textContent).trim()){
                flag = true;
            }
        }
        return flag;
    }

}

module.exports = { OrdersPage };