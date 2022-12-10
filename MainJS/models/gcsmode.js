/**
 *
 * @module mode
 * @version 1.0.0
 * @description <b> Communications Module </b>
 *
 *
 * @example none
 * @author Andrew Peters
 * @date May 2019
 * @copyright
 * Notices:
 * Copyright 2019 United States Government as represented by the Administrator of the National Aeronautics
 * and Space Administration. All Rights Reserved.
 *  
 * Disclaimers
 * No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY
 * KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, ANY
 * WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS, ANY IMPLIED
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR FREEDOM FROM
 * INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE ERROR FREE, OR ANY
 * WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO THE SUBJECT SOFTWARE.
 * THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN ENDORSEMENT BY GOVERNMENT
 * AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS, RESULTING DESIGNS, HARDWARE,
 * SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS RESULTING FROM USE OF THE SUBJECT
 * SOFTWARE.  FURTHER, GOVERNMENT AGENCY DISCLAIMS ALL WARRANTIES AND LIABILITIES
 * REGARDING THIRD-PARTY SOFTWARE, IF PRESENT IN THE ORIGINAL SOFTWARE, AND
 * DISTRIBUTES IT "AS IS."
 *  
 * Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST THE UNITED
 * STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR
 * RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN ANY LIABILITIES,
 * DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE, INCLUDING ANY
 * DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S USE OF THE SUBJECT
 * SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE UNITED STATES
 * GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR RECIPIENT,
 * TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR ANY SUCH MATTER SHALL
 * BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS AGREEMENT.
 *
 */

import {
    MODE
} from '../control/entry.js'

import * as E from '../control/eventFunctions.js';
import * as P from '../control/playback.js'

import * as form from '../views/form.js';
import * as map from '../views/map.js';

import * as FM from '../models/formElements.js'

import * as I from '../Indicators/indicators.js';
import * as GF from '../Geofence/geofence.js';
import * as GE from '../Geofence/geofenceEvents.js';
import * as TE from '../Traffic/eventFunctionsTraffic.js'

export class GCSmode {
    /**
     * @function <a name="GCSmode">GCSmode</a>
     * @description Constructor.
     * @param none
     * @memberof module:mode
     * @class GCSmode
     * @instance
     */
    constructor() {
        this.mode = 'SITL';
        this.server_os = 'Linux'
        this.observeonly = false
        this.con_status = 'Connection Status: Disconnected'
        this.serviceWorker = false;
        this.adsb = true;
        this.Tadsb = true
        this.sim = true;
        this.sensor = true;
        this.create_ac = true;
        this.multi = true;
        this.shutdown = true;
        this.parameters = true;
        this.trafic = true;
        this.flightplan = true;
        this.startflight = true;
        this.stopflight = true;
        this.editflight = true;
        this.buildGeofence = true;
        this.removeGeofence = true;
        this.usbport = '/dev/ttyUSB0';
        this.baud = 57600;
        this.context_added = false;
        this.sim_type = 'Rotorsim' // either 'Arducopter' or 'RotorSim'
        this.activeSubPanels = [];
        this.radar = false;
        this.ipAddress = '0.0.0.0';
        this.HITLipAddress = '127.0.0.1'
        this.port = '14553';
        this.input_method = 'IP'
        this.ic_path = '/code/icarous';
        this.ardu_path = '/PycharmProjects/ardupilot';
        this.flybyfile = false;
        this.bands = true;
        this.ring = false
        this.label = true
        this.alert = true;
        this.load_wp_default = 'flightplan1.txt'
        this.save_wp_default = 'test_flightplan1.txt'
        this.load_param_default = 'icarous_default.txt'
        this.save_param_default = 'icarous_custom1.txt'
        this.load_gf_default = 'geofence.xml'
        this.save_gf_default = 'testgeofence1.xml'
        this.save_traffic_default = 'test_traffic1.txt'
        this.filename = 'merged.mlog'
        this.playerActive = false
        this.swToggle = 'Off';
        this.component = 5
        this.center = []
    }


