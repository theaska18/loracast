<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Direct extends MY_controller {
	function __construct() {
		parent::__construct();
	}
	// public function check(){
		// $db=$this->query;
		// $jsonresult=$this->jsonresult;
		// $username=$this->post('username');
		// $password=$this->post('password');
		// $user=$db->row("SELECT user_id FROM app_user WHERE user_code='".$username."' AND password='".hash('md5',$password )."'");
		// if ($user != null) {
			// $now=new DateTime();
			// $jsonresult->setData(array('date'=>$now->format('Y-m-d H:i:s'),
				// 'db_name'=>$this->db->database,
				// 'db_server'=>$this->db->hostname,
				// 'db_port'=>$this->db->port,
				// 'db_user'=>$this->db->username,
				// 'db_pass'=>$this->db->password,
				// ))->end();
		// }else
			// $jsonresult->error()->setMessage('Login Gagal Isi Data dengan benar.')->end();
	// }
	// public function getPrint(){
		// $db=$this->query;
		// $jsonresult=$this->jsonresult;
		// $username=$this->get('username');
		// $password=$this->get('password');
		// $last=$this->get('last');
		// $user=$db->row("SELECT user_id FROM app_user 
			// WHERE user_code='".$username."' AND password='".hash('md5',$password )."'");
		// if ($user != null) {
			// $last=new DateTime($last);
			// $now=new DateTime();
			// $res=$db->result("SELECT P.value,P.description,P.print_code,P.print_type,P.parameter,P.url_report 
				// FROM app_list_print_direct P 
				// WHERE P.user_id=".$user->user_id." AND P.create_on >='".$last->format('Y-m-d H:i:s')."'");
			// $db->set("DELETE FROM app_list_print_direct 
				// WHERE create_on<='".$last->format('Y-m-d H:i:s')."' AND user_id=".$user->user_id);
			// $jsonresult->setData(array('item'=>$res,'count'=>count($res),'last'=>$now->format('Y-m-d H:i:s')))->end();
		// }else
			// $jsonresult->error()->setMessage('Pengguna Tidak Ada, Mungkin Sudah dihapus Admin.')->end();
	// }
	public function getPrintById(){
		
		if($this->allow()==true){
			
			$db=$this->query;
			$jsonresult=$this->jsonresult;
			$print_id=$this->get('print_id');
			$res=$db->row("SELECT P.value,P.description,P.print_code,P.print_type,P.parameter,P.url_report 
				FROM app_list_print_direct P 
				WHERE P.print_id=".$print_id." ");
			$db->set("DELETE FROM app_list_print_direct
				WHERE print_id=".$print_id." ");
			$jsonresult->setData($res)->end();
		}
	}
}