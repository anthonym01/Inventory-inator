(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const Browser$1 = core.registerPlugin('Browser', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.BrowserWeb()),
});

class BrowserWeb extends core.WebPlugin {
    constructor() {
        super();
        this._lastWindow = null;
    }
    async open(options) {
        this._lastWindow = window.open(options.url, options.windowName || '_blank');
    }
    async close() {
        return new Promise((resolve, reject) => {
            if (this._lastWindow != null) {
                this._lastWindow.close();
                this._lastWindow = null;
                resolve();
            }
            else {
                reject('No active window to close!');
            }
        });
    }
}
const Browser = new BrowserWeb();

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BrowserWeb: BrowserWeb,
    Browser: Browser
});

exports.Browser = Browser$1;


},{"@capacitor/core":2}],2:[function(require,module,exports){
(function (global){(function (){
/*! Capacitor: https://capacitorjs.com/ - MIT License */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createCapacitorPlatforms = (win) => {
    const defaultPlatformMap = new Map();
    defaultPlatformMap.set('web', { name: 'web' });
    const capPlatforms = win.CapacitorPlatforms || {
        currentPlatform: { name: 'web' },
        platforms: defaultPlatformMap,
    };
    const addPlatform = (name, platform) => {
        capPlatforms.platforms.set(name, platform);
    };
    const setPlatform = (name) => {
        if (capPlatforms.platforms.has(name)) {
            capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
        }
    };
    capPlatforms.addPlatform = addPlatform;
    capPlatforms.setPlatform = setPlatform;
    return capPlatforms;
};
const initPlatforms = (win) => (win.CapacitorPlatforms = createCapacitorPlatforms(win));
const CapacitorPlatforms = /*#__PURE__*/ initPlatforms((typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : {}));
const addPlatform = CapacitorPlatforms.addPlatform;
const setPlatform = CapacitorPlatforms.setPlatform;

const legacyRegisterWebPlugin = (cap, webPlugin) => {
    var _a;
    const config = webPlugin.config;
    const Plugins = cap.Plugins;
    if (!config || !config.name) {
        // TODO: add link to upgrade guide
        throw new Error(`Capacitor WebPlugin is using the deprecated "registerWebPlugin()" function, but without the config. Please use "registerPlugin()" instead to register this web plugin."`);
    }
    // TODO: add link to upgrade guide
    console.warn(`Capacitor plugin "${config.name}" is using the deprecated "registerWebPlugin()" function`);
    if (!Plugins[config.name] || ((_a = config === null || config === void 0 ? void 0 : config.platforms) === null || _a === void 0 ? void 0 : _a.includes(cap.getPlatform()))) {
        // Add the web plugin into the plugins registry if there already isn't
        // an existing one. If it doesn't already exist, that means
        // there's no existing native implementation for it.
        // - OR -
        // If we already have a plugin registered (meaning it was defined in the native layer),
        // then we should only overwrite it if the corresponding web plugin activates on
        // a certain platform. For example: Geolocation uses the WebPlugin on Android but not iOS
        Plugins[config.name] = webPlugin;
    }
};

exports.ExceptionCode = void 0;
(function (ExceptionCode) {
    /**
     * API is not implemented.
     *
     * This usually means the API can't be used because it is not implemented for
     * the current platform.
     */
    ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
    /**
     * API is not available.
     *
     * This means the API can't be used right now because:
     *   - it is currently missing a prerequisite, such as network connectivity
     *   - it requires a particular platform or browser version
     */
    ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(exports.ExceptionCode || (exports.ExceptionCode = {}));
class CapacitorException extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
const getPlatformId = (win) => {
    var _a, _b;
    if (win === null || win === void 0 ? void 0 : win.androidBridge) {
        return 'android';
    }
    else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
        return 'ios';
    }
    else {
        return 'web';
    }
};

const createCapacitor = (win) => {
    var _a, _b, _c, _d, _e;
    const cap = win.Capacitor || {};
    const Plugins = (cap.Plugins = cap.Plugins || {});
    const capPlatforms = win.CapacitorPlatforms;
    const defaultGetPlatform = () => getPlatformId(win);
    const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
    const defaultIsNativePlatform = () => getPlatformId(win) !== 'web';
    const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
    const defaultIsPluginAvailable = (pluginName) => {
        const plugin = registeredPlugins.get(pluginName);
        if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            // JS implementation available for the current platform.
            return true;
        }
        if (getPluginHeader(pluginName)) {
            // Native implementation available.
            return true;
        }
        return false;
    };
    const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) ||
        defaultIsPluginAvailable;
    const defaultGetPluginHeader = (pluginName) => { var _a; return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find(h => h.name === pluginName); };
    const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
    const handleError = (err) => win.console.error(err);
    const pluginMethodNoop = (_target, prop, pluginName) => {
        return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
    };
    const registeredPlugins = new Map();
    const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
        const registeredPlugin = registeredPlugins.get(pluginName);
        if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
        }
        const platform = getPlatform();
        const pluginHeader = getPluginHeader(pluginName);
        let jsImplementation;
        const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
                jsImplementation =
                    typeof jsImplementations[platform] === 'function'
                        ? (jsImplementation = await jsImplementations[platform]())
                        : (jsImplementation = jsImplementations[platform]);
            }
            return jsImplementation;
        };
        const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
                const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find(m => prop === m.name);
                if (methodHeader) {
                    if (methodHeader.rtype === 'promise') {
                        return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                    }
                    else {
                        return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                    }
                }
                else if (impl) {
                    return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
                }
            }
            else if (impl) {
                return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            }
            else {
                throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, exports.ExceptionCode.Unimplemented);
            }
        };
        const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
                const p = loadPluginImplementation().then(impl => {
                    const fn = createPluginMethod(impl, prop);
                    if (fn) {
                        const p = fn(...args);
                        remove = p === null || p === void 0 ? void 0 : p.remove;
                        return p;
                    }
                    else {
                        throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, exports.ExceptionCode.Unimplemented);
                    }
                });
                if (prop === 'addListener') {
                    p.remove = async () => remove();
                }
                return p;
            };
            // Some flair ✨
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, 'name', {
                value: prop,
                writable: false,
                configurable: false,
            });
            return wrapper;
        };
        const addListener = createPluginMethodWrapper('addListener');
        const removeListener = createPluginMethodWrapper('removeListener');
        const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
                const callbackId = await call;
                removeListener({
                    eventName,
                    callbackId,
                }, callback);
            };
            const p = new Promise(resolve => call.then(() => resolve({ remove })));
            p.remove = async () => {
                console.warn(`Using addListener() without 'await' is deprecated.`);
                await remove();
            };
            return p;
        };
        const proxy = new Proxy({}, {
            get(_, prop) {
                switch (prop) {
                    // https://github.com/facebook/react/issues/20030
                    case '$$typeof':
                        return undefined;
                    case 'addListener':
                        return pluginHeader ? addListenerNative : addListener;
                    case 'removeListener':
                        return removeListener;
                    default:
                        return createPluginMethodWrapper(prop);
                }
            },
        });
        Plugins[pluginName] = proxy;
        registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: new Set([
                ...Object.keys(jsImplementations),
                ...(pluginHeader ? [platform] : []),
            ]),
        });
        return proxy;
    };
    const registerPlugin = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
    // Add in convertFileSrc for web, it will already be available in native context
    if (!cap.convertFileSrc) {
        cap.convertFileSrc = filePath => filePath;
    }
    cap.getPlatform = getPlatform;
    cap.handleError = handleError;
    cap.isNativePlatform = isNativePlatform;
    cap.isPluginAvailable = isPluginAvailable;
    cap.pluginMethodNoop = pluginMethodNoop;
    cap.registerPlugin = registerPlugin;
    cap.Exception = CapacitorException;
    cap.DEBUG = !!cap.DEBUG;
    cap.isLoggingEnabled = !!cap.isLoggingEnabled;
    // Deprecated props
    cap.platform = cap.getPlatform();
    cap.isNative = cap.isNativePlatform();
    return cap;
};
const initCapacitorGlobal = (win) => (win.Capacitor = createCapacitor(win));

