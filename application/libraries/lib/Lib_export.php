<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_export {
	public function excel($html,$name='DEFAULT.xls'){
		header("Content-Type: application/vnd.ms-excel");
		header("Expires: 0");
		header("Cache-Control:  must-revalidate, post-check=0, pre-check=0");
		header("Content-disposition: attachment; filename=".$name);
		echo $html;
	}
	public function word($html,$name='DEFAULT.doc'){
		header("Content-Type: application/vnd.ms-word");
		header("Expires: 0");
		header("Cache-Control:  must-revalidate, post-check=0, pre-check=0");
		header("Content-disposition: attachment; filename=".$name);
		echo $html;
	}
}
?>