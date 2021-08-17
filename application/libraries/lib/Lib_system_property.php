<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_system_property {
	public function get($code) {
		$ci=& get_instance();
		$d=$ci->query->row("SELECT system_property_value AS val FROM app_system_property WHERE system_property_code='".$code."'");
		if($d){return $d->val;
		}else{
			$ci->query->back();
			$ci->jsonresult->error()->setMessage("Kode System Property '".$code."' Tidak Ada.")->end();
		}
	}
}
?>