const Capacitor = /*#__PURE__*/ initCapacitorGlobal(typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : {});
const registerPlugin = Capacitor.registerPlugin;
/**
 * @deprecated Provided for backwards compatibility for Capacitor v2 plugins.
 * Capacitor v3 plugins should import the plugin directly. This "Plugins"
 * export is deprecated in v3, and will be removed in v4.
 */
const Plugins = Capacitor.Plugins;
/**
 * Provided for backwards compatibility. Use the registerPlugin() API
 * instead, and provide the web plugin as the "web" implmenetation.
 * For example
 *
 * export const Example = registerPlugin('Example', {
 *   web: () => import('./web').then(m => new m.Example())
 * })
 *
 * @deprecated Deprecated in v3, will be removed from v4.
 */
const registerWebPlugin = (plugin) => legacyRegisterWebPlugin(Capacitor, plugin);

/**
 * Base class web plugins should extend.
 */
class WebPlugin {
    constructor(config) {
        this.listeners = {};
        this.windowListeners = {};
        if (config) {
            // TODO: add link to upgrade guide
            console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
            this.config = config;
        }
    }
    addListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listenerFunc);
        // If we haven't added a window listener for this event and it requires one,
        // go ahead and add it
        const windowListener = this.windowListeners[eventName];
        if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
        }
        const remove = async () => this.removeListener(eventName, listenerFunc);
        const p = Promise.resolve({ remove });
        Object.defineProperty(p, 'remove', {
            value: async () => {
                console.warn(`Using addListener() without 'await' is deprecated.`);
                await remove();
            },
        });
        return p;
    }
    async removeAllListeners() {
        this.listeners = {};
        for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
        }
        this.windowListeners = {};
    }
    notifyListeners(eventName, data) {
        const listeners = this.listeners[eventName];
        if (listeners) {
            listeners.forEach(listener => listener(data));
        }
    }
    hasListeners(eventName) {
        return !!this.listeners[eventName].length;
    }
    registerWindowListener(windowEventName, pluginEventName) {
        this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: event => {
                this.notifyListeners(pluginEventName, event);
            },
        };
    }
    unimplemented(msg = 'not implemented') {
        return new Capacitor.Exception(msg, exports.ExceptionCode.Unimplemented);
    }
    unavailable(msg = 'not available') {
        return new Capacitor.Exception(msg, exports.ExceptionCode.Unavailable);
    }
    async removeListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
            return;
        }
        const index = listeners.indexOf(listenerFunc);
        this.listeners[eventName].splice(index, 1);
        // If there are no more listeners for this type of event,
        // remove the window listener
        if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
        }
    }
    addWindowListener(handle) {
        window.addEventListener(handle.windowEventName, handle.handler);
        handle.registered = true;
    }
    removeWindowListener(handle) {
        if (!handle) {
            return;
        }
        window.removeEventListener(handle.windowEventName, handle.handler);
        handle.registered = false;
    }
}

