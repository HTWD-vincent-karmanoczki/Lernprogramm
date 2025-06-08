"use strict";

import { Model } from './model.js';
import { View } from './view.js';
import { Presenter } from './presenter.js';

document.addEventListener('DOMContentLoaded', function () {
    let m = new Model();
    let v = new View();
    let p = new Presenter(v, m);
    p.init();
});