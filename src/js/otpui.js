const OTPUI = {
    copy_to_clipboard: function(a) {
        var content = $(a).find('.otpcode').html();
        navigator.clipboard.writeText(content)
            .then(function() {
                OTPUI.highlight(a, 'alert-success', 1000);
            })
            .catch(function(){
                OTPUI.highlight(a, 'alert-warning', 1000);
            });
    },
    /**
     * Highlight a certain object by use of css classes for a certain period.
     * @param obj
     * @param classes
     * @param timeout
     */
    highlight: function(obj, classes, timeout) {
        $(obj).addClass(classes);
        setTimeout(function() { $(obj).removeClass(classes); }, timeout);
    },
    print_accounts: function(accounts) {
        let container = $('#accounts').empty();
        let group = $('<div>').addClass('list-group');
        let usessystray =
        accounts.forEach(function(account, index) {
            // Update app-pane
            let a = $('<a>')
                .attr('href', '#')
                .attr('onclick', 'OTPUI.copy_to_clipboard(this);')
                .addClass('account alert list-item');
            let item = $('<div>').addClass('d-flex w-100 justify-content-between');
            item.append($('<p>').addClass('item-index hidden').html(index));
            item.append($('<p>').addClass('item-counter hidden').html(account.period));
            item.append($('<p>').addClass('item-period hidden').html(account.period));
            item.append($('<p>').addClass('mb-1 issuer').html(account.issuer));
            item.append($('<small>').addClass('otpcode').html(account.currentotp));
            a.append(item);
            group.append(a);
            // update systray
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
        $('#main-alert').addClass('alert-' + alerttype).html(result);
    },
    toggle_page: function(pagetoopen) {
        $('[role=page]').addClass('hidden');
        $('#' + pagetoopen).removeClass('hidden');
    }
}