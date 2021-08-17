<?php
if (! defined ( 'BASEPATH' ))exit ( 'No direct script access allowed' );
class Printer{
	public $CODE='SEND_PRINT',$DESCRIPTION='',$TYPE='REPORT',$LIST=array(),
		$TEMPLATE='',$VIEW='N',$PRINT_CODE='DEFAULT',$arr=array();
	public function set($key,$param){
		$this->arr[$key]=$param;
	}
	public function create(){
		$ci = & get_instance();
		$this->arr['CODE']=$this->CODE;
		$this->arr['PRINT_CODE']=$this->PRINT_CODE;
		$this->arr['DESCRIPTION']=$this->DESCRIPTION;
		$this->arr['TYPE']=$this->TYPE;
		$this->arr['LIST']=$this->LIST;
		$this->arr['TEMPLATE']=$this->TEMPLATE;
		$this->arr['VIEW']=$this->VIEW;
		return $this->arr;
	}
}
?>