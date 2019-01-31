const os = require('os');

// Check if running on Raspberry PI
// otherwise I2C and GPIO will throw error
if(os.arch() != 'arm') {
    throw new Error('GPIO is not available. You\'re not a Raspberry PI');
}

const gpio = require('rpi-gpio');
const { GpioWatcher } = require('./lib/gpio-watcher');

const getSensors = function(callback) {
    callback(null, [
        { id: 1, pin: 16, gpio: 23, enabled: true, type: '', name: '', description: '', units: '' },
    ])
}

getSensors((error, sensors) => {
    if(error) throw error;

    sensors.forEach(sensor => {
        gpio.setup(sensor.pin, gpio.DIR_OUT, (error) => {
            if(error) throw error;
        
            const pinWatcher = new GpioWatcher(sensor.gpio);
        
            pinWatcher.start((err, value) => {
                if(value) {
                    console.log({ valve: sensor.id, value: value });
                }
            })
        })
    })
})
