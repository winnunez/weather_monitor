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
    <script type="text/javascript" src="{{ URL::asset('js/mui.min.js') }}"></script>
    <!--Highcharts-->
    <script src="http://code.highcharts.com/adapters/mootools-adapter.js"></script>
    <script src="http://code.highcharts.com/highcharts.js"></script>
    <script src="http://code.highcharts.com/modules/exporting.js"></script>
    <!--Styles-->
    <link type="text/css" rel="stylesheet" href="{{ URL::asset('css/style.css') }}">
    <link type="text/css" rel="stylesheet" href="{{ URL::asset('css/Source/datepicker_vista/datepicker_vista.css') }}">
    <link type="text/css" rel="stylesheet" href="{{ URL::asset('css/Source/datepicker.css') }}">
    <link type="text/css" rel="stylesheet" href="{{ URL::asset('css/mui.min.css') }}">

    <script type="text/javascript" src="{{ URL::asset('js/home.js') }}"></script>
</head>
<body>
    <div id="sidedrawer" class="mui--no-user-select">
        <!--h1 style="position:inline-block;float:left">Tramper Weather Monitor</h1>
        <img src="{{ URL::asset('icon.png') }}" style="width:74px;height64px;position:inline-block;"><!--Image by storm cloud by Eucalyp from the Noun Project-->
        <div class="mui-textfield"><input type="text" id="datepicker" style="width:80%"><label>Select Date:</label></div>
        <!--div class="mui-textfield"><input type="text" id="datepicker-to"  readonly="true" style="width:80%"><label>From:</label></div-->
        <div class="mui-dropdown">
            <select id="view-picker">
                <ul class="mui-dropdown__menu">
                    <option value="table">Station 1</option>
                </ul>
            </select>
        </div>
        <button type="button" id="search-button" class="mui-btn mui-btn--primary" style="display: block">Search</button>
        <button type="button" id="test-post-button" class="mui-btn">Test Post</button>
    </div>
    <header id="header">
        <div class="mui-appbar mui--appbar-line-height">
            <div class="mui-container-fluid">
                <a id="show-bar" class="sidedrawer-toggle mui--visible-xs-inline-block mui--visible-sm-inline-block js-show-sidedrawer" style="position:inline-block">▶ Search </a>
                <a id="hide-bar" class="sidedrawer-toggle mui--hidden-xs mui--hidden-sm js-hide-sidedrawer" style="position:inline-block">◀ Search</a>
                <h3 style="margin-left:50px;display:inline-block;">Tramper Weather Monitor</h3>
                <!--img src="{{ URL::asset('icon.png') }}" style="width:40px;height40px;display:inline-block;"-->
                <ul class="mui-tabs__bar" style="float:right">
                    <li class="mui--is-active" id="nav-table"><a data-mui-toggle="tab" data-mui-controls="main-table" >Table</a></li>
                    <li id="nav-graph"><a data-mui-toggle="tab" data-mui-controls="main-graph" >Graph</a></li>
                    <li id="nav-map"><a data-mui-toggle="tab" data-mui-controls="main-map" >Map</a></li-->
                </ul>
                <a id="help-button" style="float:right">?</a>
            </div>
        </div>
    </header>
    <div id="content-wrapper">
        <div class="datetime-elements">
            <button type="button" id="prev-date-button"><</button>
            <select id="datetime-picker">
            </select>
            <button type="button" id="next-date-button">></button>
        </div>
        <div class="mui-tabs__pane mui--is-active" id="main-table" style="display: none" >
            <div class="table-elements">
                <span id="total-main-part"></span>
                <span id="total-main-data"></span>
                <button type="button" id="prev-main-button">Back</button>
                <button type="button" id="next-main-button">Next</button>
            </div>
            <table class="mui-table mui-table--bordered" style="width: 90%;">
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
        <div class="mui-tabs__pane" id="main-graph" style="display: none">
            <div id="container-one"></div>
        </div>
        <div class="mui-tabs__pane" id="main-map" style="display: none">
        </div>
    </div>
    <footer id="footer">
        <div class="mui-container-fluid">
        <br>
        Made by Team Weather Monitor - Student Project @ <a href="http://www.weltec.ac.nz/">WelTec</a>
        </div>
    </footer>
</body>
