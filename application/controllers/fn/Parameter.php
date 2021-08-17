<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Parameter extends MY_controller {
	function __construct() {parent::__construct();}
	public function getParameter(){
		$this->load->library('lib/lib_parameter');
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			if(isset($_GET['param'])){$result->setData($this->lib_parameter->get($_GET['param']))->end();
			}else if(isset($_GET['query'])){$result->setData($this->query->result($_GET['query']))->end();}
		}else{$result->session()->end();}
	}
}