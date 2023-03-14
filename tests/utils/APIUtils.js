class APIUtils{

    constructor(apiContext, loginPayload){
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    /*
     * this Function logs in through API, posting username/password on the loginPayload
     * and once logged in it returns the token from the loginResponse object, to get 
     * loginPayload we use the developer options on web application page with F12 and then
     * we go to Network tab > Fetch/XHR, there we can see the API requests send to get the
     * neccessary data to create the payload
     */
    async getToken(){
        const apiLoginURI = "https://www.rahulshettyacademy.com/api/ecom/auth/login";
        const loginResponse = (await this.apiContext).post(apiLoginURI,
            {
                data: this.loginPayload
            });
        // await expect((await loginResponse).ok()).toBeTruthy();
        await console.log((await loginResponse).status());
        const loginResponseJson = (await loginResponse).json();
        await console.log(await loginResponseJson);
        const token = (await loginResponseJson).token;
        await console.log({token});
        return token;
    }

    /*
     * This function created an order through API, first it calls getToken() function 
     * and adds response information into response object to return it at the end, it
     * sends the post request with orderPayload infirmation to place the order, and we
     * need to pass as Authorization parameter the token with has been obtained from 
     * calling getToken() function
     */
    async createOrder(orderPayload){
        let response = {};
        response.token = await this.getToken();
        const apiOrderURI = "https://www.rahulshettyacademy.com/api/ecom/order/create-order";
        const orderResponse = (await this.apiContext).post(apiOrderURI, {
            data: orderPayload,
            headers: {
                Authorization: await response.token,
                "Content-Type": "application/json"
            }
        });
    
        // await expect((await orderResponse).ok()).toBeTruthy();
        const orderResponseJson = (await orderResponse).json();
        await console.log(await orderResponseJson);
        const orderId = (await orderResponseJson).orders[0];
        await console.log((await orderResponseJson).orders[0]);
        response.orderId = orderId;
        return response;
    }
}

module.exports = {APIUtils};