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
        Ui.theme.set()
        /* Navigation_dock buttons */
        document.getElementById('inventory_main_btn').addEventListener('click', function () { Ui.navigate.inventory_view() });
        document.getElementById('recipie_main_btn').addEventListener('click', function () { Ui.navigate.recipies_view() });
        document.getElementById('history_main_btn').addEventListener('click', function () { Ui.navigate.history_view() });
        document.getElementById('more_main_btn').addEventListener('click', function () { Ui.navigate.more_view() });

        
        maininitalizer();
    }
})

async function maininitalizer() {
    //start/refresh active elemments
}

let config = {
    data: {//Loacal app data
        animation: true,
        theme: "dark",
        accent_color: -1,
        inventory: [//test data
            {
                name: "example", details: "an example of what can be done", listitems: [
                    { name: "type 1 example", type: 1, restocat: 20, amount: 57 },
                    { name: "type 2 example", type: 2, restocat: 1, amount: 0.76, reserve: 4 },
                ],
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

}

const Ui = {
    navigate: {//navigation
        back: async function () {

        },
        more_view: function () {
            console.log('Naviagate more view')
            document.getElementById('inventory_main_btn').classList = "navbtn"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn_ative"
            document.getElementById('history_main_btn').classList = "navbtn"
            document.getElementById('inventory_view').classList ="mainview_hidden"
            document.getElementById('history_view').classList ="mainview_hidden"
            document.getElementById('more_view').classList ="mainview"
            document.getElementById('recipies_view').classList ="mainview_hidden"
        },
        history_view: function () {
            console.log('Naviagate history view')
            document.getElementById('inventory_main_btn').classList = "navbtn"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn_ative"
            document.getElementById('inventory_view').classList ="mainview_hidden"
            document.getElementById('history_view').classList ="mainview"
            document.getElementById('more_view').classList ="mainview_hidden"
            document.getElementById('recipies_view').classList ="mainview_hidden"

        },
        inventory_view: function () {
            console.log('Naviagate more view')
            document.getElementById('inventory_main_btn').classList = "navbtn_ative"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn"
            document.getElementById('inventory_view').classList ="mainview"
            document.getElementById('history_view').classList ="mainview_hidden"
            document.getElementById('more_view').classList ="mainview_hidden"
            document.getElementById('recipies_view').classList ="mainview_hidden"
        },
        recipies_view: function () {
            console.log('Naviagate more view')
            document.getElementById('inventory_main_btn').classList = "navbtn"
            document.getElementById('recipie_main_btn').classList = "navbtn_ative"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn"
            document.getElementById('inventory_view').classList ="mainview_hidden"
            document.getElementById('history_view').classList ="mainview_hidden"
            document.getElementById('more_view').classList ="mainview_hidden"
            document.getElementById('recipies_view').classList ="mainview"
        }
    },
    theme:{
        set:  async function(){
            //set previously saved color theme
            document.getElementById('theming').innerHTML=`
            :root {
                --accent-color: hsl(30, 100%, 50%)!important;
            }
            `;
        }
    }
}
