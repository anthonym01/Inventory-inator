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

        post({ payload: "Came online at " + (new Date().getMonth()) }, "/post/phonehome");

        Ui.initalize();
        inventory.initalize();
        recipie.initalize();
    }
});

let config = {
    data: {//Loacal app data
        animation: true,
        theme: "device",
        last_view: "first",
        accent_color: { hue: 200, saturation: 100, lightness: 50 },
        inventory: [//test data
            {//test inventory
                name: "example", icon: 1, details: "an example of what can be done", listitems: [
                    { name: "type 1 example", type: 1, restocat: 20, amount: 57 },
                    { name: "type 2 example", type: 2, restocat: 1, amount: 4.76, },
                ],
            }, {//test inventory
                name: "example", icon: 2, details: "an example of what can be done", listitems: [
                    { name: "type 1 example", type: 1, restocat: 20, amount: 57 },
                    { name: "type 2 example", type: 2, restocat: 1, amount: 4.76, },
                ],
            }, {//test inventory
                name: "example", icon: 3, details: "an example of what can be done", listitems: [
                    { name: "type 1 example", type: 1, restocat: 20, amount: 57 },
                    { name: "type 2 example", type: 2, restocat: 1, amount: 4.76, },
                ],
            }, {//test inventory
                name: "example", details: "an example of what can be done", listitems: [
                    { name: "type 1 example", type: 1, restocat: 20, amount: 57 },
                    { name: "type 2 example", type: 2, restocat: 1, amount: 4.76, },
                ],
            },
        ],
        recipie: [
            {
                name: "test",
                details: "test entry\n Testing my patience",
                listitems: [
                    {
                        title: "test food 1",
                        description: "testing 1",
                        ingredients: ["test", "testing", "tested"],
                        Steps: ["hammer", "that", "keyboard"],
                        tileImage: [],
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
    currently_open: -1,
    initalize: async function () {
        this.render_main_lists();

        // action to open the dialog for adding a new inventory
        document.getElementById('add_new_inventory_button').addEventListener('click', function () {
            console.log('Add new list button')
            inventory.new_inventory_dialog.show();
        });
    },
    new_inventory_dialog: {//Manage dialog functions
        show: async function () {

        },
        hide: async function () {

        },
        cancel: async function () {

        },
        save: async function () {

        }
    },
    render_main_lists: async function () {
        /*
            places inventories generated from config.data.inventory into #inventory_lists_container
        */

        console.log('display inventories ', config.data.inventory);
        document.getElementById('inventory_lists_container').innerHTML = "";

        if (config.data.inventory.length < 1) {
            //no inventories
            //<div class="empty_list_modal">No Inventories</div>
            let empty_list_modal = document.createElement('div');
            empty_list_modal.classList = "empty_list_modal";
            document.getElementById('inventory_lists_container').appendChild(empty_list_modal);
        } else {
            for (let i in config.data.inventory) {
                buildblock(i)
            }

            function buildblock(index) {
                let inventory_list_block = document.createElement('div');
                inventory_list_block.classList = "inventory_list_block"
                inventory_list_block.title = config.data.inventory[index].name + ' inventory';

                let inventory_icon = document.createElement('div');
                inventory_icon.classList = "inventory_icon";
                switch (config.data.inventory[index].icon) {
                    case 1:
                        inventory_icon.style.backgroundImage = `url('img/selectionicons/box-cardboard-pngrepo-com.png')`;
                        break;
                    case 2:
                        inventory_icon.style.backgroundImage = `url('img/selectionicons/bag-svgrepo-com.svg')`;
                        break;
                    default: //request previously uploaded image

                }
                inventory_list_block.appendChild(inventory_icon);

                let title = document.createElement('div');
                title.innerHTML = config.data.inventory[index].name;
                title.classList = "title";
                inventory_list_block.appendChild(title);

                let description = document.createElement('div');
                description.classList = "description";
                description.innerHTML = config.data.inventory[index].details;
                inventory_list_block.appendChild(description);

                let item_count = document.createElement('div');
                item_count.classList = "item_count";
                item_count.innerHTML = `${config.data.inventory[index].listitems.length} items`;
                inventory_list_block.appendChild(item_count);

                document.getElementById('inventory_lists_container').appendChild(inventory_list_block);

                inventory_list_block.addEventListener('click', function () {
                    console.log('click inventory ', config.data.inventory[index]);
                    inventory.open(index);
                })
            }
        }

    },
    open: async function (inventoryindex) {
        inventory.currently_open = inventoryindex;
        console.log('open inventory ', config.data.inventory[inventoryindex])

        document.getElementById('inventory_list_pannel').classList = "Dynamic_lists_pannel hidden";
        document.getElementById('inventory_pannel').classList = "Dynamic_lists_pannel";

        document.getElementById('inventory_name').innerHTML = config.data.inventory[inventoryindex].name;

        make_inventory(inventoryindex);
        async function make_inventory(inumber) {
            console.log('show inventory ', config.data.inventory[inumber]);
            document.getElementById('inventory_container').innerHTML = "";

            if (config.data.inventory[inumber].listitems.length < 1) {
                //no inventories
                //<div class="empty_list_modal">No Inventories</div>
                let empty_list_modal = document.createElement('div');
                empty_list_modal.classList = "empty_list_modal"; empty_list_modal.innerHTML = "No Inventories";
                document.getElementById('inventory_container').appendChild(empty_list_modal);
            } else {
                for (let i in config.data.inventory[inumber].listitems) {
                    buildblock(i)
                }

                function buildblock(index) {
                    let inventory_item_block = document.createElement('div');
                    inventory_item_block.classList = "inventory_item_block"
                    inventory_item_block.title = config.data.inventory[inumber].listitems[index].name;

                    let inventory_icon = document.createElement('div');
                    inventory_icon.classList = "inventory_icon";
                    switch (config.data.inventory[inumber].listitems.icon) {
                        case 1:
                            inventory_icon.style.backgroundImage = "url('/www/img/selectionicons/box-cardboard-pngrepo-com.png')";
                            break;
                        case 2:
                            inventory_icon.style.backgroundImage = "url('/www/img/selectionicons/bag-svgrepo-com.svg')";
                            break;
                        default: //request previously uploaded image

                    }
                    inventory_item_block.appendChild(inventory_icon);

                    let titlem = document.createElement('div');
                    titlem.innerHTML = config.data.inventory[inumber].listitems[index].name;
                    titlem.classList = "title";
                    inventory_item_block.appendChild(titlem);

                    let item_count = document.createElement('div');
                    item_count.classList = "item_count";
                    item_count.innerHTML = `restock at ${config.data.inventory[inumber].listitems[index].restocat}`;
                    inventory_item_block.appendChild(item_count);

                    document.getElementById('inventory_container').appendChild(inventory_item_block);

                    inventory_item_block.addEventListener('click', function () {
                        console.log('click inventory item', config.data.inventory[inumber].listitems[index]);
                    })
                }
            }
        }
    },

}

const recipie = {
    initalize: async function () {

    },
}

const Ui = {
    initalize: async function () {

        switch (config.data.last_view) {
            case "history": Ui.navigate.history_view(); break;
            case "recipie": Ui.navigate.recipies_view(); break;
            case "inventory": Ui.navigate.inventory_view(); break;
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
            document.getElementById('inventory_view').classList = "mainview hidden";
            document.getElementById('history_view').classList = "mainview hidden";
            document.getElementById('more_view').classList = "mainview";
            document.getElementById('recipies_view').classList = "mainview hidden";
        },
        history_view: function () {
            console.log('Naviagate history view')
            document.getElementById('inventory_main_btn').classList = "navbtn"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn_ative"
            document.getElementById('inventory_view').classList = "mainview hidden"
            document.getElementById('history_view').classList = "mainview"
            document.getElementById('more_view').classList = "mainview hidden"
            document.getElementById('recipies_view').classList = "mainview hidden"
            config.data.last_view = "history";
            config.save();
        },
        inventory_view: function () {
            console.log('Naviagate more view')
            document.getElementById('inventory_list_pannel').classList = "Dynamic_lists_pannel ";
            document.getElementById('inventory_pannel').classList = "Dynamic_lists_pannel hidden";

            document.getElementById('inventory_main_btn').classList = "navbtn_ative"
            document.getElementById('recipie_main_btn').classList = "navbtn"
            document.getElementById('more_main_btn').classList = "navbtn"
            document.getElementById('history_main_btn').classList = "navbtn"
            document.getElementById('inventory_view').classList = "mainview"
            document.getElementById('history_view').classList = "mainview hidden"
            document.getElementById('more_view').classList = "mainview hidden"
            document.getElementById('recipies_view').classList = "mainview hidden"
            config.data.last_view = "inventory";
            config.save();
        },
        recipies_view: function () {
            console.log('Naviagate more view');
            document.getElementById('inventory_main_btn').classList = "navbtn";
            document.getElementById('recipie_main_btn').classList = "navbtn_ative";
            document.getElementById('more_main_btn').classList = "navbtn";
            document.getElementById('history_main_btn').classList = "navbtn";
            document.getElementById('inventory_view').classList = "mainview hidden";
            document.getElementById('history_view').classList = "mainview hidden";
            document.getElementById('more_view').classList = "mainview hidden";
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
