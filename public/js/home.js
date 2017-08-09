var DefaultView = function()
{
    var self = this;
    self.requestGetDataURL = '/weathermonitor/public/getData';
    self.sideBar = 'sidebar';
    self.datePickerFrom = 'datepicker-from';
    self.datePickerTo = 'datepicker-to';
    self.viewPicker = 'view-picker';
    self.searchButton = 'search-button';
    self.viewMain = 'main';

    self.init = function()
    {
        self.defaultEvents();
    };

    self.defaultEvents = function()
    {
        self.sideBarEvents();
    };

    self.sideBarEvents = function()
    {

        new Picker.Date($(self.datePickerFrom), {
            timePicker: false,
            positionOffset: {x: 5, y: 0},
            pickerClass: 'datepicker_dashboard',
            useFadeInOut: !Browser.ie
        });

        new Picker.Date($(self.datePickerTo), {
            timePicker: false,
            positionOffset: {x: 5, y: 0},
            pickerClass: 'datepicker_dashboard',
            useFadeInOut: !Browser.ie
        });

    };

    $(self.searchButton).removeEvents();
    $(self.searchButton).addEvent('click', function(e)
    {
        e.preventDefault();

        if (!self._request || !self._request.isRunning())
        {
            // data = {
            //     'email-mobile' : submitData['email-mobile'],
            //     'SMSCSRFTOKEN' : token
            // };
            self._request = new Request.JSON(
            {
                'url' : self.requestGetDataURL,
                'method' : 'GET',
                'onSuccess' : function(data)
                {
                    Array.each(data, function(weather_data, index){
                        console.log(weather_data);

                    });


                },
                'onError' : function(data)
                {
                    console.log(data);
                }
                }).send();
            }
        //$('forgot-input').setStyle('display', 'block');
        //$('email-mobile').set('value', '');

    });

};


var WeatherMonitor =
{
    weatherMonitorObj : null,
    _request : null,

    init : function()
    {

        this.initDefault();

    },

    initDefault : function()
    {
        var self = this;

        self.weatherMonitorObj = new DefaultView();
        self.weatherMonitorObj.init();
    }
};


window.addEvent('domready', function() {
    WeatherMonitor.init();
});
