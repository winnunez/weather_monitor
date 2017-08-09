<?php namespace App\Http\Controllers;
use DB;

class HomeController extends Controller
{
    public function index(){
        return view('home');
    }

    public function getData(){
        $results = DB::select("SELECT * FROM weather_monitor");
        return $results;
    }
}
