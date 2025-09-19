import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes/index"; // Убедитесь, что путь правильный
import "./assets/main.css";
import "./assets/base.css";

const app = createApp(App);
app.use(router);
app.mount("#app");
