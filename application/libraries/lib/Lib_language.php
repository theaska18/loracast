<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_language {
	function load($mod='MAIN'){
		$ci=& get_instance();
		
		$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
		switch ($lang){
			case "id":
				if (file_exists(APPPATH."language/id/".$mod."_lang.php")) {
					$ci->load->language($mod,'id');
				}
				break;        
			default:
				if (file_exists(APPPATH."language/en/".$mod."_lang.php")) {
					$ci->load->language($mod,'en');
				}
				break;
		}
	}
	function line($line,$parameter=array()){
		$ci=& get_instance();
		$string=$ci->lang->line($line);
		foreach($parameter as $key){
			$string=str_replace('{'.$key.'}',$parameter[$key],$string);
		}
		return $string;
	}
}
?>