const WebView = /*#__PURE__*/ registerPlugin('WebView');

exports.Capacitor = Capacitor;
exports.CapacitorException = CapacitorException;
exports.CapacitorPlatforms = CapacitorPlatforms;
exports.Plugins = Plugins;
exports.WebPlugin = WebPlugin;
exports.WebView = WebView;
exports.addPlatform = addPlatform;
exports.registerPlugin = registerPlugin;
exports.registerWebPlugin = registerWebPlugin;
exports.setPlatform = setPlatform;


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
const { Capacitor } = require("@capacitor/core");

const { Browser } = require("@capacitor/browser");

const openCapacitorSite = async () => {
    await Browser.open({ url: 'http://capacitorjs.com/' });
};

window.addEventListener('load', function () {
    openCapacitorSite();
    maininitalizer();
})

async function maininitalizer() {//Runs after 'Device ready'

    config.initialize();//Initalize configuration management
    Ui.initialize()
    inventory.initalize()
    setTimeout(() => {
        //navigator.splashscreen.hide();//hide splashscreen
        window.addEventListener('resize', function () { utility.size_check() })
        utility.properties.first_start = false;
    }, 300);
}

let config = {
    data: {//Loacal app data
        key: "Inpantry_cfg",
        usecount: 0,
        last_view: null,
        animation: true,
        theme: "dark",
        accent_color: -1,
        inventory: [//test data
            {
                name: "test tako list", details: "details for test tako list", listitems: [
                    { name: "tako", type: 1, restocat: 20, amount: 57 },
                    { name: "tako meat", type: 2, restocat: 1, amount: 0.76, reserve: 4 },
                    { name: "tako grill", type: 3, amount: 1 },
                ], deleted: false,
            },
            {
                name: "pc part list", details: "details for pc part", listitems: [
                    { name: "Ram chip", type: 1, restocat: 20, amount: 57 },
                    { name: "sauder", type: 2, restocat: 1, amount: 0.76, reserve: 4 },
                    { name: "saudering iron", type: 3, amount: 1 },
                ], deleted: false,
            },
            {
                name: "Brothgar list", details: "A list of mighty brothgars", listitems: [
                    { name: "Samuel", type: 3, amount: 1 },
                    { name: "Seth", type: 3, amount: 1 },
                    { name: "Simon", type: 3, amount: 1 },
                ], deleted: false,
            },
        ],
    },
    initialize: function () {//starts up the config manager
        console.warn('Config handler is initalized')
        if (localStorage.getItem("Inpantry_cfg")) {
            this.load()
        } else {
            this.validate()
        }
    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        localStorage.setItem("Inpantry_cfg", JSON.stringify(config.data))
        console.table(config.data)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("Inpantry_cfg"))
        console.table(config.data)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.warn('Config is being validated')
        var configisvalid = true

        if (typeof (config.data.usecount) == 'undefined') {
            config.data.usecount = 1
            configisvalid = false
            console.log('"usecount" did not exist and was set to default')
        }

        if (typeof (config.data.last_view) == 'undefined') {
            config.data.last_view = null;
            configisvalid = false
            console.log('"last_view" did not exist and was set to default')
        }

        if (typeof (config.data.theme) == 'undefined') {
            config.data.theme = "dark";
            configisvalid = false
            console.log('"theme" did not exist and was set to default')
        }

        if (typeof (config.data.accent_color) == 'undefined') {
            config.data.accent_color = 210;
            configisvalid = false
            console.log('"accent_color" did not exist and was set to default')
        }

        if (typeof (config.data.animation) == 'undefined') {
            config.data.animation = true;
            configisvalid = false
            console.log('"animation" did not exist and was set to default')
        }

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten')
            this.save()//Save new confog because old config is no longer valid
        } else { console.log('config was found to be valid') }
    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        localStorage.clear("Inpantry_cfg")
        console.log('config deleted: ')
        console.table(config.data)
        this.validate()
    }
}

