<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Transaction extends MY_controller {
	function __construct() {parent::__construct();}
	public function saveTransaction(){
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			$session=$this->pagesession->get();
			$data=$_POST['data'];
			$data=json_decode($data);
			$this->load->library('lib/lib_transaction');
			$this->lib_transaction->setTransaction($data,$session->tenant_id);
			$result->setMessage('Data Berhasil diSimpan.')->end();
		}else{$result->session()->end();}
	}
	public function loadTransaction(){
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			$session=$this->pagesession->get();
			$data=$_POST['data'];
			$data=json_decode($data);
			$this->load->library('lib/lib_transaction');
			$res=$this->lib_transaction->setLoadTransaction($data,$session->tenant_id);
			$result->setData($res)->end();
		}else{$result->session()->end();}
	}
	public function listTransaction(){
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			$sql=$_GET['sql'];
			$count=$_GET['count'];
			$total=$this->query->row($count);
			$res=$this->query->result($sql);
			$result->setData($res)->setTotal($total->jum)->end();
		}else{$result->session()->end();}
	}
	public function excelTransaction(){
		$common = $this->common;
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			$session=$this->pagesession->get();
			$sql=$_GET['sql'];
			$res=$common->queryResult($sql);
			$common->excel($common->generateTable($res),$common->seq('EXPORT',$session->tenant_id).'.xls');
			return false;
		}else{$result->session()->end();}
	}
}