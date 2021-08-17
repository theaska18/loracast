<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Blog extends CI_Controller {
	public function index($type='page',$res='all',$page=0){
		$page=str_replace('.html','',$page);
		$res=str_replace('.html','',$res);
		if($page==1){
			$page=0;
		}
		$arr=array();
		$arr['ini']=$this;
		$arr['type']=$type;
		$arr['page']=$page;
		$arr['res']=$res;
		$this->load->view('blog/index',$arr);
	}
	public function artikel($page,$artikel){
		$this->load->library('lib/lib_common');
		$common = $this->lib_common;
		$cache=$common->cache_start();
		$query=strtoupper(str_replace('.html','',str_replace('-','',$artikel)));
		$pg=$page+1;
		$res=$this->query->row("SELECT P.option_name AS type_name,A.article_id,A.title,SUBSTRING_INDEX(SUBSTRING_INDEX(A.text,'<!-- pagebreak -->', ".$pg."),'<!-- pagebreak -->', -1) AS text,
			A.create_on,A.view,CONCAT(E.first_name,' ',E.last_name) AS create_by,A.post_type,A.page_count,A.page_image
			FROM con_article A
			INNER JOIN app_employee E ON E.employee_id=A.create_by 
			INNER JOIN app_parameter_option P ON P.option_code=A.post_type
			WHERE REPLACE(REPLACE(REPLACE(REPLACE(UPPER(title),' ',''),'/',''),',',''),':','')='".$query."' AND A.active_flag=1 AND A.system_flag=0");
		if($res){
			if(!$this->session->get('ARTICLE_'.$res->article_id)){
				$this->query->set("UPDATE con_article SET view=".($res->view+1)." WHERE article_id=".$res->article_id);
				$this->session->set('ARTICLE_'.$res->article_id,'ADA');
			}
		}
		$this->load->view('blog/single',array('data'=>$res,'ini'=>$this,'page'=>$page,'res'=>$artikel));
		$common->cache_end($cache);
	}
}