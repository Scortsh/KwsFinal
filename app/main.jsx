"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var proj_1 = require("ol/proj");
var client_1 = require("react-dom/client");
require("ol/ol.css");
var mapApp_1 = require("./mapApp");
(0, proj_1.useGeographic)();
(0, client_1.createRoot)(document.getElementById("root")).render(<mapApp_1.Application />);
