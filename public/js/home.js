function number_format (number, decimals, dec_point, thousands_sep)
{

  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function isValidDate (date)
{
  var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
  var matches = IsoDateRe.exec(date);
  if (!matches) return false;


  var composedDate = new Date(matches[1], (matches[2] - 1), matches[3]);

  return ((composedDate.getMonth() == (matches[2] - 1)) &&
          (composedDate.getDate() == matches[3]) &&
          (composedDate.getFullYear() == matches[1]));

}

var DefaultView = function()
{
    var self               = this;
    self._request          = null;
    self.requestGetDataURL = '/getData';
    //self.requestGetGraphDataURL_prod = '/getGraphData';
    //self.requestGetDataURL_dev = '/weathermonitor/public/getData';
    //self.requestGetGraphDataURL = '/weathermonitor/public/getGraphData';
    self.sideBar           = 'sidebar';
    self.datePickerFrom    = 'datepicker-from';
    self.datePickerTo      = 'datepicker-to';
    self.viewPicker        = 'view-picker';
    self.searchButton      = 'search-button';
    //Table
    self.viewMain          = 'main-table';
    self.viewTable         = 'data-result';
    self.emptyResultId     = 'empty-result';

    //pagination
    self.prevId            = 'prev-main-button';
    self.nextId            = 'next-main-button';
    self.totalDataId       = 'total-main-data';
    self.totalPartId       = 'total-main-part';
    self.pageLimit         = 1;

    //self.search 		   = {};
    self.resultData        = [];
    self.totalPage         = 1;
    self.currentPage       = 1;

    //sorting
    self.sortOrder         =  null;
    self.sortDate          = 'sort-date-button';
    self.testPostButton    = 'test-post-button';

    //Graph
    self.viewGraph         = 'main-graph';
    self.graphOne          = 'container-one';
    self.graphTwo          = 'container-two';
    self.graphThree        = 'container-three';
    self.graphCategory     = [];
    self.graphTemp         = [];
    self.graphPressure     = [];
    self.graphWindSpeed    = [];
    self.graphRainfall     = [];
    self.graphHumidity     = [];
    self.chartOne          = "";
    self.chartTwo          = "";
    //self.chartThree        = "";

    self.init = function()
    {
        self.getData();
    };

    self.getData = function()
    {
        self.getAjaxData(
          self.currentPage,
          self.sortOrder,
          //callbacks
          [
            self.addEvents
          ]
        );
    };

    self.disposeData = function()
    {
        $(self.viewTable).empty();
        //$$('.' + self.emptyResultClass).dispose();
    };

    self.getAjaxData = function(page, sort, callbacks)
    {
        if (!self._request || !self._request.isRunning())
        {
            if (!page)
              page = 1;

            //Check and validate date
            if ($(self.datePickerFrom).get('value') == "" || isValidDate($(self.datePickerFrom).get('value')) == false)
                $(self.datePickerFrom).set('value',new Date().format('%Y-%m-%d'))

            if ($(self.datePickerTo).get('value') == "" || isValidDate($(self.datePickerTo).get('value')) == false)
                $(self.datePickerTo).set('value',new Date().format('%Y-%m-%d'))


            arrayData = {
                'dateFrom'          : $(self.datePickerFrom).get('value'),
                'dateTo'            : $(self.datePickerTo).get('value'),
                'page'              : page,
                'sort'              : sort

            };

            //Set what functions to use depending on view selected/Validate picker value
            if ($(self.viewPicker).get('value') == "graph")
            {
                $(self.viewMain).setStyle('display' , 'none');
                $(self.viewGraph).setStyle('display', 'block');
                self.requestGetDataURL = '/getGraphData'; //'/weathermonitor/public/getGraphData';
                callbacks.push(self.renderGraph);
            }
            else if ($(self.viewPicker).get('value') == "table")
            {
                $(self.viewMain).setStyle('display' , 'block');
                $(self.viewGraph).setStyle('display', 'none');
                callbacks.push(self.renderData);
                callbacks.push(self.paginationChecker);
            }
            else
            {
                $(self.viewPicker).set('value') == "table"
            }

            //Fetch Data from Database
            self._request = new Request.JSON(
            {
                'url' : self.requestGetDataURL,
                'method' : 'GET',
                'data' : arrayData,
                'onSuccess' : function(data)
                {
                    self.disposeData();

                    if ($(self.viewPicker).get('value') == "table")
                    {
                        self.currentPage        = data.page;
                        self.totalPage          = data.totalPage;
                        self.pageLimit          = data.limit;
                    }

                    self.resultData         = data.resultData;

                    if ($(self.viewPicker).get('value') == "table")
                    {
                        if(data.resultData.length)
                        {
                            $$('#' + self.totalDataId).set('html', ' of ' + data.totalData);
                        }
                        else
                        {
                            $$('#' + self.totalDataId).set('html','');
                        }
                    }

                    if(callbacks)
                    {
                        Array.each(callbacks, function(callback)
                        {
                            callback();
                        });
                    }

                },
                'onError' : function(data)
                {
                    console.log('Fail');
                    console.log(data);
                    self._request.stop;
                }
                }).send();
            }

    };

    //Page Checking - Table
    self.paginationChecker = function()
    {
        $(self.prevId).setStyle('display', 'inline-block');
        $(self.nextId).setStyle('display', 'inline-blockblock');

        //first check the preview button whether it will be disable or not
        if(self.currentPage == 1)
        {
            $(self.prevId).setStyle('display', 'none');
            //$(self.prevId).addClass('disable');
        }
        else
        {
            $(self.prevId).setStyle('display', 'inline-block');
            //$(self.prevId).removeClass('disable');
        }

        //second check the next button whether it will be disable or not
        if(self.currentPage < self.totalPage)
        {
            $(self.nextId).setStyle('display', 'inline-block');
            //$(self.nextId).removeClass('disable');
        }
        else
        {
            $(self.nextId).setStyle('display', 'none');
            //$(self.nextId).addClass('disable');
        }

        //below will be the calcutaion and displaying for the total data results
        var start = (self.pageLimit * self.currentPage) - self.pageLimit + 1;
        var end   = (start + self.resultData.length) - 1;

        if(self.resultData.length)
        {
            $(self.totalPartId).set('html', number_format(start) + '-' + number_format(end));
        }
        else
        {
            $(self.totalPartId).set('html', '');
            /*disable both prev and next ID*/

            //$(self.prevId).addClass('disable');
            //$(self.nextId).addClass('disable');

            $(self.prevId).setStyle('display', 'none');
            $(self.nextId).setStyle('display', 'none');
        }
    };

    //Render Table
    self.renderData = function()
    {
        $$('#' + self.emptyResultId).dispose();

        if(self.resultData.length)
        {
            Array.each(self.resultData, function(val, idx)
            {
                var contentHTML = '<td>' + val['temp'] + '</td>'
                                + '<td>' + val['pressure'] + '</td>'
                                + '<td>' + val['wind_speed'] + '</td>'
                                + '<td>' + val['wind_direction'] + '</td>'
                                + '<td>' + val['rainfall'] + '</td>'
                                + '<td>' + val['humidity'] + '</td>'
                                + '<td>' + val['date_received'] + '</td>'
                                //+ '<td> <a id="view_' + val['id']+ '" href="#"> View </a>' + cancel + edit + '</td>';

                contentElem = new Element('<tr />',
                {
                    'id'  : '',
                    'html'  : contentHTML
                });
                contentElem.inject($(self.viewTable), "bottom");
            });
        }
        else
        {
            var emptyHTML = '<td colspan="8"><center>No record found.</center></td>';

            emptyElem = new Element('</tr>',
            {
              'id'  : self.emptyResultId,
              'html'  : emptyHTML
            });

            emptyElem.inject($(self.viewTable), "bottom");
        }
    };

    //Render Graph
    self.renderGraph = function()
    {
        self.graphCategory.empty();
        self.graphTemp.empty();
        self.graphPressure.empty();
        self.graphWindSpeed.empty();
        self.graphRainfall.empty();
        self.graphHumidity.empty();

        Array.each(self.resultData, function(val, idx)
        {
            windData = {
                'y'          : val['wind_speed'],
                'direction'  : val['wind_direction']

            };

            self.graphCategory.push(val['date_received']);
            self.graphTemp.push(val['temp']);
            self.graphPressure.push(val['pressure']);
            self.graphWindSpeed.push(windData);
            self.graphRainfall.push(Number.from(val['rainfall']));
            self.graphHumidity.push(val['humidity']);
        });

         console.log(self.graphCategory);
        // console.log(self.graphPressure);
        // console.log(self.graphWindSpeed);
        // console.log(self.graphRainfall);
        // console.log(self.graphHumidity);
        self.chartOne = new Highcharts.Chart({
        chart: {
            renderTo: self.graphOne,
            plotBorderWidth: 1,
            plotBorderColor: "#666"
        },
        title: {
            text: 'Temp - Pressure - Wind Speed/Direction'
        },
        xAxis: {
            categories: self.graphCategory,//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            lineColor: '#666',
            tickLength: 0,
            tickPosition: 'inside',
            tickmarkPlacement: 'on',
            tickColor: '#ccc',
            minPadding: 0,
            maxPadding: 0
        },
        yAxis: {
            min: 0,
            minRange: 1
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                var s = '<b>' + this.x + '</b>',
                    points = this.points,
                    windDirectionPointer = "",
                    counter = 0;

                Array.each(this.points, function(val, idx)
                {
                    s += '<br/>' + val['series']['name'] + ': ' +
                    val['y'] ;
                    //console.log(val);
                    if (val['point']['direction'])
                        windDirectionPointer = points[idx].point.direction;
                });

                if (windDirectionPointer.length)
                {
                    s += '<br/> Wind Direction : ' +  windDirectionPointer;
                }
                return s;

            },
            shared: true
        },
        series: [{
            name: 'Temperature',
            data: self.graphTemp//[29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            name: 'Pressure',
            data: self.graphPressure//[28.7, 99.5, 106.3, 992, 992,]
        }, {
            name: 'Wind Speed',
            data: self.graphWindSpeed
        }]
        });

        self.chartTwo = new Highcharts.Chart({
        chart: {
            renderTo: self.graphTwo,
            plotBorderWidth: 1,
            plotBorderColor: "#666"
        },
        title: {
            text: 'Rainfall - Humidity'
        },
        xAxis: {
            categories: self.graphCategory,
            lineColor: '#666',
            tickLength: 0,
            tickPosition: 'inside',
            tickmarkPlacement: 'on',
            tickColor: '#ccc',
            minPadding: 0,
            maxPadding: 0
        },
        yAxis: {
            min: 0,
            minRange: 1
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        series: [{
            name: 'Rainfall',
            data: self.graphRainfall
        }, {
            name: 'Humidity',
            data: self.graphHumidity
        }]
        });

    };

    //Add element events
    self.addEvents = function()
    {
        new Picker.Date($(self.datePickerFrom), {
            timePicker: false,
            format: '%Y-%m-%d',
            positionOffset: {x: 5, y: 0},
            pickerClass: 'datepicker_vista',
            useFadeInOut: !Browser.ie,
            maxDate : new Date(),
            onSelect: function(date){
                //myHiddenField.set('value', date.format('%s'));
                $(self.datePickerTo).set('value', '');
                console.log('test1');
                new Picker.Date($(self.datePickerTo), {
                    timePicker: false,
                    format: '%Y-%m-%d',
                    positionOffset: {x: 5, y: 0},
                    pickerClass: 'datepicker_vista',
                    useFadeInOut: !Browser.ie,
                    minDate : date,
                    maxDate: new Date()
                });
	        }
        });

        $(self.searchButton).removeEvents();
        $(self.searchButton).addEvent('click', function(e)
        {
            e.preventDefault();
            self.getData();

        });

        $(self.prevId).removeEvents();
        $(self.prevId).addEvent('click', function(e)
        {
            e.preventDefault();

            //if(!$(self.prevId).hasClass('disable'))
            //{
                self.currentPage--;
                self.getData();
            //}
        });

        $(self.nextId).removeEvents();
        $(self.nextId).addEvent('click', function(e)
        {
            e.preventDefault();

            //if(!$(self.nextId).hasClass('disable'))
            //{
                self.currentPage++;
                self.getData();

            //}
        });

        $(self.sortDate).removeEvents();
        $(self.sortDate).addEvent('click', function()
        {
            if(self.sortOrder == 'ASC')
            {
                self.sortOrder = 'DESC';
                self.getData();
            }
            else
            {
                self.sortOrder = 'ASC';
                self.getData();
            }

        });

        $(self.testPostButton).removeEvents();
        $(self.testPostButton).addEvent('click', function(e)
        {

            var now = new Date().format("%Y-%m-%d %H:%M:%S");
            console.log(now);
            e.preventDefault();
            testData = {
                'station_id'     : 101,
                'temp'           : 12,
                'pressures'       : 1002,
                'wind_speed'     : 23,
                'wind_direction' : 'NorthEast',
                'rainfall'       : '34',
                'humidity'       : 90,
                'date_received'  : new Date().format("%Y-%m-%d %H:%M:%S")
            };

            self._request = new Request.JSON(
            {
                //'url_dev' : '/weathermonitor/public/postDataAndroid',
                'url' : '/postDataAndroid',
                'method' : 'POST',
                'data' : testData,
            'onSuccess' : function(data)
            {
                console.log('Success');
                console.log(data);

            },
            'onError' : function(data)
            {
                console.log('Fail');
                console.log(data);
                self._request.stop;
            }
            }).send();
        });

    };
};


var WeatherMonitor =
{

    weatherMonitorObj : null,

    init : function()
    {

        var self = this;
        this.initDefault();
    },

    initDefault : function()
    {
        var self = this;
        self.weatherMonitorObj = new DefaultView();
        self.weatherMonitorObj.init();
    }
};

window.addEvent('domready', function()
{
    WeatherMonitor.init();
});
