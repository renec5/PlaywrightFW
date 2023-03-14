const { ShoppingPage } =  require("./ShoppingPage");

class LoginPage{

    constructor(page){
        this.page = page;
        this.usernameField = page.locator("input#userEmail");
        this.passwordField = page.locator("input#userPassword");
        this.signInBtn = page.locator("input#login");
    }

    async enterEmail(username){
        await this.usernameField.type(username);
    }

    async enterPassword(password){
        await this.passwordField.type(password);
    }
    
    async clickLoginButton(){
        await this.signInBtn.click();
    }

    async login(username, password){
        await this.enterEmail(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        const shoppingPage = new ShoppingPage(this.page);
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            shoppingPage.products.locator('b').first().textContent()
        ]);
        // await this.page.waitForLoadState('networkide');
    }

    async validateLoginSuccessfull(){
        const shoppingPage = new ShoppingPage(this.page);
        return await shoppingPage.validateShoppingLandingPage();
    }


}

module.exports = { LoginPage };