    /**
     * @function <a name="makeModeSITL">makeModeSITL</a>
     * @description Automatic settings when flight mode is changed. User controlled options will be handled on the settings page
     * @param none
     * @memberof module:mode
     * @instance
     */
    makeModeSITL() {
        this.mode = 'SITL';
        this.create_ac = true;
        this.shutdown = true;
        this.parameters = true;
        this.trafic = true;
        this.flightplan = true;
        this.startflight = true;
        this.stopflight = true;
        this.editflight = true;
        this.buildGeofence = true;
        this.removeGeofence = true;
    }

    /**
     * @function <a name="makeModeHITL">makeModeHITL</a>
     * @description Automatic settings when flight mode is changed. User controlled options will be handled on the settings page
     * @param none
     * @memberof module:mode
     * @instance
     */
    makeModeHITL() {
        this.mode = 'HITL';
        this.create_ac = true;
        this.shutdown = true;
        this.parameters = true;
        this.trafic = true;
        this.flightplan = true;
        this.startflight = true;
        this.stopflight = true;
        this.editflight = true;
        this.buildGeofence = true;
        this.removeGeofence = true;
        this.component = 5
    }

    /**
     * @function <a name="makeModePlayback">makeModePlayback</a>
     * @description Automatic settings when flight mode is changed. User controlled options will be handled on the settings page
     * @param none
     * @memberof module:mode
     * @instance
     */
    makeModePlayback() {
        this.mode = 'Playback';
        this.create_ac = false;
        this.shutdown = false;
        this.parameters = false;
        this.trafic = false;
        this.flightplan = false;
        this.startflight = false;
        this.stopflight = false;
        this.editflight = false;
        this.buildGeofence = false;
        this.removeGeofence = false;
        this.playerActive = false
    }

