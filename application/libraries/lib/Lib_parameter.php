<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_parameter {
	public function get($parameterCode){
		$ci=&get_instance();
		$data=$ci->query->result("SELECT option_code AS id,option_name AS text FROM app_parameter_option WHERE parameter_code='".$parameterCode."' AND active_flag=true ORDER BY line_number ASC");
		if($data){return $data;}else{$ci->query->back();$ci->jsonresult->error()->setMessage("Kode Parameter '".$parameterCode."' tidak diTemukan.")->end();}
	}
}
?>