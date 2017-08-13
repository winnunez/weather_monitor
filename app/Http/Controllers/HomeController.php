<?php namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;

class HomeController extends Controller
{
    public function index(){
        return view('home');
    }

    public function getData(Request $data){
        $page = json_decode($data['page'],true);
        $totalData = DB::table('weather_monitor')->count();
        $limit = 5;
        $totalPage = ceil($totalData / $limit);
        $offset = ($page - 1)  * $limit;

        $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date) BETWEEN :from AND :to ORDER BY date LIMIT 5 OFFSET :offset', ['from' => $data['dateFrom'], 'to' => $data['dateTo'], 'offset' => $offset]);
        $resultData = array();
        //return $queryData;
        foreach ($queryData as $qData) {
            $container = array(
                'temp' => $qData->temp,
                'pressure' =>  $qData->pressure,
                'wind_speed' =>  $qData->wind_speed,
                'wind_direction' =>  $qData->wind_direction,
                'rainfall' =>  $qData->rainfall,
                'humidity' =>  $qData->humidity,
                'visibility' =>  $qData->visibility,
                'date' =>  $qData->date
            );
            array_push($resultData, $container);
        }
        //return $resultData;

        $postData = array(
            'page' => $page,
            'totalPage' => $totalPage,
            'totalData' => $totalData,
            'limit' => $limit,
            'resultData' => $resultData
        );
        return $postData;
        //return json_encode($post_data);
    }
}
