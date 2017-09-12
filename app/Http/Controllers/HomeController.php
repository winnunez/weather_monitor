<?php namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;

class HomeController extends Controller
{
    public function index(){
        return view('home');
    }

    public function checkDateFormat($date){
        if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$date)) {
            return true;
        } else {
            return false;
        }
    }

    public function getData(Request $data){
        //Validation
        (gettype(json_decode($data['page'],true)) == "integer") ? $page = json_decode($data['page'],true) : $page = 1;
        ($this->checkDateFormat($data['dateFrom']) == true) ? $dateFrom = $data['dateFrom'] : $dateFrom = date("Y-m-d");
        ($this->checkDateFormat($data['dateTo']) == true) ? $dateTo = $data['dateTo'] : $dateTo = date("Y-m-d");

        $totalData = DB::table('weather_monitor')->whereBetween(DB::raw('DATE(weather_monitor.date_received)'),[$dateFrom,$dateTo])->count();
        $limit = 5;
        $totalPage = ceil($totalData / $limit);
        $offset = ($page - 1)  * $limit;
        $sort = $data['sort'];

        if ($sort == 'ASC') {
            $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date_received) BETWEEN :from AND :to ORDER BY date_received ASC LIMIT 5 OFFSET :offset',
            [
                'from' => $dateFrom,
                'to' => $dateTo,
                'offset' => $offset
            ]);
        }
        else if ($sort == "DESC"){
            $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date_received) BETWEEN :from AND :to ORDER BY date_received DESC LIMIT 5 OFFSET :offset',
            [
                'from' => $dateFrom,
                'to' => $dateTo,
                'offset' => $offset
            ]);
        }
        else {
            $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date_received) BETWEEN :from AND :to ORDER BY date_received ASC LIMIT 5 OFFSET :offset',
            [
                'from' => $dateFrom,
                'to' => $dateTo,
                'offset' => $offset
            ]);
        }

        $resultData = array();
        //return $queryData;

        foreach ($queryData as $qData) {
            $container = array(
                'station_id' =>  $qData->station_id,
                'temp' =>  $qData->temp,
                'pressure' =>  $qData->pressure,
                'wind_speed' =>  $qData->wind_speed,
                'wind_direction' =>  $qData->wind_direction,
                'rainfall' =>  $qData->rainfall,
                'humidity' =>  $qData->humidity,
                'date_received' =>  $qData->date_received
            );
            array_push($resultData, $container);
        }

        $returnData = array(
            'page' => $page,
            'totalPage' => $totalPage,
            'totalData' => $totalData,
            'limit' => $limit,
            'resultData' => $resultData,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo
        );
        return $returnData;
        //return json_encode($post_data);
    }

    public function getGraphData(Request $data){
        //Validation
        ($this->checkDateFormat($data['dateFrom']) == true) ? $dateFrom = $data['dateFrom'] : $dateFrom = date("Y-m-d");
        ($this->checkDateFormat($data['dateTo']) == true) ? $dateTo = $data['dateTo'] : $dateTo = date("Y-m-d");

        $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date_received) BETWEEN :from AND :to ORDER BY date_received',
        [
            'from' => $dateFrom,
            'to' => $dateTo
        ]);

        $resultData = array();
        //return $queryData;

        foreach ($queryData as $qData) {
            $container = array(
                'station_id' => $qData->station_id,
                'temp' => $qData->temp,
                'pressure' =>  $qData->pressure,
                'wind_speed' =>  $qData->wind_speed,
                'wind_direction' =>  $qData->wind_direction,
                'rainfall' =>  $qData->rainfall,
                'humidity' =>  $qData->humidity,
                'date_received' =>  $qData->date_received,
                'date' =>  $qData->date
            );
            array_push($resultData, $container);
        }

        //return $resultData;

        $postData = array('resultData' => $resultData);
        return $postData;
        //return json_encode($post_data);
    }

    public function postDataAndroid(Request $data){
        $returnData = array();
        //(!$data['rainfall']) ? $rainfall = "0" : $rainfall = $data['rainfall'];

        try {
            DB::INSERT('INSERT INTO weather_monitor (station_id,temp,pressure,wind_speed,wind_direction,rainfall,humidity,date_received) VALUES (:station_id,:temp,:pressure,:wind_speed,:wind_direction,:rainfall,:humidity,:date_received)',
            [
                'station_id' => $data['station_id'],
                'temp' => $data['temp'],
                'pressure' => $data['pressure'],
                'wind_speed' => $data['wind_speed'],
                'wind_direction' => $data['wind_direction'],
                'rainfall' => $data['rainfall'],
                'humidity' => $data['humidity'],
                'date_received' => $data['date_received']
            ]);
        } catch (\Exception $e) {
            //$returnData['hasError'] = true;
            //$returnData['message'] = $e;
            return $e;
        }
        $returnData['hasError'] = false;
        $returnData['message'] = "Success!";
        return $returnData;

    }

    public function getDataAndroid(Request $data){
        //Validation
        ($this->checkDateFormat($data['dateFrom']) == true) ? $dateFrom = $data['dateFrom'] : $dateFrom = date("Y-m-d");
        ($this->checkDateFormat($data['dateTo']) == true) ? $dateTo = $data['dateTo'] : $dateTo = date("Y-m-d");

        $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date) BETWEEN :from AND :to ORDER BY date',
        [
            'from' => $dataFrom,
            'to' => $dataTo
        ]);

        $resultData = array();
        //return $queryData;

        foreach ($queryData as $qData) {
            $container = array(
                'station_id' => $qData->station_id,
                'temp' => $qData->temp,
                'pressure' =>  $qData->pressure,
                'wind_speed' =>  $qData->wind_speed,
                'wind_direction' =>  $qData->wind_direction,
                'rainfall' =>  $qData->rainfall,
                'humidity' =>  $qData->humidity,
                'data_received' =>  $qData->data_received,
                'date' =>  $qData->date
            );
            array_push($resultData, $container);
        }

        //return $resultData;

        $postData = array('resultData' => $resultData);
        return $postData;

    }
}