let inventory = {
    initalize: function () {
        this.render_main_list()
    },
    render_main_list: function () {
        //build add new button
        var add_new_button = document.createElement("div")
        add_new_button.classList = "list_anchor"
        var list_title = document.createElement("div")
        list_title.innerHTML = "Add new list"
        list_title.classList = "list_title"
        var add_new_icon = document.createElement("div")
        add_new_icon.classList = "add_new_icon"
        add_new_button.appendChild(list_title)
        add_new_button.appendChild(add_new_icon)
        document.getElementById('main_list_container').appendChild(add_new_button)
        add_new_button.addEventListener('click', inventory.manager.add_new_main_list)

        //build data
        for (let i = 0; i < config.data.inventory.length; i++) {
            list_anchor(i);
        }

        function list_anchor(i) {//render out a single list anchor
            console.log('Render list: ', config.data.inventory[i].name, ' index: ', i);
            var list_anchor = document.createElement("div")
            list_anchor.classList = "list_anchor"
            var list_title = document.createElement("div")
            list_title.innerHTML = config.data.inventory[i].name;
            list_title.classList = "list_title"
            var list_preview_container = document.createElement("div")
            list_preview_container.classList = "list_preview_container"
            var list_details = document.createElement("div")
            list_details.classList = "list_details"
            list_details.innerHTML = config.data.inventory[i].details
            list_anchor.appendChild(list_title)
            list_anchor.appendChild(list_preview_container)
            list_anchor.appendChild(list_details)
            document.getElementById('main_list_container').appendChild(list_anchor)

            list_anchor.addEventListener('click', function () {//view list trigger
                console.log('clicked list anchor: ', list_anchor)
                inventory.show_list(index)
            })

            //build list preview
            for (let i2 = 0; i2 < config.data.inventory[index].listitems.length; i2++) {
                build_preview(i2);
            }
            function build_preview(index_preview) {//needs rework
                var list_preview = document.createElement('div')
                list_preview.classList = "list_preview"
                list_preview.innerHTML = config.data.inventory[index].listitems[index_preview].name
                list_preview_container.appendChild(list_preview)
            }
        }

    },
    show_list: async function (index) {//Displays a list from data
        utility.properties.current_list = index
        console.log('Showing list: ', index, config.data.inventory[index])
        document.getElementById('list_panneler').classList = "list_panneler_active"//show the pannel

        //set correct pannel data


        //Build list items
        for (let i = 0; i < config.data.inventory[index].listitems.length; i++) {
            build_list_item(i)
        }
        async function build_list_item(i) {
            console.log('Building list item: ', i, config.data.inventory[index].listitems[i])
            var pantry_item = document.createElement('div')
            pantry_item.classList = "pantry_item"
            var preview_square = document.createElement('div')
            preview_square.classList = "preview_square"
            var preview_img = document.createElement('div')
            preview_img.classList = "preview_img"
            var namebar = document.createElement('div')
            namebar.classList = "namebar"
            namebar.innerHTML = config.data.inventory[index].listitems[i].name

            preview_square.appendChild(preview_img)
            pantry_item.appendChild(preview_square)
            pantry_item.appendChild(namebar)
            document.getElementById('list_panneler').appendChild(pantry_item)
        }
    },
    manager: {
        add_new_main_list: async function () {
            console.log('Adding new list');
        }
    }
}

