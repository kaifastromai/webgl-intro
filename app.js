import { resize_canvas } from "./utils";
import { glcanvas, RunDemo, gl } from "./webgl";
resize_canvas(glcanvas);
gl.viewport(0, 0, glcanvas.width, glcanvas.height);
RunDemo();
//# sourceMappingURL=app.js.map