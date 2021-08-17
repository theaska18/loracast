<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_tenant {
	public function get($id){
		$ci=& get_instance();
		$d=$ci->query->row("SELECT * FROM app_tenant WHERE tenant_id=".$id);
		if($d)
			return $d;
		else{
			$ci->query->back();
			$ci->jsonresult->error()->setMessage("Kode System Property '".$code."' Tidak Ada.")->end();
		}
	}
}
?>