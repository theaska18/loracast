<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Service extends MY_controller {
	function __construct() {parent::__construct();}
	public function getTenantRemote(){
		$remote_id=$this->get('remote_id');
		$remote_secret=$this->get('remote_secret');
		$res=$this->query->row("SELECT tenant_name,address,tenant_desc,CONCAT('".base_url()."upload/',logo) AS logo FROM app_tenant WHERE remote_id='".$remote_id."' AND remote_secret='".$remote_secret."'");
		if($res){
			$this->jsonresult->setData($res);
		}else{
			$this->jsonresult->warning()->setMessage("Secret ID Salah.");
		}
		echo json_encode($this->jsonresult);
	}
		// ini_set('post_max_size', '200M'); 
		// ini_set('max_execution_time', 600);
		// date_default_timezone_set('Asia/Jakarta');
}