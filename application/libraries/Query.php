<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Query {
	public $db=null,$jsonresult=null;
	function __construct() {
		$ci = & get_instance();
        $this->db=$ci->db;
        $this->jsonresult=$ci->jsonresult;
    }
	public function start(){$this->db->trans_begin();}
	public function set($query){
		$db=$this->db;
		$dat=$db->query($query);
		if($this->db->conn_id->errno==1451){
			$err=$db->conn_id->error;
			$table=explode('.`',explode('`, CONSTRAINT',$err)[0])[1];
			$res=$db->query("SELECT table_comment FROM INFORMATION_SCHEMA.TABLES 
				WHERE table_schema='".$db->database."' AND table_name='".$table."'")->row();
			$db->trans_rollback();
			$this->jsonresult->error()->setMessage("Data Sudah Ada diBagian ".$res->table_comment)->end();
		}
		$error=$db->error();
		if($error['code']>0){$this->db->trans_rollback();$this->jsonresult->error()->setMessage($error['message'])->end();}
	}
	public function result($query,$cache=false){
		$dat=$this->db->query($query);
		$error=$this->db->error();
		if($error['code']==0){return $dat->result();
		}else{$this->jsonresult->error()->setMessage($error['message'])->end();}
	}
	public function row($query,$cache=false){
		$dat=$this->db->query($query);
		$error=$this->db->error();
		if($error['code']==0){return $dat->row();
		}else{$this->jsonresult->error()->setMessage($error['message'])->end();}
	}
	public function end(){
		if ($this->db->trans_status() === FALSE){$this->db->trans_rollback();$this->jsonresult->error()->setMessage("Kesalahan Tidak diKetahui, Hubungi Admin. [Query|end]")->end();
		}else{$this->db->trans_commit();}
	}
	public function back(){$this->db->trans_rollback();}
}
?>