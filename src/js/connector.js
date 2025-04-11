const CONNECTOR = {
    headers: function() {
        let user = CONFIG.get('user');
        let pass = CONFIG.get('pass');
        return {
            "Authorization": 'Basic ' + btoa(user + ":" + pass),
            "OCS-APIRequest": "true"
        };
    },
    load_accounts: function() {
        console.log('CONNECTOR.load_accounts()');
        let headers = this.headers();
        let server = CONFIG.get('server');
        try {
            $.ajax({
                url: server + "/index.php/apps/otpmanager/accounts",
                data: {
                    credentials: "omit"
                },
                headers: headers
            }).done(function(data) {
                if (typeof data.accounts !== 'undefined') {
                    CONFIG.set('accounts', data.accounts);
                    CONFIG.store();
                    CONNECTOR.getOtpFromAccounts();
                }
            });
        } catch {
            OTPUI.set_result("Error loading: " + server + "/index.php/apps/otpmanager/accounts");
            return false;
        }
    },
    load_iv: function() {
        console.log('CONNECTOR.load_iv()');
        let headers = this.headers();
        let otppass = CONFIG.get('otppass');
        let server = CONFIG.get('server');
        headers['Content-Type'] = "application/json";
        try {
            $.ajax({
                method: 'POST',
                url: server + "/ocs/v2.php/apps/otpmanager/password/check",
                data: JSON.stringify({password: otppass}),
                headers: headers
            }).done(function(data) {
                if (typeof data.iv === "undefined") {
                    OTPUI.set_result('Initialization Vector could not be loaded. Cannot generate OTP-codes!');
                } else {
                    CONFIG.set('iv', data.iv);
                    CONFIG.store();
                    // Try to generate codes for locally available accounts.
                    CONNECTOR.getOtpFromAccounts();
                }
            });
        } catch {
            OTPUI.set_result("Error loading: " + server + "/ocs/v2.php/apps/otpmanager/password/check");
            OTPUI.toggle_page('config');
            return false;
        }
    },
    getAlgorithm: function(n) {
        return ["SHA1", "SHA256", "SHA512"][n];
    },
    /**
     * Get all account from configuration and calculate the OTP.
     * Update the interface afterwards.
     */
    getOtpFromAccounts: function() {
        // Check if there is an initialization vector
        let iv = CONFIG.get('iv');
        if (typeof iv === 'undefined') {
            // Load the iv before!
            CONNECTOR.load_iv();
        } else {
            let accounts = CONFIG.get('accounts');
            if (Array.isArray(accounts)) {
                accounts.forEach(function (account) {
                    account.currentotp = CONNECTOR.getOtpFromAccount(account);
                });
                OTPUI.print_accounts(accounts);
            }
        }
    },
    getOtpFromAccount: function(account) {
        const passHash = CryptoJS.SHA256(CONFIG.get('otppass')).toString();
        const key = CryptoJS.enc.Hex.parse(passHash);
        const parsedIv = CryptoJS.enc.Hex.parse(CONFIG.get('iv'));
        const dec = CryptoJS.AES.decrypt(account.secret, key, { iv: parsedIv });
        const secret = dec.toString(CryptoJS.enc.Utf8);

        if (account.type == "totp") {
            const totp = new OTPAuth.TOTP({
                issuer: account.issuer,
                label: account.name,
                algorithm: this.getAlgorithm(account.algorithm),
                digits: account.digits,
                period: account.period,
                secret: secret,
            });
            return totp.generate();
        } else {
            if (account.counter == 0) {
                account.code = "Click the button to generate HOTP code";
            } else {
                const hotp = new OTPAuth.HOTP({
                    issuer: account.issuer,
                    label: account.name,
                    algorithm: this.getAlgorithm(account.algorithm),
                    digits: account.digits,
                    counter: account.counter,
                    secret: secret,
                });
                return hotp.generate();
            }
        }
    },
    reload_counter: function() {
        let counter = parseInt($('#reload-counter').html())-1;
        let period = parseInt($('#reload-counter').data('period'));
        if (counter <= 0) {
            counter = period;
            CONNECTOR.load_accounts();
        }
        $('#reload-counter').html(counter);
        // Re-generate single otps.
        $('.item-counter').each(function() {
            let itemcounter = this;
            let accountpane = $(itemcounter).closest('.account');
            let counter = parseInt($(itemcounter).html())-1;
            let period = parseInt($(accountpane).find('.item-period').html());
            if (counter <= 0) {
                counter = period;
                let accounts = CONFIG.get('accounts');
                try {
                    let index = parseInt($(accountpane).find('.item-index').html());
                    let acc = accounts[index];
                    accounts[index].currentotp = CONNECTOR.getOtpFromAccount(acc);
                    $(accountpane).find('.otpcode').html(accounts[index].currentotp);
                    CONFIG.store();
                } catch (e) {
                    OTPUI.set_result(e.message, 'warning');
                    console.error(e);
                }
            }
            $(itemcounter).html(counter);
        });
    }
}