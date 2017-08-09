function isNullOrWhiteSpace(str){
    return str === null || str.match(/^ *$/) !== null;

}

var NewPassword = function()
{
    var self = this;

    //URL
    self.requestNewPasswordURL =  baseURL + '/login/requestNewPassword'; //'/netcast4demo.chikka.com/htdocs/login/requestNewPassword';
    self.addNewButtonId = 'forgotpw';
    self.overlayId = 'overlay';
    self.dialogId = 'dialog-wrapper';
    self.formId = 'forgot-password-form';
    self.passwordDialogId = 'new-forgot-password';
    self.errorMessageClass = 'error-message';
    self.fieldErrorClass = 'error-message';
    self.requiredFields = {
        'email-mobile' : 'email-mobile-error'
    };
    self.fields = {
        'email-mobile' : 'Email'
    };
    self.cancelButtonId = 'create-cancel-button';
    self.cancelButtonId1 = 'create-cancel-button1';

    self.inputClass = 'input[class~=add-text]';
    self.okButtonId = 'create-ok-button';
    self.submitFields = [];

    self.init = function()
    {
        self.modalEvents();
    };

    self.startModal = function()
    {
        self.constructField();

        $(self.overlayId).setStyle('display', 'block');
        $$('body').addClass('dialog-active');
        $(self.dialogId).setStyle('display', 'block');
        $(self.passwordDialogId).setStyle('display', 'block');
        $('passwdfield').setStyle('display', 'block');
        $('footer-mod').setStyle('display', 'block');

        newAccountHandler.resizer();
    };

    self.constructField = function()
    {
        Object.each(self.fields, function(val, idx)
        {
            self.submitFields.push(idx);
            required = (self.requiredFields[idx]) ? true : false;
        });
    };

    1
    self.showError = function(errors)
    {
        $$('.' + self.fieldTextClass).removeClass('field-error');

        if (Object.getLength(errors))
        {
            Object.each(errors, function(val, idx)
            {
                $$('.field-' + idx).addClass('field-error');
                $(self.requiredFields[idx]).set('html', val);
                $(self.requiredFields[idx]).wink(1000);
            });

            return false;
        }
        else
            return true;

    };


    self.closeDialog = function()
    {
        $(self.overlayId).setStyle('display', 'none');
        $$('body').removeClass('dialog-active');
        $(self.dialogId).setStyle('display', 'none');
        $(self.passwordDialogId).setStyle('display', 'none');
    };

    //ajax processing
    self.processForgotPassword = function()
    {
        if (!self._request || !self._request.isRunning())
        {
            submitData = {};
            Array.each(self.submitFields, function(val)
            {
                submitData[val] = $(val).get('value').trim();

            });

            data = {
                'email-mobile' : submitData['email-mobile'],
                'SMSCSRFTOKEN' : token
            };
            self._request = new Request.JSON(
            {
                'url' : self.requestNewPasswordURL,
                'method' : 'POST',
                'data' : data,
                'onSuccess' : function(data)
                {

                    if (data.hasError)
                    {

                        var tmpDiv = new Element('div',{html:'<div id="password-send-notice" class="notifier notifier-error" style="display: block"><p>' + data.errorMessage + '</p></div>'});
                        tmpDiv.getFirst().replaces($('password-send-notice'));
                        // $('new-brandname-error').setStyle('display', 'block');

                    }
                    else
                    {
                        var tmpDiv1 = new Element('div',{html:'<div id="password-send-notice" class="notifier" style="display: block"><p>' + data.successMessage + '</p></div>'});
                        tmpDiv1.getFirst().replaces($('password-send-notice'));
                        $('passwdfield').setStyle('display', 'none');
                        $('footer-mod').setStyle('display', 'none');
                        $('footer-ok').setStyle('display', 'block');

                    }
                },
                'onError' : function(data)
                {
                    Confirm.show('Error',Utils.OnError());
                    self._request.stop;
                }
            }).send();
        }
    };

    self.modalEvents = function()
    {
        $(self.formId).removeEvents();
        $(self.formId).addEvent('submit', function(e)
        {
            e.preventDefault();
            requiredFields = {
                    'email-mobile' : 'Cannot be empty'
            };

            if ($('email-mobile').get('value') == '' || isNullOrWhiteSpace($('email-mobile').get('value')))
            {
                self.showError(requiredFields);

            }
            else
            {
                self.processForgotPassword();
            }


        });


        $(self.addNewButtonId).removeEvents();
        $(self.addNewButtonId).addEvent('click', function(e)
        {
            e.preventDefault();
            self.startModal();
        });

        $$(self.inputClass).removeEvents();
        $$(self.inputClass).addEvents(
        {
            'focus' : function()
            {
                $(this).getParent('div').addClass('active');
            },
            'blur' : function()
            {
                $(this).getParent('div').removeClass('active');
            }
        });

        $(self.cancelButtonId).removeEvents();
        $(self.cancelButtonId).addEvent('click', function(e)
        {
            e.preventDefault();

            //$('forgot-input').setStyle('display', 'block');
            //$('forgot-send').setStyle('display', 'block');
            $('password-send-notice').setStyle('display', 'none');
            $('email-mobile').set('value', '');

            self.closeDialog();
        });

        $(self.cancelButtonId1).removeEvents();
        $(self.cancelButtonId1).addEvent('click', function(e)
        {
            e.preventDefault();

            //$('forgot-input').setStyle('display', 'block');
            //$('forgot-send').setStyle('display', 'block');
            $('password-send-notice').setStyle('display', 'none');
            $('email-mobile').set('value', '');

            self.closeDialog();
        });

        $(self.okButtonId).removeEvents();
        $(self.okButtonId).addEvent('click', function(e)
        {
            e.preventDefault();

            //$('forgot-input').setStyle('display', 'block');
            //$('forgot-send').setStyle('display', 'block');
            $('password-send-notice').setStyle('display', 'none');
            $('footer-ok').setStyle('display', 'none');
            $('email-mobile').set('value', '');

            self.closeDialog();
        });
    };
};

var newAccountHandler =
{
    resizer : function()
    {
        var self = newAccountHandler;
        var theBox = $(ForgotPassword.passwordObj.passwordDialogId),
            winSize = window.getSize(),
            boxSize = theBox.getSize();
        theBox.setPosition({
            'x'  : ( ( winSize.x / 2 ) - ( boxSize.x / 2 ) ),
            'y' : ( ( winSize.y / 2 ) - ( boxSize.y / 2 ) )
        });

        window.removeEvent('resize', self.resizer);
        window.removeEvent('scroll', self.resizer);
        window.addEvent('resize', self.resizer);
        window.addEvent('scroll', self.resizer);
    }
};

var ForgotPassword =
{
    passwordObj : null,
    _request : null,

    init : function()
    {

        this.initNewPassword();

    },

    initNewPassword : function()
    {
        var self = this;

        self.passwordObj = new NewPassword();
        self.passwordObj.init();
    }
};

window.addEvent('domready', function()
{
    ForgotPassword.init();
});