    /**
     * @function <a name="makeModeSITL">MakeModeSITL</a>
     * @description Populates the settings panel based on current mode settings.
     * @param set_pan {Object} HTML div the generated objects will be attached to.
     * @memberof module:mode
     * @instance
     */
    modeOptionsSwitch(set_pan) {

        // set value of select box to current mode
        document.getElementById('select_mode').value = MODE.mode

        if (MODE.mode == 'SITL') {

            // Path to icarous
            set_pan.appendChild(FM.addTextInput('ic_path', "Path To Icarous", MODE.ic_path, E.setPathToIcarous))

            // Path to Ardupilot
            set_pan.appendChild(FM.addTextInput('ardu_path', "Path To Ardupilot", MODE.ardu_path, E.setPathToArdupilot))

            // add button for Icarous settings
            set_pan.appendChild(FM.addTextInput('sim_type', 'SIM TYPE: RotorSim/ArduCopter', MODE.sim_type, E.setSimType));

            // add button test
            // set_pan.appendChild(FM.addBlockButton('ic', 'test_settings', '!!! TEST !!!', E.testFunction));

            // Allow multiple aircraft to be created
            let multi_buttons = FM.addButtonSwitch('multi_toggle', 'Multiple Aircraft', function () {
                E.clickToggleButton('multi_toggle');
            })
            set_pan.appendChild(multi_buttons)

            // ***************************************************

            // transmit adsb position
            let Tadsb_buttons = FM.addButtonSwitch('Tadsb_toggle', 'Transmit ADSB', function () {
                E.clickToggleButton('Tadsb_toggle');
            })
            set_pan.appendChild(Tadsb_buttons)

            // allow adsb traffic
            let adsb_buttons = FM.addButtonSwitch('adsb_toggle', 'ADSB Traffic Display', function () {
                E.clickToggleButton('adsb_toggle');
            })
            set_pan.appendChild(adsb_buttons)

            // allow sim traffic
            let sim_buttons = FM.addButtonSwitch('sim_toggle', 'Sim Traffic Display', function () {
                E.clickToggleButton('sim_toggle');
            })
            set_pan.appendChild(sim_buttons)

            // allow sensor traffic
            let sensor_buttons = FM.addButtonSwitch('sensor_toggle', 'Sensor Traffic Display', function () {
                E.clickToggleButton('sensor_toggle');
            })
            set_pan.appendChild(sensor_buttons)

            // allow ic bands and radius
            let bands_buttons = FM.addButtonSwitch('bands_toggle', 'Icarous Band/Radius Display', function () {
                E.clickToggleButton('bands_toggle');
            })
            set_pan.appendChild(bands_buttons)

            // allow merging rings display
            let ring_buttons = FM.addButtonSwitch('ring_toggle', 'Merging Ring Display', function () {
                E.clickToggleButton('ring_toggle');
            })
            set_pan.appendChild(ring_buttons)

            // allow aircraft and traffic label display
            let label_buttons = FM.addButtonSwitch('label_toggle', 'Label Display', function () {
                E.clickToggleButton('label_toggle');
            })
            set_pan.appendChild(label_buttons)

            // open graph page
            set_pan.appendChild(FM.addBlockButton('graph', 'graph_page', 'Open Graph Page', E.clickOpenGraphDisplay));

            // // ***************************************************
            // // add radar buttons
            // let radar_buttons = FM.addButtonSwitch('radar_toggle', 'Show Radar Control Buttons', function () {
            //     E.clickToggleButton('radar_toggle');
            // })
            // set_pan.appendChild(radar_buttons)
            // // ***************************************************

            // Display the current center of the map
            set_pan.appendChild(FM.addParagraph('current_center', 'Current center: '))

            // add user inputs for lat and lng
            let lat = map.getCenter()[0]
            let lng = map.getCenter()[1]
            if (lat && lng) {
                E.setLocalStorage([lat, lng], 'center')
            }
            let lat_div = FM.addNumberInput(0, 'center_in', 'Lat:', 0.001, 6, lat, E.inputLatLng)
            let lng_div = FM.addNumberInput(0, 'center_in', 'Lng:', 0.001, 6, lng, E.inputLatLng)
            lat_div.setAttribute('class', 'in_latlng')
            lng_div.setAttribute('class', 'in_latlng')

            set_pan.appendChild(lat_div)
            set_pan.appendChild(lng_div)



        } else if (MODE.mode == 'HITL') {

            let r1 = FM.addRadioButtonGroup('input_method', 'Connect to hardware via IP or USB Device. Select input type:', ['IP', 'USB'], MODE.input_method, E.onRadioInputSetMode)
            set_pan.appendChild(r1)

            // ip input
            let ip_input = FM.addTextInput('HITLipAddress', 'IP Address', MODE.HITLipAddress, E.onInputSetMode);
            set_pan.appendChild(ip_input);

            // usb port
            let usb_input = FM.addTextInput('usbport', 'USB Port', MODE.usbport, E.onInputSetMode);
            set_pan.appendChild(usb_input);

            // port
            let port_input = FM.addTextInput('port', 'Port', MODE.port, E.onInputSetMode);
            set_pan.appendChild(port_input);

            // baud rate
            let baud_input = FM.addTextInput('baud', 'Baud Rate', MODE.baud, E.onInputSetMode);
            set_pan.appendChild(baud_input);

            // add component id input
            let comp_input = FM.addTextInput('component', 'Component Id', MODE.component, E.onInputSetMode);
            set_pan.appendChild(comp_input);

            // add submit button
            let submit_btn = FM.addBlockButton('submit', 'hitl', 'Connect To Aircraft', E.sendConnectToAc)
            set_pan.appendChild(submit_btn)

            // add disconnect button
            let disconnect_btn = FM.addBlockButton('disconnect', 'hitl', 'Disconect From Aircraft', E.sendDisconnectFromAc)
            set_pan.appendChild(disconnect_btn)

            set_pan.appendChild(FM.addParagraph('traffic_disp_settings','<br />Traffic Display Settings'))

            // these are ok, but are repeated so need to put in a function
            // ***************************************************
            // allow adsb traffic
            let adsb_buttons = FM.addButtonSwitch('adsb_toggle', 'ADSB Traffic Display', function () {
                E.clickToggleButton('adsb_toggle');
            })
            set_pan.appendChild(adsb_buttons)

            // allow sim traffic
            let sim_buttons = FM.addButtonSwitch('sim_toggle', 'Sim Traffic Display', function () {
                E.clickToggleButton('sim_toggle');
            })
            set_pan.appendChild(sim_buttons)

            // allow sensor traffic
            let sensor_buttons = FM.addButtonSwitch('sensor_toggle', 'Sensor Traffic Display', function () {
                E.clickToggleButton('sensor_toggle');
            })
            set_pan.appendChild(sensor_buttons)

            // allow ic bands and radius
            let bands_buttons = FM.addButtonSwitch('bands_toggle', 'Icarous Band/Radius Display', function () {
                E.clickToggleButton('bands_toggle');
            })
            set_pan.appendChild(bands_buttons)

            // allow merging rings display
            let ring_buttons = FM.addButtonSwitch('ring_toggle', 'Merging Ring Display', function () {
                E.clickToggleButton('ring_toggle');
            })
            set_pan.appendChild(ring_buttons)

            // allow aircraft and traffic label display
            let label_buttons = FM.addButtonSwitch('label_toggle', 'Label Display', function () {
                E.clickToggleButton('label_toggle');
            })
            set_pan.appendChild(label_buttons)

            // // ***************************************************
            // // add radar buttons
            // let radar_buttons = FM.addButtonSwitch('radar_toggle', 'Show Radar Control Buttons', function () {
            //     E.clickToggleButton('radar_toggle');
            // })
            // set_pan.appendChild(radar_buttons)
            // // ***************************************************


            // will use icarous preset values
            let simac_btn = FM.addBlockButton('new_ac', 'sitl', 'Add Simulated Aircraft', E.createNewSimAircraftHitl)
            set_pan.appendChild(simac_btn)


        } else if (MODE.mode == 'Playback') {
            // allow adsb traffic
            let adsb_buttons = FM.addButtonSwitch('adsb_toggle', 'ADSB Traffic Display', function () {
                E.clickToggleButton('adsb_toggle');
            })
            set_pan.appendChild(adsb_buttons)

            // allow ic bands and radius
            let bands_buttons = FM.addButtonSwitch('bands_toggle', 'Icarous Band/Radius Display', function () {
                E.clickToggleButton('bands_toggle');
            })
            set_pan.appendChild(bands_buttons)

            // allow merging rings display
            let ring_buttons = FM.addButtonSwitch('ring_toggle', 'Merging Ring Display', function () {
                E.clickToggleButton('ring_toggle');
            })
            set_pan.appendChild(ring_buttons)

            // allow aircraft and traffic label display
            let label_buttons = FM.addButtonSwitch('label_toggle', 'Label Display', function () {
                E.clickToggleButton('label_toggle');
            })
            set_pan.appendChild(label_buttons)

            // Filename
            set_pan.appendChild(FM.addParagraph('file_info','File must be located in the webgs/LogFiles/ directory.'))
            set_pan.appendChild(FM.addFileLoadButton('set', 'playback_file_', 'Load File', P.clickLoadPlaybackFile))
            set_pan.appendChild(FM.addParagraph('name_display',''))

            // add start button
            let startPlayback_btn = FM.addBlockButton('startPlayback', 'playback', 'Start Playback', P.sendStartPlayback)
            set_pan.appendChild(startPlayback_btn)

        } else {
            console.log('You screwed up. Please try again.')
        }
    }


