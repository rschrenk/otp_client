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
                    account.currentotp = getOtpFromAccount(account);
                });
                console.log(data);
                set_result(JSON.stringify(data));
            });
        } catch {
            set_result("Error loading: " + server + "/index.php/apps/otpmanager/accounts");
            return false;
        }
    },
    load_iv: function() {
        let headers = this.headers();
        let otppass = CONFIG.get('otppass');
        let server = CONFIG.get('server');
        headers['Content-Type'] = "application/json";
        console.log(headers);
        try {
            $.ajax({
                method: 'POST',
                url: server + "/ocs/v2.php/apps/otpmanager/password/check",
                data: {
                    password: otppass,
                    credentials: "omit"
                },
                headers: headers
            }).done(function(data) {
                console.log(data);
            });
        } catch {
            set_result("Error loading: " + server + "/ocs/v2.php/apps/otpmanager/password/check");
            return false;
        }
    },
    getOtpFromAccount: function(account) {
        const passHash = CryptoJS.SHA256(window.password).toString()

        const key = CryptoJS.enc.Hex.parse(passHash);
        const parsedIv = CryptoJS.enc.Hex.parse(window.accountIV);
        const dec = CryptoJS.AES.decrypt(account.secret, key, { iv: parsedIv });

        const secret = dec.toString(CryptoJS.enc.Utf8);

        if (account.type == "totp") {
            const totp = new OTPAuth.TOTP({
                issuer: account.issuer,
                label: account.name,
                algorithm: getAlgorithm(account.algorithm),
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
                    algorithm: getAlgorithm(account.algorithm),
                    digits: account.digits,
                    counter: account.counter,
                    secret: secret,
                });
                return hotp.generate();
            }
        }
    }
}