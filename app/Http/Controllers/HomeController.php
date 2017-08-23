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
        $limit = 5;
        $totalData = DB::table('weather_monitor')->whereBetween(DB::raw('DATE(weather_monitor.date)'),[$data['dateFrom'],$data['dateTo']])->count();
        $totalPage = ceil($totalData / $limit);
        $offset = ($page - 1)  * $limit;
        $sort = $data['sort'];

        if ($sort == 'ASC') {
            $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date) BETWEEN :from AND :to ORDER BY date ASC LIMIT 5 OFFSET :offset',
            [
                'from' => $data['dateFrom'],
                'to' => $data['dateTo'],
                'offset' => $offset
            ]);
        }
        else {
            $queryData = DB::select('SELECT * FROM weather_monitor WHERE DATE(date) BETWEEN :from AND :to ORDER BY date DESC LIMIT 5 OFFSET :offset',
            [
                'from' => $data['dateFrom'],
                'to' => $data['dateTo'],
                'offset' => $offset
            ]);
        }

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

    public function postDataAndroid(Request $data){
        $returnData = array();
        try {
            DB::INSERT('INSERT INTO weather_monitor (temp,pressure,wind_speed,wind_direction,rainfall,humidity,visibility) VALUES (:temp,:pressure,:wind_speed,:wind_direction,:rainfall,:humidity,:visibility)',
            [
                'temp' => $data['temp'],
                'pressure' => $data['pressure'],
                'wind_speed' => $data['wind_speed'],
                'wind_direction' => $data['wind_direction'],
                'rainfall' => $data['rainfall'],
                'humidity' => $data['humidity'],
                'visibility' => $data['visibility']
            ]);
        } catch (\Exception $e) {
            //$returnData['message'] = "Error";
            return $e;
        }

        return $returnData['message'] = "Success! Data Sent.";

    }
}
