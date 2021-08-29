import { Server } from "../index";

new Server({
    port: 8080,
    endpoints: {
        helloWorld () {
            return "Hello World!";
        }
    }
}).listen();

export default {}