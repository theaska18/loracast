<?php
if(! defined( 'BASEPATH' )) exit( 'No direct script access allowed' );
class MY_controller extends CI_Controller {
	function __construct() {
		parent::__construct();
	}
	public function allow(){
		$this->load->library('pagesession');
		$result=$this->jsonresult;
		if ($this->pagesession->cek() && (isset($_GET['session']) || isset($_POST['session'])) ){
			
			return true;
		}else{ $result->session()->end();}
	}
	public function get($param, $allow = true,$alowLine=false) {
		$result = $this->jsonresult;
		if(isset($_GET[$param])){
			$p=$_GET[$param];
			if(is_array($p))
				return $_POST[$param];
			else if($p=='true')
				return true;
			else if($p=='false')
				return 0;
			else if($this->validateDate($p) !== false)
				return new DateTime($p);
			else if($p=='null')
				return null;
			if($alowLine===true){return preg_replace('/^\s+|\n|\r|\s+$/m', '', $p);
				}else{return $p;}
		}else
			if($allow==false)
				return null;
			else
				$result->error()->setMessage("Parameter '".$param."' Not Found.")->end();
	}
	private function validateDate($date){
		$d = DateTime::createFromFormat('Y-m-d', $date);
		return $d && $d->format('Y-m-d') == $date;
	}
	public function post($param, $allow = true,$alowLine=false) {
		$result=$this->jsonresult;
		if(isset($_POST[$param])){
			$p=$_POST[$param];
			if(is_array($p))
				return $_POST[$param];
			else if($p=='true')
				return true;
			else if($p=='false')
				return 0;
			else if($this->validateDate($p) !== false)
				return new DateTime($p);
			else if($p=='null')
				return null;
			if($alowLine===true){return preg_replace('/^\s+|\n|\r|\s+$/m', '', $p);
			}else{return $p;}
		}else
			if($allow==false)
				return null;
			else
				$result->error()->setMessage("Parameter '".$param."' Not Found")->end();
	}
}
?>