<!doctype html>
<head>
  <script type="text/javascript" src="{{ URL::asset('js/MooTools-Core-1.6.0.js') }}"></script>
  <!--script type="text/javascript" src="{{ URL::asset('js/MooTools-More-1.6.0.js') }}"></script-->
  <!--script type="text/javascript" src="{{ URL::asset('js/mootools-core.js') }}"></script-->
  <script type="text/javascript" src="{{ URL::asset('js/mootools-more.js') }}"></script>
  <script type="text/javascript" src="{{ URL::asset('js/Source/Locale.en-US.DatePicker.js') }}"></script>
  <script type="text/javascript" src="{{ URL::asset('js/Source/Picker.js') }}"></script>
  <script type="text/javascript" src="{{ URL::asset('js/Source/Picker.Attach.js') }}"></script>
  <script type="text/javascript" src="{{ URL::asset('js/Source/Picker.Date.js') }}"></script>
  <script type="text/javascript" src="{{ URL::asset('js/Source/Picker.Date.Range.js') }}"></script>
  <!--Highcharts-->
  <script src="http://code.highcharts.com/adapters/mootools-adapter.js"></script>
  <script src="http://code.highcharts.com/highcharts.js"></script>
  <script src="http://code.highcharts.com/modules/exporting.js"></script>
  <!--Styles-->
  <link rel="stylesheet" href="{{ URL::asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ URL::asset('css/Source/datepicker_vista/datepicker_vista.css') }}">
  <link rel="stylesheet" href="{{ URL::asset('css/Source/datepicker.css') }}">
  <link href="//cdn.muicss.com/mui-0.9.25/css/mui.min.css" rel="stylesheet" type="text/css" />
  <script src="//cdn.muicss.com/mui-0.9.25/js/mui.min.js"></script>
  <script type="text/javascript" src="{{ URL::asset('js/home.js') }}"></script>
</head>
<body>
<div class="mui-appbar"></div>
  <div id="sidebar">
    <h1 style="position:inline-block;float:left">Tramper Weather Monitor</h1>
    <img src="{{ URL::asset('icon.png') }}" style="width:74px;height64px;position:inline-block;"><!--Image by storm cloud by Eucalyp from the Noun Project-->
    <div class="mui-textfield"><input type="text" id="datepicker-from" readonly="true" style="width:80%"><label>From:</label></div>
    <div class="mui-textfield"><input type="text" id="datepicker-to"  readonly="true" style="width:80%"><label>From:</label></div>
    <div class="mui-dropdown">
    <select id="view-picker">
    <ul class="mui-dropdown__menu">
      <option value="table">Table</option>
      <option value="graph">Graph</option>
      <option value="map">Map</option>
    </ul>
    </select>
    </div>
    <div class="mui-dropdown">
        <button class="mui-btn mui-btn--flat mui-btn--primary" data-mui-toggle="dropdown">
            Select View
            <span class="mui-caret"></span>
        </button>
        <ul class="mui-dropdown__menu">
            <li><a>Table</a></li>
            <li><a>Graph</a></li>
            <li><a>Graph</a></li>
        </ul>
    </div>
    <button type="button" id="search-button" class="mui-btn mui-btn--primary">Search</button>
    <button type="button" id="test-post-button" class="mui-btn">Test Post</button>
  </div>
  <div id="main-table" style="display: none" >
      <span id="total-main-part"></span>
      <span id="total-main-data"></span>
      <button type="button" id="prev-main-button">Back</button>
      <button type="button" id="next-main-button">Next</button>
      <table class="mui-table mui-table--bordered" style="position:absolute; left: 23%; width:70%; top:15%; ">
      <thead>
      <tr>
          <th>Temperature</th>
          <th>Pressure</th>
		  <th>Wind Speed</th>
          <th>Wind Direction</th>
          <th>Rainfall</th>
		  <th>Humidity</th>
          <th><a id="sort-date-button" href="#">Date</a></th>
	  </tr>
      </thead>
          <tbody id="data-result">
		  </tbody>
      </table>
   </div>
   <div id="main-graph" style="display: none">
       <div id="container-one"></div>
       <div id="container-two"></div>
       <div id="container-three"></div>
   </div>


</body>
