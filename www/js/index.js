const { Browser, App, Camera, Toast, Storage, Dialog, Device } = Capacitor.Plugins;

App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed')
    Ui.navigate.back()
})

async function request(what) {//basic request

    try {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {//wait for and handle response
            if (this.readyState == 4 && this.status == 200) {
                console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
                return this.responseText
            }
        };

        xhttp.open("GET", what, true);//get request
        xhttp.send();
    } catch (err) {
        console.warn('xhttp request failed ', err);
    }

}

async function post(what, where) {//basic post
    var xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = function () {//wait for and handle response
        if (this.readyState == 4 && this.status == 200) {
            console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
        }
    };
    xhttp.open("POST", where, true);
    xhttp.send(JSON.stringify(what));
}

window.addEventListener('load', async function () {
    try {
        await config.load()
    } catch (err) {
        console.warn('Something bad happened: ', err)
    } finally {

        post({ payload: "Came online at" }, "/post/phonehome");

        Ui.initalize();
        inventory.initalize();
        recipie.initalize();
    }
});

let config = {
    data: {//Loacal app data
        animation: true,
        theme: "device",
        last_view:"first",
        accent_color: { hue: 200, saturation: 100, lightness: 50 },
        inventory: [//test data
            {//test inventory
                name: "example", details: "an example of what can be done", listitems: [
                    { name: "type 1 example", type: 1, restocat: 20, amount: 57 },
                    { name: "type 2 example", type: 2, restocat: 1, amount: 4.76, },
                ],
            },
        ],
        recipie: [
            {
                name:"test",
                details:"test entry\n Testing my patience",
                listitems:[
                    {
                        title:"test food 1",
                        description:"testing 1",
                        ingredients:["test","testing","tested"],
                        Steps:["hammer","that","keyboard"],
                        tileImage:[],
                    }
                ]
            },
            {//test recipie book
                name: "Breakfast things", details: "Munchies for the mornings", listitems: [
                    {
                        title: "Fried Egg",
                        description: "Fry up an egg in a frying pan with salt and sweet pepper",
                        ingredients: [
                            "Egg",
                            "cooking oil(non-seed)",
                            "salt"
                        ],
                        Steps: [
                            "heat the frying pan somewhere between warm and instant 3rd degree burn ",
                            "pour oil into pan",
                            "Shatter Egg on your left ball",
                            "pour egg into pan",
                            "fry",
                            "sprinkle salt into pan over egg",
                            "consume the sustinance"
                        ],
                        tileImage: "base 64 string"
                    }
                ]
            },
        ],
    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        Storage.set({ key: 'Inpantry_cfg', value: JSON.stringify(config.data) });
        console.table(config.data)
    },
    load: async function () {//Load the config file
        console.warn('Configuration is being loaded')
        let fromkey = await Storage.get({ key: 'Inpantry_cfg' })
        console.log('Loaded: ', fromkey)
        if (fromkey.value != null) {
            config.data = JSON.parse(fromkey.value);
            console.table(config.data)
        } else {
            console.warn('configuration loaded is empty')
        }

    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        Storage.remove({ key: 'Inpantry_cfg' });
        console.log('config deleted')
        console.table(config.data)
    }
}

const inventory = {
    initalize: async function () {

    },
    render_main_lists:async function(){
        console.log('display inventories ',config.data.inventory);

        for(i in config.data.inventory){
            
        }
    }
}

const recipie = {
    initalize: async function () {

    },
}

const Ui = {
    initalize: async function () {

        switch(config.data.last_view){
            case "history": Ui.navigate.history_view();break;
            case "recipie": Ui.navigate.recipies_view();break;
            case "inventory": Ui.navigate.inventory_view();break;
            default: //first settup
        }

        Ui.theme_set();

        /* Navigation_dock buttons */
        document.getElementById('inventory_main_btn').addEventListener('click', function () { Ui.navigate.inventory_view() });
        document.getElementById('recipie_main_btn').addEventListener('click', function () { Ui.navigate.recipies_view() });
        document.getElementById('history_main_btn').addEventListener('click', function () { Ui.navigate.history_view() });
        document.getElementById('more_main_btn').addEventListener('click', function () { Ui.navigate.more_view() });

    },
    navigate: {//navigation
        back: async function () {

        },
        more_view: function () {
            console.log('Naviagate more view');
            document.getElementById('inventory_main_btn').classList = "navbtn";
            document.getElementById('recipie_main_btn').classList = "navbtn";
            document.getElementById('more_main_btn').classList = "navbtn_ative";
            document.getElementById('history_main_btn').classList = "navbtn";
            document.getElementById('inventory_view').classList = "mainview_hidden";
            document.getElementById('history_view').classList = "mainview_hidden";
            document.getElementById('more_view').classList = "mainview";
            document.getElementById('recipies_view').classList = "mainview_hidden";
        },
        history_view: function () {
            console.log('Naviagate history view')
            document.getElementById('inventory_main_btn').classList = "navbtn"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn_ative"
            document.getElementById('inventory_view').classList = "mainview_hidden"
            document.getElementById('history_view').classList = "mainview"
            document.getElementById('more_view').classList = "mainview_hidden"
            document.getElementById('recipies_view').classList = "mainview_hidden"
            config.data.last_view = "history";
            config.save();
        },
        inventory_view: function () {
            console.log('Naviagate more view')
            document.getElementById('inventory_main_btn').classList = "navbtn_ative"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn"
            document.getElementById('inventory_view').classList = "mainview"
            document.getElementById('history_view').classList = "mainview_hidden"
            document.getElementById('more_view').classList = "mainview_hidden"
            document.getElementById('recipies_view').classList = "mainview_hidden"
            config.data.last_view = "inventory";
            config.save();
        },
        recipies_view: function () {
            console.log('Naviagate more view');
            document.getElementById('inventory_main_btn').classList = "navbtn";
            document.getElementById('recipie_main_btn').classList = "navbtn_ative";
            document.getElementById('more_main_btn').classList = "navbtn";
            document.getElementById('history_main_btn').classList = "navbtn";
            document.getElementById('inventory_view').classList = "mainview_hidden";
            document.getElementById('history_view').classList = "mainview_hidden";
            document.getElementById('more_view').classList = "mainview_hidden";
            document.getElementById('recipies_view').classList = "mainview";
            config.data.last_view = "recipie";
            config.save();
        }
    },
    theme_set: async function () {
        //set previously saved color theme

        document.getElementById('theming').innerHTML = `
            :root {
                --accent-color: hsl(${config.data.accent_color.hue},${config.data.accent_color.saturation}%, ${config.data.accent_color.lightness}%)!important;
            }
        `;

        setTimeout(() => {
            switch (config.data.theme) {
                case "dark":
                    document.body.classList = "dark";
                    break;
                case "light":
                    document.body.classList = "light";
                    break;
                default:
                    document.body.classList = "device_theme";
                //follow device theme
            }
        }, 1000);
    }
}
