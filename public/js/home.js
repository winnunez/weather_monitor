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
    self.sideBar           = 'sidedrawer';
    self.showBarButton     = 'show-bar';
    self.hideBarButton     = 'hide-bar';
    self.datePicker        = 'datepicker';
    //self.datePickerTo      = 'datepicker-to';
    self.viewPicker        = 'view-picker';
    self.searchButton      = 'search-button';

    //Navbar
    self.navTable          = 'nav-table';
    self.navGraph          = 'nav-graph';
    self.navMap            = 'nav-map';

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

    //Date/time
    self.dateTimePicker    = 'datetime-picker';
    self.datePrevButton    = 'prev-date-button';
    self.dateNextButton    = 'next-date-button';
    self.dateTimeVal       =  null;
    self.timeCounter       =  null;
    //self.dateCounter       =  0;

    //help
    self.helpButton        = 'help-button';

    //self.search 		   = {};
    self.resultData        = [];
    self.totalPage         = 1;
    self.currentPage       = 1;
    self.selectedView      = 'Table';

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
          self.selectedView,
          self.currentPage,
          self.sortOrder,
          self.dateTimeVal,
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

    self.getAjaxData = function(view, page, sort, datetime, callbacks)
    {
        if (!self._request || !self._request.isRunning())
        {
            // var d = new Date('2017-07-07').format('%Y-%m-%d');
            // console.log(d);

            if (!page)
              page = 1;

            if (datetime == null) // First page call
            {
                //Check and validate date
                if ($(self.datePicker).get('value') == "" || isValidDate($(self.datePicker).get('value')) == false)
                    $(self.datePicker).set('value',new Date().format('%Y-%m-%d'))

                datefrom = $(self.datePicker).get('value') + ' 00:00:00';
                dateto = $(self.datePicker).get('value') + ' 23:59:59';
                console.log('first call');
                self.dateTimeVal = $(self.datePicker).get('value');
            }
            else if (datetime.length == 10)
            {
                datefrom = datetime + ' 00:00:00';
                dateto = datetime + ' 23:59:59';
                console.log('prev/next' + datetime);
            }
            else
            {
                //Format date to YYYY-MM-DD HH:MM:SS
                dateto = datetime;
                d = datetime.substring(0,10);
                datefrom = d + ' 00:00:00';
                console.log('timepicker' + datetime);
            }



            arrayData = {
                'dateFrom'          : datefrom,
                'dateTo'            : dateto,
                'page'              : page,
                'sort'              : sort

            };

            //Set View
            if (view == 'Graph')//$(self.viewPicker).get('value') == "graph"
            {
                $(self.viewMain).setStyle('display' , 'none');
                $(self.viewGraph).setStyle('display', 'block');
                self.requestGetDataURL = '/getGraphData';//'/weathermonitor/public/getGraphData';
                callbacks.push(self.renderGraph);
            }
            else if (view == 'Table')
            {
                $(self.viewMain).setStyle('display' , 'block');
                $(self.viewGraph).setStyle('display', 'none');
                self.requestGetDataURL = '/getData';//'/weathermonitor/public/getData';
                callbacks.push(self.renderData);
                callbacks.push(self.paginationChecker);
            }
            else
            {

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

                    if (view == 'Table')
                    {
                        self.currentPage        = data.page;
                        self.totalPage          = data.totalPage;
                        self.pageLimit          = data.limit;
                    }

                    self.resultData         = data.resultData;

                    if (view == 'Table')
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

        //Check the preview button whether it will be disable or not
        if(self.currentPage == 1)
        {
            $(self.prevId).setStyle('display', 'none');
        }
        else
        {
            $(self.prevId).setStyle('display', 'inline-block');
        }

        //Check the next button whether it will be disable or not
        if(self.currentPage < self.totalPage)
        {
            $(self.nextId).setStyle('display', 'inline-block');
        }
        else
        {
            $(self.nextId).setStyle('display', 'none');
        }

        //Below will be the calcutaion and displaying for the total data results
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
        // Build the option dialog
        //var selectList = $('#selectDropdown');
        // var curr_date = d.getDate();
        // var curr_month = d.getMonth() + 1;
        // var curr_year = d.getFullYear();'
        // if (dat)
        console.log(self.dateTimeVal);


        var d = new Date(self.dateTimeVal).format("%Y-%m-%d");


        $(self.dateTimePicker).empty();
        var newElement =  new Element('option');
        newElement.inject($(self.dateTimePicker));
        newElement.setProperty('value', d);
        newElement.appendText(d);

        var x = 1;

        for(var i =0; i < 24; i++)
        {
            var hour = ((i + 12) % 12 + 1);
            var a = i > 11 ? "pm" : "am";
            var ms = x == 24 ? ':59:59' : ':00:00';
            var hhr = x == 24 ? 23 : x++;
            var newElement =  new Element('option');
            newElement.inject($(self.dateTimePicker));
            newElement.setProperty('id', i);
            newElement.setProperty('value', d + ' ' + hhr + ms);
            if (self.timeCounter == i)
            {
                newElement.setAttribute('selected','selected');
            }
            newElement.appendText( d + ' ' + hour + ':00' + a);
        }

        // var d = new Date().getHours();
        // var a = i > 11 ? "pm" : "am";
        // var hour = ((d + 11) % 12 + 1);
        // $(self.dateTimePicker).val(hour + ':00 ' + a);

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


        var d = new Date(self.dateTimeVal).format("%Y-%m-%d");


        $(self.dateTimePicker).empty();
        var newElement =  new Element('option');
        newElement.inject($(self.dateTimePicker));
        newElement.setProperty('value', d);
        newElement.appendText(d);

        var x = 1;

        for(var i =0; i < 24; i++)
        {
            var hour = ((i + 12) % 12 + 1);
            var a = i > 11 ? "pm" : "am";
            var ms = x == 24 ? ':59:59' : ':00:00';
            var hhr = x == 24 ? 23 : x++;
            var newElement =  new Element('option');
            newElement.inject($(self.dateTimePicker));
            newElement.setProperty('id', i);
            newElement.setProperty('value', d + ' ' + hhr + ms);
            if (self.timeCounter == i)
            {
                newElement.setAttribute('selected','selected');
            }
            newElement.appendText( d + ' ' + hour + ':00' + a);
        }

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

        // console.log(self.graphCategory);
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
            text: 'Weather Graph'
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
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            // min: 0,
            // minRange: 1,
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

                    if (val['point']['direction'])
                        windDirectionPointer = points[idx].point.direction;

                });

                if (windDirectionPointer)
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
            name: 'Rainfall',
            data: self.graphRainfall
        }, {
            name: 'Humidity',
            data: self.graphHumidity
        }, {
            name: 'Wind Speed',
            data: self.graphWindSpeed
        }]
        },
        function(chart)
        { // on complete
            if (self.graphTemp.length < 1)
            { // check series is empty
                text = chart.renderer.text("No Data Available").add();
                textBBox = text.getBBox();
                x = chart.plotLeft + (chart.plotWidth  * 0.5) - (textBBox.width  * 0.5);
                y = chart.plotTop  + (chart.plotHeight * 0.5) - (textBBox.height * 0.25);
                text.attr({x: x, y: y}).css({color: '#4572A7',fontSize: '16px'});
            }

        }
        );
    };

    //Help modal
    self.startHelpModal = function()
    {
        var modal =  new Element('div');
        var modalEl = document.createElement('div');
        modal.setStyle('width','80%');
        modal.setStyle('height','80%');
        modal.setStyle('margin','100px auto');
        modal.setStyle('backgroundColor','#fff');
        // modalEl.style.width = '400px';
        // modalEl.style.height = '300px';
        // modalEl.style.margin = '100px auto';
        // modalEl.style.backgroundColor = '#fff';
        console.log(modal);
        console.log(modalEl);
        // show modal
        mui.overlay('on', modal);
    }

    //Add element events
    self.addEvents = function()
    {
        new Picker.Date($(self.datePicker), {
            timePicker: false,
            format: '%Y-%m-%d',
            positionOffset: {x: 5, y: 0},
            pickerClass: 'datepicker_vista',
            useFadeInOut: !Browser.ie,
            maxDate : new Date()
            //onSelect: function(date){
            //     //myHiddenField.set('value', date.format('%s'));
            //     $(self.datePickerTo).set('value', '');
            //     console.log('test1');
            //     new Picker.Date($(self.datePickerTo), {
            //         timePicker: false,
            //         format: '%Y-%m-%d',
            //         positionOffset: {x: 5, y: 0},
            //         pickerClass: 'datepicker_vista',
            //         useFadeInOut: !Browser.ie,
            //         minDate : date,
            //         maxDate: new Date()
            //     });
	        // }
        });

        $(self.helpButton).removeEvents();
        $(self.helpButton).addEvent('click', function(e)
        {
            e.preventDefault();
            self.startHelpModal();
        });

        $(self.datePrevButton).removeEvents();
        $(self.datePrevButton).addEvent('click',function(e)
        {
            e.preventDefault();
            self.timeCounter = null;
            self.dateCounter++;
            //console.log('dataTimeVal' + self.dateTimeVal)
            var d = new Date(self.dateTimeVal).decrement();
            self.dateTimeVal = d.format("%Y-%m-%d");
            $(self.datePicker).set('value',new Date(self.dateTimeVal).format('%Y-%m-%d'));
            //console.log(d);
            self.getData();
        });


        $(self.dateNextButton).removeEvents();
        $(self.dateNextButton).addEvent('click',function(e)
        {
            e.preventDefault();
            //console.log('dataTimeVal' + self.dateTimeVal)
            self.timeCounter = null;
            self.dateCounter--;
            var d = new Date(self.dateTimeVal).increment();
            //d.setDate(d.getDate() + 1);
            self.dateTimeVal = d.format("%Y-%m-%d");
            $(self.datePicker).set('value',new Date(self.dateTimeVal).format('%Y-%m-%d'));
            self.getData();
        });

        $(self.dateTimePicker).removeEvents();
        $(self.dateTimePicker).addEvent('change',function(e)
        {
            e.preventDefault();
            self.currentPage = 1;
            $(self.datePicker).set('value',new Date(self.dateTimeVal).format('%Y-%m-%d'))
            self.dateTimeVal = this.get('value');
            self.timeCounter = this.getSelected()[0].get('id');
            self.getData();
        });

        $(self.searchButton).removeEvents();
        $(self.searchButton).addEvent('click', function(e)
        {
            e.preventDefault();
            self.dateTimeVal = $(self.datePicker).get('value');
            self.dateCounter = 0;
            self.timeCounter = null;
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

        $(self.navTable).removeEvents();
        $(self.navTable).addEvent('click', function(e)
        {
            e.preventDefault();
            self.selectedView = 'Table';
            console.log(self.selectedView);
            //if(!$(self.nextId).hasClass('disable'))
            //{
            self.getData();

            //}
        });

        $(self.navGraph).removeEvents();
        $(self.navGraph).addEvent('click', function(e)
        {
            e.preventDefault();
            self.selectedView = 'Graph';
            console.log(self.selectedView);
            //if(!$(self.nextId).hasClass('disable'))
            //{
             self.getData();

            //}
        });

        $(self.navMap).removeEvents();
        $(self.navMap).addEvent('click', function(e)
        {
            e.preventDefault();
            self.selectedView = 'Map';
            //if(!$(self.nextId).hasClass('disable'))
            //{
                self.getData();

            //}
        });

        $(self.showBarButton).removeEvents();
        $(self.showBarButton).addEvent('click', function(e)
        {
            $(self.showBarButton).setStyle('display', 'none');
            $(self.hideBarButton).setStyle('display', 'inline-block');


            console.log('test show');
        });

        $(self.hideBarButton).removeEvents();
        $(self.hideBarButton).addEvent('click', function(e)
        {
            //$(self.hideBarButton).setStyle('display', 'none');
            //console.log($(document.body).hasClass('hide-sidedrawer'));
            //$(self.showBarButton).setStyle('display', 'inline-block');
            $(document.body).toggleClass('hide-sidedrawer');
            if (document.body.hasClass('hide-sidedrawer'))
            {
                // $(self.viewMain).getElement('.mui-table').setStyles({
                //
                //     left:  '180px'
                // });
                //console.log('test');
                $(self.hideBarButton).set('text', '▶ Search');
                height = null;
                width = $$('div.highcharts-container')[0]['style']['width'];
                width = width.substr(0,4);
                // console.log(height);
                // console.log(width);
                self.chartOne.setSize(width.toInt() + 200, height, doAnimation = true);

            }
            else {
                // $(self.viewMain).getElement('.mui-table').setStyles({
                //     left:  '180px'
                // });
                $(self.hideBarButton).set('text', '◀ Search');
                height = null;
                width = $$('div.highcharts-container')[0]['style']['width'];
                width = width.substr(0,4);
                // console.log(height);
                // console.log(width);
                self.chartOne.setSize(width.toInt() - 200, height, doAnimation = true);
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
                'pressure'       : 1002,
                'wind_speed'     : 23,
                'wind_direction' : 180,
                'rainfall'       : 34,
                'humidity'       : 90,
                'date_received'  : 1505363312
            };

            self._request = new Request.JSON(
            {
                'url' : 'http://52.65.243.126/postDataAndroid',
                //'url' : '/postDataAndroid',
                //'url' : '/weathermonitor/public/postDataAndroid',
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