    /**
     * @function <a name="makeModeSITL">MakeModeSITL</a>
     * @description Populates the aircraft panel based on current mode and aircraft settings.
     * @param ac {Object} Aircraft object.
     * @returns {Object} Div.
     * @memberof module:mode
     * @instance
     */
    aircraftModeCheck(ac) {
        // show indicators - all modes
        I.addNewIndicators(ac.id)

        // add click listeners for changes in active aircraft
        let menu_btn_ul = document.getElementById('ac_buttons')
        menu_btn_ul.addEventListener('click', I.makeIndicatorsActive)
        window.addEventListener('click', I.makeIndicatorsActive)

        // adjust the size of the indicators based on window size
        window.addEventListener('resize', I.resizeWindow)

        // update the context menu
        this.updateContextMenu(ac)

        // don't show ac bands or radius
        if (!MODE.bands) {
            ac.showBands = false;
        }

        // create div for buttons
        let btn_div = FM.addDiv('fp_btndiv','btndiv')
        
        ac.prev_panel = 'pan'

        let ac_pan_div = document.getElementById(`ac_pan_${ac.id}`)

        if (ac.mode == 'SITL') {

            if (ac.status == 0) {
                // add load wp from file input
                btn_div.appendChild(FM.addFileLoadButton(ac.id, `wp_load${ac.id}`, 'Load WP File', E.clickLoadWPFile))

                // save wp's to file
                btn_div.appendChild(FM.addTextInput(`wp_file_save_${ac.id}`, "Save WP's To File", MODE.save_wp_default, E.enterSaveWp))

                // add form to panel
                ac_pan_div.appendChild(FM.addForm(`ac_fp_form_${ac.id}`, 'myform'))

                // create form elements
                form.createFlightPlanTable(ac);

                // ***************************************************
                // add radar buttons
                if (MODE.radar) {
                    btn_div.appendChild(FM.addBlockButton(ac.id, 'r_on', 'Turn Radar On', E.clickTurnRadarOn));
                    btn_div.appendChild(FM.addBlockButton(ac.id, 'r_off', 'Turn Radar Off', E.clickTurnRadarOff));
                }

                // ***************************************************

                // add submit button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'submit_fp', 'Submit Flight Plan', E.clickSubmitFlightPlan));

                // add change aircraft parameters button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'change_parameters', 'Change Aircraft Parameters', E.clickChangeParameters));

            } else if (ac.status == 1) {
                ac.prev_panel = 'info_pan'

                // add edit flight plan button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'edit_fp', 'Edit Flight Plan', E.clickEditFlightPlan));

                // add a start flight button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'start', 'Start Flight', E.clickSendStartFlight));

                // add a start flight button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'start', 'Start Icarous', E.clickSendStartIcarous));

            } else if (ac.status == 2) {
                ac.prev_panel = 'inFlight_pan'
                // RTL

                // add a stop flight button
                // Not sure what we should do with this RTL/Land Immidiatley/Power off Midair
                // btn_div.appendChild(FM.addBlockButton(ac.id, 'stop_flight', 'Stop Flight', E.clickStopFlight));

                // add a start flight button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'start', 'Start Icarous', E.clickSendStartIcarous));

                // add reset icarous button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'reset_icarous', 'Reset Icarous', E.clickResetIcarous))

            } else if (ac.status == 3) {
                console.log('Build post flight panel.')
            }


            // add geofence button

            // update ac
            if (!ac.gf_list) {
                ac['gf_list'] = []
                ac['hasGf'] = true
                ac['activeGfSummary'] = false
            }
            let f = ac.prev_panel
            btn_div = GF.addGfButtons(btn_div, ac.id, f)

            // ***************************************************
            // add sim traffic buttons
            // if (MODE.sim) {
            //     // update ac
            //     if (!ac.traffic_list) {
            //         ac['traffic_list'] = []
            //         ac['hasT'] = false
            //         ac['activeTSummary'] = false
            //     }
            //     let t = ac.prev_panel
            //     btn_div = Traffic.addSimTrafficButtons(btn_div, ac.id, t)
            // }
            // ***************************************************

            // add forward data button
            btn_div.appendChild(FM.addBlockButton(ac.id, 'shutdown', 'Forward Data', E.clickForwardData));

            // add shutdown button
            btn_div.appendChild(FM.addBlockButton(ac.id, 'shutdown', 'Shutdown', E.clickShutdown));

        } else if (ac.mode == 'HITL') {

            if (ac.status == 0) {

                // add load wp from file
                btn_div.appendChild(FM.addFileLoadButton(ac.id, `wp_load${ac.id}`, 'Load WP File', E.clickLoadWPFile))

                // save wp's to file
                btn_div.appendChild(FM.addTextInput(`wp_file_save_${ac.id}`, "Save WP's To File", MODE.save_wp_default, E.enterSaveWp))

                // add form to panel
                ac_pan_div.appendChild(FM.addForm(`ac_fp_form_${ac.id}`, 'myform'))

                // create form elements
                form.createFlightPlanTable(ac);

                // ***************************************************
                // add radar buttons
                if (MODE.radar) {
                    btn_div.appendChild(FM.addBlockButton(ac.id, 'r_on', 'Turn Radar On', E.clickTurnRadarOn));
                    btn_div.appendChild(FM.addBlockButton(ac.id, 'r_off', 'Trun Radar Off', E.clickTurnRadarOff));
                }

                // ***************************************************

                // add submit button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'submit_fp', 'Submit Flight Plan', E.clickSubmitFlightPlan));

                // add change aircraft parameters button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'change_parameters', 'Change Aircraft Parameters', E.clickChangeParameters));

            } else if (ac.status == 1) {
                // add edit flight plan button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'edit_fp', 'Edit Flight Plan', E.clickEditFlightPlan));

                // add a start flight button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'start', 'Start Flight', E.clickSendStartFlight));

                // add a start flight button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'start', 'Start Icarous', E.clickSendStartIcarous));

            } else if (ac.status == 2) {

                // add a start flight button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'start', 'Start Icarous', E.clickSendStartIcarous));

                // add reset icarous button
                btn_div.appendChild(FM.addBlockButton(ac.id, 'reset_icarous', 'Reset Icarous', E.clickResetIcarous))

            } else if (ac.status == 3) {
                console.log('Build post flight panel.')
            }

            // ***************************************************
            // add geofence button

            // update ac
            if (!ac.gf_list) {
                ac['gf_list'] = []
                ac['hasGf'] = true
                ac['activeGfSummary'] = false
            }
            let f = ac.prev_panel
            btn_div = GF.addGfButtons(btn_div, ac.id, f)

            // ***************************************************
            // add sim traffic buttons
            // if (MODE.sim) {
            //     // update ac
            //     if (!ac.traffic_list) {
            //         ac['traffic_list'] = []
            //         ac['hasT'] = false
            //         ac['activeTSummary'] = false
            //     }
            //     let t = ac.prev_panel
            //     btn_div = Traffic.addSimTrafficButtons(btn_div, ac.id, t)
            // }
            // ***************************************************
	    
            // add forward data button
            btn_div.appendChild(FM.addBlockButton(ac.id, 'forward', 'Forward Data', E.clickForwardData));

        } else if (ac.mode == 'Playback') {
            if (ac.status == 0) {
                // add form to panel
                ac_pan_div.appendChild(FM.addForm(`ac_fp_form_${ac.id}`, 'myform'))

                // create form elements
                form.createFlightPlanTable(ac);
            }

        }

        btn_div.appendChild(FM.addBlockButton(`daa_${ac.id}`, 'open_daa', 'Open DAA Display', E.clickOpenDAADisplay));
        btn_div.appendChild(FM.addBlockButton(`centerOnAC${ac.id}`,'centerOnAC', 'Center Map on Aircraft', E.clickCenterMapOnAC))
        
        let name
        if (ac.status == 0) {
            name = 'pan'
        } else if (ac.status == 1) {
            name = 'info_pan'
        } else if (ac.status == 2) {
            name = 'inFlight_pan'
        } else if (ac.status == 3) {
            name = 'postFlight_pan'
        }
        btn_div.setAttribute('id', `btn_div_${name}_${ac.id}`)
        return btn_div
    }

