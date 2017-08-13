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
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
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



    self.sortOrder         =  null;

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
            self.renderData,
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
        console.log('test');
        if (!self._request || !self._request.isRunning())
        {
            // data = {
            //     'email-mobile' : submitData['email-mobile'],
            //     'SMSCSRFTOKEN' : token
            // };
            arrayData = {
                'dateFrom'          : $(self.datePickerFrom).get('value'),
                'dateTo'            : $(self.datePickerTo).get('value'),
                'page'              : page

            };

            callbacks.push(self.paginationChecker);

            self._request = new Request.JSON(
            {
                'url' : self.requestGetDataURL,
                'method' : 'GET',
                'data' : arrayData,
                'onSuccess' : function(data)
                {
                    self.disposeData();

                    self.currentPage        = data.page;
                    self.totalPage          = data.totalPage;
                    self.pageLimit          = data.limit;
                    self.resultData         = data.resultData;

                    if(data.resultData.length)
                    {
                        $$('#' + self.totalDataId).set('html', ' of ' + data.totalData);
                    }
                    else
                    {
                        $$('#' + self.totalDataId).set('html','');
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
                    console.log(data);
                }
                }).send();
            }

    };

    //Page Checking
    self.paginationChecker = function()
    {
        //$(self.prevId).setStyle('display', 'block');
        //$(self.nextId).setStyle('display', 'block');

        // //first check the preview button whether it will be disable or not
        // if(self.currentPage == 1)
        // {
        //     $(self.prevId).addClass('disable');
        // }
        // else
        // {
        //     $(self.prevId).removeClass('disable');
        // }
        //
        // //second check the next button whether it will be disable or not
        // if(self.currentPage < self.totalPage)
        // {
        //     $(self.nextId).removeClass('disable');
        // }
        // else
        // {
        //     $(self.nextId).addClass('disable');
        // }

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
        }
    };

    self.renderData = function()
    {
        Array.each(self.resultData, function(val, idx)
        {
            var contentHTML = '<td>' + val['temp'] + '</td>'
                            + '<td>' + val['pressure'] + '</td>'
                            + '<td>' + val['wind_speed'] + '</td>'
                            + '<td>' + val['wind_direction'] + '</td>'
                            + '<td>' + val['rainfall'] + '</td>'
                            + '<td>' + val['humidity'] + '</td>'
                            + '<td>' + val['visibility'] + '</td>'
                            + '<td>' + val['date'] + '</td>'
                            //+ '<td> <a id="view_' + val['advisory_id']+ '" href="#"> View </a>' + cancel + edit + '</td>';

            contentElem = new Element('<tr />',
            {
                'id'  : '',
                'html'  : contentHTML
            });
            contentElem.inject($(self.viewTable), "bottom");
        });
    };

    self.addEvents = function()
    {
        new Picker.Date($(self.datePickerFrom), {
            timePicker: false,
            format: '%Y-%m-%d',
            positionOffset: {x: 5, y: 0},
            pickerClass: 'datepicker_dashboard',
            useFadeInOut: !Browser.ie
        });

        new Picker.Date($(self.datePickerTo), {
            timePicker: false,
            format: '%Y-%m-%d',
            positionOffset: {x: 5, y: 0},
            pickerClass: 'datepicker_dashboard',
            useFadeInOut: !Browser.ie
        });

        $(self.searchButton).removeEvents();
        $(self.searchButton).addEvent('click', function(e)
        {
            e.preventDefault();

            self.getData();
            //$('forgot-input').setStyle('display', 'block');
            //$('email-mobile').set('value', '');

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
