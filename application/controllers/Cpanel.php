<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Cpanel extends MY_controller {
	function __construct() {parent::__construct();}
	public function index($parameter1='',$parameter2=''){
		$this->load->library('lib/lib_common');
		$common = $this->lib_common;
		$cache=$common->cache_start();
		$this->load->library('lib/lib_language');
		$this->load->library('minify');
		$this->lib_language->load();
		if($parameter1 != ''){
			$_GET['session']=$parameter1;
		}else{
			$_GET['session']='login';
		}
		if ($this->pagesession->cek()){
			$session_id=$this->input->get('session');
			$session=$this->pagesession;
			$session->get();
			$session->getMenu();
			$session->getAccess();
			$session->getSetting();
			$session->getImports();
			//$this->load->library('mobile_detect');
			//echo 'awdw';
			//die();//$this->mobile_detect->isMobile()
			$this->load->view('admin/main_admin',array('mobile'=>true,'session'=>$session,'minify'=>$this->minify,'param'=>$parameter2));
			
		}else{
			header("Location: ".base_url().'page/login');
		}
		$common->cache_end($cache);
	}
	// public function addr($parameter1=''){
		// $arr=array();
		// $latitude=$this->input->post('latitude');
		// $longitude=$this->input->post('longitude');
		// $arr['system_property_value']=$latitude.'#'.$longitude;
		// $this->db->where('system_property_code','LONG');
		// $this->db->update('app_system_property',$arr);
	// }
}