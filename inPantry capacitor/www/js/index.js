const { Browser, App, Camera, Toast, Storage, Dialog } = Capacitor.Plugins;

App.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active: ', isActive);
});

App.addListener('backButton', () => {
    console.log('back button pressed')
    utility.exit_strategy()
})


window.addEventListener('load', async function () {
    try {
        await config.load()
    } catch (err) {
        console.warn('Something bad happened: ', err)
    } finally {

        Ui.initialize()
        inventory.initalize()
        maininitalizer();
    }
})

async function maininitalizer() {

}

let config = {
    data: {//Loacal app data
        animation: true,
        theme: "dark",
        accent_color: -1,
        inventory: [//test data
            {
                name: "test tako list", details: "details for test tako list", listitems: [
                    { name: "tako", type: 1, restocat: 20, amount: 57 },
                    { name: "tako meat", type: 2, restocat: 1, amount: 0.76, reserve: 4 },
                    { name: "tako grill", type: 3, amount: 1 },
                ],
            },
            {
                name: "pc part list", details: "details for pc part", listitems: [
                    { name: "Ram chip", type: 1, restocat: 20, amount: 57 },
                    { name: "sauder", type: 2, restocat: 1, amount: 0.76, reserve: 4 },
                    { name: "saudering iron", type: 3, amount: 1 },
                ],
            },
            {
                name: "Brothgar list", details: "A list of mighty brothgars", listitems: [
                    { name: "Samuel", type: 3, amount: 1 },
                    { name: "Seth", type: 3, amount: 1 },
                    { name: "Simon", type: 3, amount: 1 },
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

let inventory = {
    initalize: function () {

        document.getElementById('add_new_list_button').addEventListener('click', async function () {//add a new list
            console.log('new list button')
            inventory.manager.add_new_main_list()
        });

        this.render_main_list()

    },
    render_main_list: function () {// display the main inventory list

        for (let i in config.data.inventory) { list_anchor(i) }

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
            for (let i2 in config.data.inventory[index]) {
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
        for (let i in config.data.inventory[index].listitems) {

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

            const { value, cancelled } = await Dialog.prompt({
                title: 'New list',
                message: `Type a name for the new list`,
            });

            if (!cancelled) {
                config.data.inventory.push({ name: value, details: "", listitems: [] })
                config.save()
                inventory.render_main_list()
            }
            console.log('Name:', value);
            console.log('Cancelled:', cancelled);
        }
    }
}

let Ui = {
    initialize: function () {//start ui logic
        console.warn('Ui initalize')
        //this.navigate.lastmain_view()
        this.navigate.inventory_view()
        this.setting.animation.setpostition()
        this.setting.set_theme()

        document.getElementById('inventory_btn').addEventListener('click', Ui.navigate.inventory_view)
        document.getElementById('setting_btn').addEventListener('click', Ui.navigate.setting)
        document.getElementById('Animations_btn').addEventListener('click', Ui.setting.animation.flip)

        document.getElementById('set_device').addEventListener('click', function () {
            config.data.theme = "devicebased"
            config.save();
            Ui.setting.set_theme()
            Toast.show({ text: 'following device theme' });
        })
        document.getElementById('set_dark').addEventListener('click', function () {
            config.data.theme = "dark"
            config.save();
            Ui.setting.set_theme()
            Toast.show({ text: 'Dark theme' });
        })
        document.getElementById('set_light').addEventListener('click', function () {
            config.data.theme = "light"
            config.save();
            Ui.setting.set_theme()
            Toast.show({ text: 'Light theme' });
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
                Ui.navigate.inventory_view();
            } else {
                utility.exit_strategy();
            }
        },
        setting: function () {
            console.log('Naviagate settings')
            document.getElementById('inventory_btn').classList = "navbtn"
            document.getElementById('accounts_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn_ative"
            document.getElementById('inventory_view').style.display = "none"
            document.getElementById('setting_view').style.display = "block"
        },
        inventory_view: function () {
            console.log('Naviagate inventory')
            document.getElementById('inventory_btn').classList = "navbtn_ative"
            document.getElementById('accounts_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn"
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
                    Toast.show({ text: 'animations dissabled' });
                    console.log('animations dissabled');
                } else {//turn on the witch
                    config.data.animation = true;
                    Toast.show({ text: 'animations enabled' });
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
            App.exitApp()
        } else {
            utility.properties.exit = true;
            Toast.show({ text: 'Press back button again to exit' });
            setTimeout(() => { utility.properties.exit = false }, 2000)
        }
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