var DefaultView = function()
{
    var self = this;
    self._request = null;
    self.requestGetDataURL = '/weathermonitor/public/getData';
    self.sideBar = 'sidebar';
    self.datePickerFrom = 'datepicker-from';
    self.datePickerTo = 'datepicker-to';
    self.viewPicker = 'view-picker';
    self.searchButton = 'search-button';
    self.viewMain = 'main';
    self.viewTable = 'data-result';

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
                    Array.each(data, function(val, idx)
                    {
                        console.log(val);
                        var contentHTML = '<td>' + val.temp + '</td>'
                                        + '<td>' + val.pressure + '</td>'
                                        + '<td>' + val.wind_speed + '</td>'
                                        + '<td>' + val.wind_direction + '</td>'
                                        + '<td>' + val.rainfall + '</td>'
                                        + '<td>' + val.humidity + '</td>'
                                        + '<td>' + val.visibility + '</td>'
                                        + '<td>' + val.date + '</td>'
                                        //+ '<td> <a id="view_' + val['advisory_id']+ '" href="#"> View </a>' + cancel + edit + '</td>';


                        contentElem = new Element('<tr />',
                        {
                            'id'  : '',
                            'html'  : contentHTML
                        });
                        contentElem.inject($(self.viewTable), "bottom");
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
