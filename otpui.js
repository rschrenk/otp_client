const OTPUI = {
    print_accounts: function(accounts) {
        let container = $('#accounts');
        let ul = $('<ul>');
        accounts.forEach(function(account) {
            let li = $('<li>');
            li.append($('<span>').addClass('issuer').html(account.issuer));
            li.append($('<span>').addClass('user').html(account.user));
            li.append($('<span>').addClass('currentotp').html(account.currentotp));
            ul.append(li);
        });
        container.append(ul);
    }
}