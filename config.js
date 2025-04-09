const CONFIG = {
    data: {
        'iv': '',
        'otppass': '',
        'pass': '',
        'server': '',
        'user': '',
    },
    /**
     * Takes the configuration from the form fields and stores to the local object.
     */
    change: function() {
        let SELF = this;
        Object.entries(this.data).forEach(function(a) {
            let k = a[0];
            SELF.set(k, $('#config_' + k).val());
        });
    },
    /**
     * get a certain value from the configuration.
     * @param k
     * @returns {*}
     */
    get: function(k) {
        return this.data[k];
    },
    /**
     * Load the configuration from localStorage and store to the local object.
     */
    load: function() {
        let SELF = this;
        Object.entries(this.data).forEach(function(a) {
            let k = a[0];
            SELF.data[k] = window.localStorage.getItem(k);
            $('#config_' + k).val(SELF.data[k]);
        });
    },
    /**
     * Set a certain configuration value in the local object.
     * ATTENTION: Does NOT store to localStorage!
     * @param k
     * @param v
     */
    set: function(k, v) {
        if (typeof this.data[k] === 'undefined') {
            console.log('Unknown configuration value', k);
        } else {
            this.data[k] = v;
        }
    },
    /**
     * Store the local object to the localStorage.
     * @param {DOMElement} sender the DOMElement that initiated the store.
     */
    store: function(sender) {
        $(sender).css('color', 'orange');
        let SELF = this;
        Object.entries(this.data).forEach(function(a) {
            let k = a[0];
            window.localStorage.setItem(k, SELF.data[k]);
        });
        setTimeout(function() {
            $(sender).css('color', 'unset');
        }, 500);
        CONNECTOR.load_iv();
    }
}