let Ui = {
    initialize: function () {//start ui logic
        console.warn('Ui initalize')
        this.navigate.lastmain_view()
        this.setting.animation.setpostition()
        this.setting.set_theme()

        document.getElementById('inventory_btn').addEventListener('click', Ui.navigate.inventory_view)
        document.getElementById('accounts_btn').addEventListener('click', Ui.navigate.accounting_view)
        document.getElementById('setting_btn').addEventListener('click', Ui.navigate.setting)
        document.getElementById('Animations_btn').addEventListener('click', Ui.setting.animation.flip)

        document.getElementById('set_device').addEventListener('click', function () {
            config.data.theme = "devicebased"
            config.save();
            Ui.setting.set_theme()
            utility.toast('following device theme')
        })
        document.getElementById('set_dark').addEventListener('click', function () {
            config.data.theme = "dark"
            config.save();
            Ui.setting.set_theme()
            utility.toast('Dark theme')
        })
        document.getElementById('set_light').addEventListener('click', function () {
            config.data.theme = "light"
            config.save();
            Ui.setting.set_theme()
            utility.toast('Light theme')
        })
        document.getElementById('hue-1-selec').addEventListener('click', function () {
            hue_selec(-1)
            document.getElementById('hue-1-selec').classList = "accent_blob_active"
            console.log('hue change -1')
        })
        document.getElementById('hue0-selec').addEventListener('click', function () {
            hue_selec(0)
            document.getElementById('hue0-selec').classList = "accent_blob_active"
            console.log('%chue change 0', "color: hsl(0,100%,50%)")
        })
        document.getElementById('hue30-selec').addEventListener('click', function () {
            hue_selec(30)
            document.getElementById('hue30-selec').classList = "accent_blob_active"
            console.log('%chue change 30', "color: hsl(30,100%,50%)")
        })
        document.getElementById('hue60-selec').addEventListener('click', function () {
            hue_selec(60)
            document.getElementById('hue60-selec').classList = "accent_blob_active"
            console.log('%chue change 60', "color: hsl(60,100%,50%)")
        })
        document.getElementById('hue90-selec').addEventListener('click', function () {
            hue_selec(90)
            document.getElementById('hue90-selec').classList = "accent_blob_active"
            console.log('%chue change 90', "color: hsl(90,100%,50%)")
        })
        document.getElementById('hue120-selec').addEventListener('click', function () {
            hue_selec(120)
            document.getElementById('hue120-selec').classList = "accent_blob_active"
            console.log('%chue change 120', "color: hsl(120,100%,50%)")
        })
        document.getElementById('hue150-selec').addEventListener('click', function () {
            hue_selec(150)
            document.getElementById('hue150-selec').classList = "accent_blob_active"
            console.log('%chue change 150', "color: hsl(150,100%,50%)")
        })
        document.getElementById('hue180-selec').addEventListener('click', function () {
            hue_selec(180)
            document.getElementById('hue180-selec').classList = "accent_blob_active"
            console.log('%chue change 180', "color: hsl(180,100%,50%)")
        })
        document.getElementById('hue210-selec').addEventListener('click', function () {
            hue_selec(210)
            document.getElementById('hue210-selec').classList = "accent_blob_active"
            console.log('%chue change 210', "color: hsl(210,100%,50%)")
        })
        document.getElementById('hue240-selec').addEventListener('click', function () {
            hue_selec(240)
            document.getElementById('hue240-selec').classList = "accent_blob_active"
            console.log('%chue change 240', "color: hsl(240,100%,50%)")
        })
        document.getElementById('hue270-selec').addEventListener('click', function () {
            hue_selec(270)
            document.getElementById('hue270-selec').classList = "accent_blob_active"
            console.log('%chue change 270', "color: hsl(270,100%,50%)")
        })
        document.getElementById('hue300-selec').addEventListener('click', function () {
            hue_selec(300)
            document.getElementById('hue300-selec').classList = "accent_blob_active"
            console.log('%chue change 300', "color: hsl(300,100%,50%)")
        })
        document.getElementById('hue330-selec').addEventListener('click', function () {
            hue_selec(330)
            document.getElementById('hue330-selec').classList = "accent_blob_active"
            console.log('%chue change 330', "color: hsl(330,100%,50%)")
        })

        function hue_selec(hue) {
            document.getElementById('hue-1-selec').classList = "accent_blob"
            document.getElementById('hue0-selec').classList = "accent_blob"
            document.getElementById('hue30-selec').classList = "accent_blob"
            document.getElementById('hue60-selec').classList = "accent_blob"
            document.getElementById('hue90-selec').classList = "accent_blob"
            document.getElementById('hue120-selec').classList = "accent_blob"
            document.getElementById('hue150-selec').classList = "accent_blob"
            document.getElementById('hue180-selec').classList = "accent_blob"
            document.getElementById('hue210-selec').classList = "accent_blob"
            document.getElementById('hue240-selec').classList = "accent_blob"
            document.getElementById('hue270-selec').classList = "accent_blob"
            document.getElementById('hue300-selec').classList = "accent_blob"
            document.getElementById('hue330-selec').classList = "accent_blob"
            config.data.accent_color = hue;
            Ui.setting.set_theme();
            config.save();
        }
    },
    navigate: {//navigation
        back: async function () {
            if (document.getElementById('setting_view').style.display == "block") {
                Ui.navigate.lastmain_view();
            } else {
                utility.exit_strategy();
            }
        },
        lastmain_view: function () {
            switch (config.data.last_view) {//Set view to last view the user used, excluding settings
                case "accounting_view":
                    Ui.navigate.accounting_view()
                    break;
                case "inventory_view":
                    Ui.navigate.inventory_view()
                    break;
                default:
                    console.warn('Last view error, defaulting');
                    Ui.navigate.inventory_view()
            }
        },
        setting: function () {
            console.log('Naviagate settings')
            document.getElementById('inventory_btn').classList = "navbtn"
            document.getElementById('accounts_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn_ative"
            document.getElementById('accounting_view').style.display = "none"
            document.getElementById('inventory_view').style.display = "none"
            document.getElementById('setting_view').style.display = "block"
        },
        accounting_view: function () {
            console.log('Naviagate inventory')
            document.getElementById('inventory_btn').classList = "navbtn"
            document.getElementById('accounts_btn').classList = "navbtn_ative"
            document.getElementById('setting_btn').classList = "navbtn"
            document.getElementById('accounting_view').style.display = "block"
            document.getElementById('inventory_view').style.display = "none"
            document.getElementById('setting_view').style.display = "none"
            config.data.last_view = "accounting_view"
        },
        inventory_view: function () {
            console.log('Naviagate accounts')
            document.getElementById('inventory_btn').classList = "navbtn_ative"
            document.getElementById('accounts_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn"
            document.getElementById('accounting_view').style.display = "none"
            document.getElementById('inventory_view').style.display = "block"
            document.getElementById('setting_view').style.display = "none"
            config.data.last_view = "inventory_view"
        }
    },
    setting: {
        set_theme: function () {//determines which theme to use
            console.log('Set theme')

            if (config.data.theme == "dark") {
                set_dark()
                document.getElementById('dark_theme_btn').classList = "themebtn_active"
                document.getElementById('light_theme_btn').classList = "thembtn"
                document.getElementById('device_theme_btn').classList = "thembtn"
            } else if (config.data.theme == "light") {
                set_light()
                document.getElementById('dark_theme_btn').classList = "thembtn"
                document.getElementById('light_theme_btn').classList = "themebtn_active"
                document.getElementById('device_theme_btn').classList = "thembtn"
            } else if (config.data.theme == "devicebased") {
                document.getElementById('dark_theme_btn').classList = "thembtn"
                document.getElementById('light_theme_btn').classList = "thembtn"
                document.getElementById('device_theme_btn').classList = "themebtn_active"
            } else {
                //thme error
            }

            function set_dark() {
                if (utility.properties.first_start = true) { document.getElementById('hue' + config.data.accent_color + '-selec').classList = "accent_blob_active" }
                switch (config.data.accent_color) {
                    case -1:
                        document.getElementById('body').classList = "dark";
                        console.log('Dark inverse theme');
                        break;
                    case 0:
                        document.getElementById('body').classList = "dark _0";
                        console.log('%cdark _0', "color: hsl(0,100%,50%)")
                        break;
                    case 30:
                        document.getElementById('body').classList = "dark _30";
                        console.log('%cdark _30', "color: hsl(30,100%,50%)");
                        break;
                    case 60:
                        document.getElementById('body').classList = "dark _60";
                        console.log('%cdark _60', "color: hsl(60,100%,50%)");
                        break;
                    case 90:
                        document.getElementById('body').classList = "dark _90";
                        console.log('%cdark _90', "color: hsl(90,100%,50%)");
                        break;
                    case 120:
                        document.getElementById('body').classList = "dark _120";
                        console.log('%cdark _120', "color: hsl(120,100%,50%)");
                        break;
                    case 150:
                        document.getElementById('body').classList = "dark _150";
                        console.log('%cdark _150', "color: hsl(150,100%,50%)");
                        break;
                    case 180:
                        document.getElementById('body').classList = "dark _180";
                        console.log('%cdark _180', "color: hsl(180,100%,50%)");
                        break;
                    case 210:
                        document.getElementById('body').classList = "dark _210";
                        console.log('%cdark _210', "color: hsl(210,100%,50%)");
                        break;
                    case 240:
                        document.getElementById('body').classList = "dark _240";
                        console.log('%cdark _240', "color: hsl(240,100%,50%)");
                        break;
                    case 270:
                        document.getElementById('body').classList = "dark _270";
                        console.log('%cdark _270', "color: hsl(270,100%,50%)");
                        break;
                    case 300:
                        document.getElementById('body').classList = "dark _300";
                        console.log('%cdark _300', "color: hsl(300,100%,50%)");
                        break;
                    case 330:
                        document.getElementById('body').classList = "dark _330";
                        console.log('%cdark _330', "color: hsl(330,100%,50%)");
                        break;
                    default:
                        console.error('Theme error :', config.data.accent_color);
                        document.getElementById('body').classList = "dark _210";
                        config.data.accent_color = 210;
                }
            }

            function set_light() {
                if (utility.properties.first_start = true) { document.getElementById('hue' + config.data.accent_color + '-selec').classList = "accent_blob_active" }
                switch (config.data.accent_color) {
                    case -1:
                        document.getElementById('body').classList = "light";
                        console.log('light inverse theme');
                        break;
                    case 0:
                        document.getElementById('body').classList = "light _0";
                        console.log('%clight_0', "color: hsl(0,100%,50%)")
                        break;
                    case 30:
                        document.getElementById('body').classList = "light _30";
                        console.log('%clight_30', "color: hsl(30,100%,50%)");
                        break;
                    case 60:
                        document.getElementById('body').classList = "light _60";
                        console.log('%clight_60', "color: hsl(60,100%,50%)");
                        break;
                    case 90:
                        document.getElementById('body').classList = "light _90";
                        console.log('%clight_90', "color: hsl(90,100%,50%)");
                        break;
                    case 120:
                        document.getElementById('body').classList = "light _120";
                        console.log('%clight_120', "color: hsl(120,100%,50%)");
                        break;
                    case 150:
                        document.getElementById('body').classList = "light _150";
                        console.log('%clight_150', "color: hsl(150,100%,50%)");
                        break;
                    case 180:
                        document.getElementById('body').classList = "light _180";
                        console.log('%clight_180', "color: hsl(180,100%,50%)");
                        break;
                    case 210:
                        document.getElementById('body').classList = "light _210";
                        console.log('%clight_210', "color: hsl(210,100%,50%)");
                        break;
                    case 240:
                        document.getElementById('body').classList = "light _240";
                        console.log('%clight_240', "color: hsl(240,100%,50%)");
                        break;
                    case 270:
                        document.getElementById('body').classList = "light _270";
                        console.log('%clight_270', "color: hsl(270,100%,50%)");
                        break;
                    case 300:
                        document.getElementById('body').classList = "light _300";
                        console.log('%clight_300', "color: hsl(300,100%,50%)");
                        break;
                    case 330:
                        document.getElementById('body').classList = "light _330";
                        console.log('%clight_330', "color: hsl(330,100%,50%)");
                        break;
                    default:
                        console.error('Theme error :', config.data.accent_color);
                        document.getElementById('body').classList = "light _210";
                        config.data.accent_color = 210;
                }
            }
        },
        animation: {
            flip: function () {
                console.log('animation switch triggered');
                if (config.data.animation == true) {//turn off the switch
                    config.data.animation = false;
                    utility.toast('animations dissabled');
                    console.log('animations dissabled');
                } else {//turn on the witch
                    config.data.animation = true;
                    utility.toast('animations enabled');
                    console.log('animations enabled');
                }
                config.save();
                Ui.setting.animation.setpostition();
            },
            setpostition: function () {
                if (config.data.animation == true) {
                    document.getElementById('anim').href = "";
                    document.getElementById('Animations_switch_container').className = 'switch_container_active';
                } else {
                    document.getElementById('anim').href = "css/noanime.css";//nomation sheet removes animations
                    document.getElementById('Animations_switch_container').className = 'switch_container_dissabled';
                }
            },
        },
    }
}

let utility = {//Some usefull things
    properties: {
        exit: false,
        first_start: true,
        current_list: null,
    },
    exit_strategy: function () {//Heres how to string things togther to make something usefull
        console.warn('Exit strategy triggered')
        if (utility.properties.exit == true) {
            utility.close()
        } else {
            utility.properties.exit = true;
            utility.toast("Press back button again to exit", 2000)
            setTimeout(() => { utility.properties.exit = false }, 2000)
        }
    },
    /*  Close the app   */
    close: function () {
        console.trace('App closure triggered via')
        //config_handler.save()
        if (navigator.app) {
            navigator.app.exitApp()
        } else if (navigator.device) {
            navigator.device.exitApp()
        } else {
            window.close()
        }
    },
    /* Check screen size (physical/app size) */
    size_check: async function () {
        console.log('Sizecheck fired');
        if (typeof (window.plugins) != 'undefined') {
            window.plugins.screensize.get(function (result) {//Check device screen size
                console.log(result);
                if (result.diameter < 3) {
                    //watch size screen
                    document.getElementById('stylesheet').href = "css/watch.css"
                    console.warn('Set watch screen scale with size: ', result.diameter);
                } else if (result.diameter > 6) {
                    //tablet size screen
                    document.getElementById('stylesheet').href = "css/tablet.css"
                    console.warn('Set tablet screen scale with size: ', result.diameter);
                } else {
                    //phone size screen
                    document.getElementById('stylesheet').href = "css/phone.css"
                    console.warn('Set phone screen scale with size: ', result.diameter);
                }
                //utility.toast('Screensize: '+result.diameter,5000);
            }, function (err) { console.log('Screen data error: ', err) });
        } else {
            console.error('Screensize plugin failed completely, device may not be ready');
        }
    },
    /*  Produce toast messages    */
    toast: function (text, durration_in_ms, position_top_right_left_bottom, offset_in_px) {
        if (position_top_right_left_bottom == undefined) { position_top_right_left_bottom = 'bottom' }//default the position
        if (durration_in_ms == undefined) { durration_in_ms = 4000 }//default the duration
        if (offset_in_px == undefined) { offset_in_px = -160 }//default the offset
        window.plugins.toast.showWithOptions({ message: text, duration: durration_in_ms, position: position_top_right_left_bottom, addPixelsY: offset_in_px })
    },
    /*  Push text to the keyboard   */
    clipboard: function (textpush) {
        copyText.toString()
        var temptxtbox = document.createElement("input")
        document.body.appendChild(temptxtbox)
        temptxtbox.setAttribute("id", "temp_copy")
        document.getElementById("temp_copy").value = copyText
        temptxtbox.select()
        document.execCommand("copy")
        document.body.removeChild(temptxtbox)
    },
    /*  Produce Random numbers  */
    rand: {
        HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
        RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
        HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
        number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
    },
}
},{"@capacitor/browser":1,"@capacitor/core":2}]},{},[3]);
