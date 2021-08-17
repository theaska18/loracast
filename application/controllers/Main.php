<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {
	public function index(){
		// $common = $this->common;
		// $cache=$common->cache_start();
		$this->load->view('home/home',array('ini'=>$this));
		// $common->cache_end($cache);
	}
}