var app = {// Application Constructor
    initialize: function () {// deviceready Event Handler
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
        document.addEventListener("backbutton", this.onBackKeyDown, false)
        document.addEventListener("pause", this.onPause, false)
        document.addEventListener("resume", this.onResume, false)
        document.addEventListener("menubutton", this.onMenu, false)
    },
    onDeviceReady: function () {
        //this.receivedEvent('deviceready')
        console.log('Device is Ready...')
        maininitalizer();
    },
    onBackKeyDown: function () {
        console.warn('"Back button" event triggered')
        utility.back();
    },
    onPause: function () {
        console.warn('"pause" event triggered')
        config.save()
    },
    onResume: function () {
        console.warn('"Resume" event triggered')
    },
    onMenu: function () {
        console.warn('"Menu button" event triggered')
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id)
        var listeningElement = parentElement.querySelector('.listening')
        var receivedElement = parentElement.querySelector('.received')

        listeningElement.setAttribute('style', 'display:none;')
        receivedElement.setAttribute('style', 'display:block;')

        console.log('Received Event: ' + id)
    },
}; app.initialize()

function maininitalizer() {//Runs after 'Device ready'

    if (typeof (device) != 'undefined') {//check device mode
        if (device.platform == 'Android' || 'iOS') {//mobile
            console.warn('Running on a mobile platform')
        } else {
            console.warn('Running on a Desktop platform')
        }
    } else {
        console.error('Device plugin broke')
    }

    config.initialize();//Initalize configuration management
    utility.initialize();
    Ui.initialize()
    setTimeout(() => {
        //navigator.splashscreen.hide();//hide splashscreen
        window.addEventListener('resize', function () { utility.size_check() })
    }, 300);
}

let config = {
    data: {
        key: "APPname_cfg",
        usecount: 0,
        last_view: null,
        animation: true,
    },
    initialize: function () {
        console.warn('Config handler is initalized')
        if (localStorage.getItem("APPname_cfg")) {
            this.load()
        } else {
            this.validate()
        }
    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        localStorage.setItem("APPname_cfg", JSON.stringify(config.data))
        console.table(config.data)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("APPname_cfg"))
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
        localStorage.clear("APPname_cfg")
        console.log('config deleted: ')
        console.table(config.data)
        this.validate()
    }
}

Ui = {
    initialize: function () {
        console.warn('Ui initalize')

        document.getElementById('accounts_btn').addEventListener('click', Ui.navigate.accounts)
        document.getElementById('inventory_btn').addEventListener('click', Ui.navigate.inventory)
        document.getElementById('setting_btn').addEventListener('click', Ui.navigate.setting)
        this.navigate.lastmain_view()
        this.setting.animation.setpostition()
        document.getElementById('Animations_btn').addEventListener('click', Ui.setting.animation.flip)
    },
    navigate: {
        lastmain_view: function () {
            switch (config.data.last_view) {//Set view to last view the user used, excluding settings
                case "accounts":
                    Ui.navigate.accounts()
                    break;
                case "inventory":
                    Ui.navigate.inventory()
                    break;
                default:
                    console.warn('Last view error, defaulting');
                    Ui.navigate.inventory()
            }
        },
        setting: function () {
            console.log('Naviagate settings')
            document.getElementById('accounts_btn').classList = "navbtn"
            document.getElementById('inventory_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn_ative"
            document.getElementById('inventory_view').style.display = "none"
            document.getElementById('accounting_view').style.display = "none"
            document.getElementById('setting_view').style.display = "block"
        },
        inventory: function () {
            console.log('Naviagate inventory')
            document.getElementById('accounts_btn').classList = "navbtn"
            document.getElementById('inventory_btn').classList = "navbtn_ative"
            document.getElementById('setting_btn').classList = "navbtn"
            document.getElementById('inventory_view').style.display = "block"
            document.getElementById('accounting_view').style.display = "none"
            document.getElementById('setting_view').style.display = "none"
            config.data.last_view = "inventory"
        },
        accounts: function () {
            console.log('Naviagate accounts')
            document.getElementById('accounts_btn').classList = "navbtn_ative"
            document.getElementById('inventory_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn"
            document.getElementById('inventory_view').style.display = "none"
            document.getElementById('accounting_view').style.display = "block"
            document.getElementById('setting_view').style.display = "none"
            config.data.last_view = "accounts"
        }
    },
    setting: {
        animation: {
            flip: function () {
                console.log('animation switch triggered');
                if (config.data.animation == true) {//turn off the switch
                    config.data.animation = false;
                    utility.toast('animations dissabled');
                    console.warn('animations dissabled');
                } else {//turn on the witch
                    config.data.animation = true;
                    utility.toast('animations enabled');
                    console.warn('animations enabled');
                }
                config.save();
                Ui.setting.animation.setpostition();
            },
            setpostition: function () {
                if (config.data.animation == true) {
                    document.getElementById('Animations_switch_container').className = 'switch_container_active';
                    document.getElementById('anim').href = "";
                } else {
                    document.getElementById('Animations_switch_container').className = 'switch_container_dissabled';
                    document.getElementById('anim').href = "css/noanime.css";//nomation sheet removes animations
                }
            },
        },
    }
}

let utility = {//Some usefull things
    properties: {
        exit: false,
    },
    initialize: function () {
        console.warn('Utility initalize')
        utility.size_check()
        utility.check_device_theme()
    },
    back: async function () {
        if (document.getElementById('setting_view').style.display == "block") {
            Ui.navigate.lastmain_view();
        }else{
            utility.exit_strategy();
        }
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
    check_device_theme: function () {
        //console.log(cordova.plugins.ThemeDetection.isAvailable());
        cordova.plugins.ThemeDetection.isDarkModeEnabled(
            function (success) {
                console.log(success)
                if (success.value == true) {
                    //System darkmode enabled
                } else {
                    //system darkmode dissabled
                }
            },
            function (error) {
                console.log(error)
                //unable to can, use default
            }
        );

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