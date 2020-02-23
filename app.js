import { initializeShader, drawScene, glcanvas } from "./webgl";
function createSlider(div, name, default_val, max, min, step) {
    var n_div = document.createElement("div");
    var title = document.createElement('b');
    title.innerText = name;
    var theta_sldr = document.createElement("input");
    theta_sldr.type = "range";
    theta_sldr.max = max.toString();
    theta_sldr.min = min.toString();
    theta_sldr.value = default_val.toString();
    theta_sldr.step = step.toString();
    n_div.appendChild(title);
    n_div.appendChild(theta_sldr);
    div.appendChild(n_div);
    return theta_sldr;
}
var txcanvas = document.getElementById('txcanvas');
txcanvas.width = txcanvas.clientWidth;
txcanvas.height = txcanvas.clientHeight;
var tx = txcanvas.getContext('2d');
tx.font = "40px Arial";
tx.fillText("WebGl Intro", 0, 0);
var slider_div = document.getElementById("slider_container");
var theta_sldr = createSlider(slider_div, "Angle: ", 0, Math.PI, 0, 0.001);
var size_x_sldr = createSlider(slider_div, "SizeX: ", 1, 10, -10, 0.001);
var size_y_sldr = createSlider(slider_div, "SizeY: ", 1, 10, -10, 0.001);
var pos_x_slider = document.getElementById('pos_x_slider');
var pos_y_slider = document.getElementById('pos_y_slider');
pos_x_slider.max = glcanvas.width.toString();
pos_y_slider.max = glcanvas.height.toString();
function update() {
    var theta = Number(theta_sldr.value);
    console.log(theta);
    drawScene(theta, [Number(size_x_sldr.value), Number(size_y_sldr.value)], [Number(pos_x_slider.value), Number(pos_y_slider.value)]);
}
initializeShader().then(() => {
    drawScene(0, [1, 1], [Number(pos_x_slider.value), Number(pos_y_slider.value)]);
    pos_x_slider.oninput = () => {
        update();
    };
    pos_y_slider.oninput = () => {
        update();
    };
    theta_sldr.oninput = () => {
        update();
    };
    size_x_sldr.oninput = () => {
        update();
    };
    size_y_sldr.oninput = () => {
        update();
    };
});
//# sourceMappingURL=app.js.map