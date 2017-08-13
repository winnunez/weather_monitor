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
  <link rel="stylesheet" href="{{ URL::asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ URL::asset('css/Source/datepicker_dashboard/datepicker_dashboard.css') }}">
  <script type="text/javascript" src="{{ URL::asset('js/home.js') }}"></script>
</head>
<body>
  <div id="sidebar">
    <h1>Tramper Weather Monitor</h1>
    <p>From: <input type="text" id="datepicker-from"></p>
    <p>To: <input type="text" id="datepicker-to"></p>
    <select id="view-picker">
      <option value="table">Table</option>
      <option value="graph">Graph</option>
      <option value="map">Map</option>
    </select>
    <button type="button" id="search-button">Search</button>
</select>
  </div>
  <div id="main">
      <span id="total-main-part"></span>
      <span id="total-main-data"></span>
      <button type="button" id="prev-main-button">Back</button>
      <button type="button" id="next-main-button">Next</button>
      <table cellpadding="5" border="1">
      <thead>
      <tr>
          <th>Temperature</th>
          <th>Pressure</th>
		  <th>Wind Speed</th>
          <th>Wind Direction</th>
          <th>Rainfall</th>
		  <th>Humidity</th>
          <th>Visibility</th>
          <th>Date</th>
	  </tr>
      </thead>
          <tbody id="data-result">
		  </tbody>
      </table>
  </div>
</body>
