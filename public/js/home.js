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

    //sorting
    self.sortOrder         =  null;
    self.sortDate          = 'sort-date-button';

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


        if (!self._request || !self._request.isRunning())
        {

            if ($(self.datePickerFrom).get('value') == "")
                $(self.datePickerFrom).set('value',new Date().format('%Y-%m-%d'))

            if ($(self.datePickerTo).get('value') == "")
                $(self.datePickerTo).set('value',new Date().format('%Y-%m-%d'))


            arrayData = {
                'dateFrom'          : $(self.datePickerFrom).get('value'),
                'dateTo'            : $(self.datePickerTo).get('value'),
                'page'              : page,
                'sort'              : sort

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
            pickerClass: 'datepicker_vista',
            useFadeInOut: !Browser.ie,
            maxDate : new Date(),
            onSelect: function(date){
                //myHiddenField.set('value', date.format('%s'));
                $(self.datePickerTo).set('value','');

                new Picker.Date($(self.datePickerTo), {
                    timePicker: false,
                    format: '%Y-%m-%d',
                    positionOffset: {x: 5, y: 0},
                    pickerClass: 'datepicker_vista',
                    useFadeInOut: !Browser.ie,
                    minDate : date,
                    maxDate: new Date(),
                    invertAvailable : 'true'
                });
	        }
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
