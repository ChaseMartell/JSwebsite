import AppController from "./controllers/app_controller.js";
import appViewModel from "./views/view_models/app_view_model.js";

(async function() {
    let app = new AppController(appViewModel);
    await app.render();
})();