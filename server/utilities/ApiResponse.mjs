class ApiResponse {
    #response;
    #message;
    #data;
    constructor(response,message,data = null) {
        this.#response = response;
        this.#message = message;
        this.#data = data;
    }
    get getReponse() {return this.#response;}
    get getMessage() {return this.#message;}
    get getData() {return this.#data;}

    set setResponse(response) {this.#response = response;}
    set setMessage(message) {this.#message = message;}
    set setData(data) {this.#data = data;}

    getApiReponse() {
        return {
            response: this.#response,
            message: this.#message,
            data: this.#data
        }
    }

    setApiResponse(response, message, data = null) {
        this.#response = response;
        this.#message = message;
        this.#data = data;
    }
}
export {ApiResponse};