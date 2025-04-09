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
                data.accounts.forEach(function(account){
                    console.log(account);
                    account.currentotp = CONNECTOR.getOtpFromAccount(account);
                });
                OTPUI.print_accounts(data.accounts);
            });
        } catch {
            set_result("Error loading: " + server + "/index.php/apps/otpmanager/accounts");
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
                    alert('Initialization Vector could not be loaded. Cannot generate OTP-codes!');
                } else {
                    CONFIG.set('iv', data.iv);
                    CONFIG.store();
                }
            });
        } catch {
            set_result("Error loading: " + server + "/ocs/v2.php/apps/otpmanager/password/check");
            return false;
        }
    },
    getAlgorithm: function(n) {
        return ["SHA1", "SHA256", "SHA512"][n];
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
    }
}