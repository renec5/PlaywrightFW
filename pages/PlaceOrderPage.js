class PlaceOrderPage{
    
    constructor(page){
        this.page = page;
        this.placeOrderBtn = page.locator("div.user__name a");
        this.selectCountryField = page.locator("input[placeholder='Select Country']");
        this.countriesToSelect = page.locator("section.ta-results span");
        this.countryBtns = page.locator("section.ta-results button")
    }

    async enterCountry(country){
        const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);
        await this.selectCountryField.type(countryCapitalized, {delay: 100});
        /*
         * When we are waiting for an element that is loaded after interacting with a 
         * previous element and we need to interact them immediately, we need to add a 
         * wait for one of those elements, so that playwright can find them before 
         * interacting with them.
         */
        await this.countriesToSelect.first().waitFor();
        for(let i = 0; i < await this.countriesToSelect.count(); i++){
            if ( countryCapitalized == ((await this.countriesToSelect.nth(i).textContent()).trim())){
                await this.countryBtns.nth(i).click();
            }
        }
    }

    async placeOrder(){
        await this.placeOrderBtn.click();
    }
}

module.exports = { PlaceOrderPage };