    /**
     * @function <a name="updateContextMenu">pdateContextMenu</a>
     * @description Populates the context menu based on current aircraft and mode settings.
     * @param ac {Object} Aircraft Object.
     * @memberof module:mode
     * @instance
     */
    updateContextMenu(ac) {
        let mymap = map.getMap()
        // clear the context menu
        mymap.contextmenu.removeAllItems()

        // add options for hitl and playback
        if (ac.mode == "SITL") {
            mymap.contextmenu.addItem({
                text: "New Aircraft",
                callback: function (e) {
                    let loc = [e.latlng.lat, e.latlng.lng]
                    E.createNewAircraft(null, 1, loc, 'SITL')
                }
            })

            if (MODE.sim_type == 'ArduCopter') {
                mymap.contextmenu.addItem({
                    text: "New Aircraft (No IC)",
                    callback: function (e) {
                        let loc = [e.latlng.lat, e.latlng.lng]
                        E.createNewAircraft(null, 0, loc, 'SITL')
                    }
                })
            }

            mymap.contextmenu.addItem({
                separator: true
            })

            mymap.contextmenu.addItem({
                text: "Add Waypoint",
                callback: map.AddNewWaypointClick
            })
            mymap.contextmenu.addItem({
                separator: true
            })
            TE.updateContextMenuT()
            GE.updateContextMenuGF()
            mymap.contextmenu.addItem({
                separator: true
            })
            mymap.contextmenu.addItem({
                text: 'Shutdown',
                callback: E.contextShutdownAc
            })

            // disable new ac option if not allowing multi ac
            if (!MODE.multi) {
                mymap.contextmenu.setDisabled(0, true)
            }
            // disable new wp after flight plan is submitted
            if (ac.status >= 1) {
                mymap.contextmenu.setDisabled(2, true)
            }
        } else if (ac.mode == 'HITL') {
            mymap.contextmenu.addItem({
                text: "New SIM Aircraft",
                callback: function (e) {
                    let loc = [e.latlng.lat, e.latlng.lng]
                    E.createNewAircraft(null, 1, loc, 'SITL')
                }
            })

            if (MODE.sim_type == 'ArduCopter') {
                mymap.contextmenu.addItem({
                    text: "New Aircraft (NO IC)",
                    callback: function (e) {
                        let loc = [e.latlng.lat, e.latlng.lng]
                        E.createNewAircraft(null, 0, loc, 'SITL')
                    }
                })
            }

            mymap.contextmenu.addItem({
                separator: true
            })

            mymap.contextmenu.addItem({
                text: "Add Waypoint",
                callback: map.AddNewWaypointClick
            })
            mymap.contextmenu.addItem({
                separator: true
            })
            TE.updateContextMenuT()
            GE.updateContextMenuGF()
            mymap.contextmenu.addItem({
                separator: true
            })
            mymap.contextmenu.addItem({
                text: 'Shutdown',
                callback: E.contextShutdownAc
            })

            // disable new ac option if not allowing multi ac
            if (!MODE.multi) {
                mymap.contextmenu.setDisabled(0, true)
            }
            // disable new wp after flight plan is submitted
            if (ac.status >= 1) {
                mymap.contextmenu.setDisabled(2, true)
            }
        } else if (ac.mode == 'Playback') {
            mymap.contextmenu.addItem({
                text: "Play",
                callback: E.sendPlayPlayback
            })
            mymap.contextmenu.addItem({
                text: "Fast Forward",
                callback: E.sendFFPlayback
            })
            mymap.contextmenu.addItem({
                text: "Rewind",
                callback: E.sendRewPlayback
            })
            mymap.contextmenu.addItem({
                text: "Skip Forward",
                callback: E.sendSkipPlayback
            })
            mymap.contextmenu.addItem({
                separator: true
            })
            mymap.contextmenu.addItem({
                text: "Stop",
                callback: E.sendStopPlayback
            })
        }
    }
}
