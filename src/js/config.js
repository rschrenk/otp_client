const CONFIG = {
    data: {
        'accounts': [],
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
            try {
                SELF.data[k] = JSON.parse(window.localStorage.getItem(k));
            } catch(e) {
                SELF.data[k] = window.localStorage.getItem(k);
            }
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
        this.data[k] = v;
    },
    /**
     * Store the local object to the localStorage.
     * @param {DOMElement} sender the DOMElement that initiated the store.
     */
    store: function(sender) {
        console.log('CONFIG.store(sender)', sender);
        $(sender).css('color', 'orange');
        let SELF = this;
        Object.entries(this.data).forEach(function(a) {
            let k = a[0];
            window.localStorage.setItem(k, JSON.stringify(SELF.data[k]));
        });
        setTimeout(function() {
            $(sender).css('color', 'unset');
        }, 500);
        if (typeof sender !== 'undefined') {
            CONNECTOR.load_iv();
        }
    }
}