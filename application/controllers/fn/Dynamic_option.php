<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Dynamic_option extends MY_controller {
	function __construct(){parent::__construct();}
 	public function getDynamicOption(){
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			$text=$this->get('query');
			$type=$this->get('type');
			$parent=$this->get('parent');
			$arr=array();
			$sqlParent='';
			if($parent!=''){$sqlParent="AND parent='".$parent."'";}
			$res=$this->query->result("SELECT distinct(value) AS id,value AS text,parent FROM app_dynamic_option WHERE UPPER(value) LIKE UPPER('%".$text."%')
				AND option_type='".$type."' ".$sqlParent." ORDER BY value ASC LIMIT 25 ");
			$result->setData($res)->end();
		}else{$result->session()->end();}
	}
	public function deleteDynamic(){
		$result=$this->jsonresult;
		if ($this->pagesession->cek()){
			$value=$_POST['value'];
			$par=$_POST['parent'];
			$sqlParent=" AND parent='".$par."'";
			if($par==''){$sqlParent=" AND (parent='".$par."' or parent is null)";}
			$this->query->set("DELETE from app_dynamic_option WHERE value='".$value."' ".$sqlParent);
			$result->end();
		}else{$result->session()->end();}
	}
}