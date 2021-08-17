<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_dynamic_option {
	public function set($value,$type,$parent=''){
		$ci=& get_instance();
		if($value !=null && $value !=''){
			$sqlSelect='';
			$sqlInsert1='';
			$sqlInsert2='';
			if ($parent!==''){
				$sqlSelect=" AND UPPER(parent)=UPPER('".$parent."') ";
				$sqlInsert1=",parent";
				$sqlInsert2=",'".$parent."'";
			}
			$d=$ci->query->row("SELECT id_dynamic_option AS total FROM app_dynamic_option WHERE option_type='".$type."' ".$sqlSelect."AND UPPER(value)=UPPER('".$value."')");
			if(!$d){
				$ci->load->library('lib/lib_table_sequence');
				$id=$ci->lib_table_sequence->get('app_dynamic_option');
				$ci->query->set("INSERT INTO app_dynamic_option (id_dynamic_option,option_type,value".$sqlInsert1.")VALUES(".$id.",'".$type."','".$value."'".$sqlInsert2.")");
			}
		}
	}
}
?>