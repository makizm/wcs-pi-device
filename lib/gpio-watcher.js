const fs = require('fs');
const debug = require('debug')('gpio-watcher')

const GPIO_ROOT_PATH = '/sys/class/gpio/';

class GpioWatcher {
    constructor(gpio) {
        debug("Creating new instance of GPIO Watcher for GPIO %s", gpio);

        this._gpio = gpio;
        this._gpioPath = GPIO_ROOT_PATH + 'gpio' + this._gpio;
        this._gpioValuePath = this._gpioPath + '/value';

        debug("Verifying if GPIO %s is exported", gpio);

        // file must be present ie. pin must be exported
        if (!fs.existsSync(this._gpioPath)) {
            // do some error stuff or export the pin
            throw new Error("GPIO" + this._gpio + " is not exported in " + this._gpioPath);
        }

        // open file for read
        // file descriptor used later to read the contents
        // this._valueFd = fs.openSync(this._gpioValuePath, 'r');

        // read file value function
        this._readValue = (callback) => {
            debug("Reading new value %s", this._gpioValuePath);

            // fs.read(this._valueFd, new Buffer(1), 0, 1, 0, (err, bytes, buffer) => {
            fs.readFile(this._gpioValuePath, (err, buffer) => {
                if(err) {
                    debug(err);
                    return callback(err, null);
                }

                let value = Number(buffer.toString()) || 0;

                debug(value);

                // translate value for output
                // 0 = off
                // 1 = on
                let out = value === 1 ? "on" : "off";

                return callback(null, out);
            })
        }
    }
    start(listener) {
        fs.watchFile(this._gpioValuePath, () => {
            this._readValue(listener);
        })
    }
    stop() {
        fs.unwatchFile(this._gpioValuePath)
    }
}
exports.GpioWatcher = GpioWatcher;
