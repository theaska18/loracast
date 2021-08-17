<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_table_sequence {
	public function get($table_name){
		$ci=& get_instance();
		$seq=1;
		$res=$ci->query->row("SELECT last_value FROM app_table_sequence WHERE table_name='".$table_name."'");
		if($res){$seq=$res->last_value;$ci->query->set("UPDATE app_table_sequence set last_value=".($seq+1)." WHERE table_name='".$table_name."'");
		}else{$ci->query->set("INSERT INTO app_table_sequence(table_name,last_value)values('".$table_name."',2)");}
		$primary=$ci->query->row("SHOW KEYS FROM ".$table_name." WHERE key_name='PRIMARY'");
		$jum=$ci->query->row("SELECT COUNT(".$primary->Column_name.") AS jum FROM ".$table_name." WHERE ".$primary->Column_name."=".$seq);
		if($jum->jum>0){return $this->get($table_name);}else{return $seq;}
	}
}
?>