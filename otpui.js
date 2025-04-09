const OTPUI = {

    print_accounts: function(accounts) {
        let container = $('#accounts').empty();
        let group = $('<div>').addClass('list-group');
        accounts.forEach(function(account) {
            let a = $('<a>').addClass('list-item'); // Prepared as copy-button
            let item = $('<div>').addClass('d-flex w-100 justify-content-between');
            item.append($('<p>').addClass('mb-1 issuer').html(account.issuer));
            item.append($('<small>').html(account.currentotp));
            a.append(item);
            group.append(a);
        });
        container.append(group);
    },
    /**
     * Show an alert.
     * @param result
     * @param alerttype warning, success, ... in case no alerttype is specified, set to "warning".
     */
    set_result: function(result, alerttype) {
        $('#main-alert').empty();
        if (typeof alerttype === 'undefined') {
            alerttype = 'warning';
        }
        // Remove all other classes and set only the desired alerttype.
        $('#main-alert').set('class', 'alert').addClass('alert-' + alerttype).html(result);
    }
}