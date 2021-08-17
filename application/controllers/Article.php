<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Article extends CI_Controller {
	public function index(){
		$query=strtoupper($_GET['src']);
		$page=1;
		if(isset($_GET['page'])){
			$page=$_GET['page'];
		}
		$res=$this->query->row("SELECT P.option_name AS type_name,A.article_id,A.title,SUBSTRING_INDEX(SUBSTRING_INDEX(A.text,'<!-- pagebreak -->', ".$page."),'<!-- pagebreak -->', -1) AS text,
			A.create_on,A.view,CONCAT(E.first_name,' ',E.last_name) AS create_by,A.post_type,A.page_count,A.page_image
			FROM con_article A
			INNER JOIN app_employee E ON E.employee_id=A.create_by 
			INNER JOIN app_parameter_option P ON P.option_code=A.post_type
			WHERE UPPER(title)='".$query."' AND A.active_flag=1 AND A.system_flag=0");
		if($res){
			if(!$this->session->get('ARTICLE_'.$res->article_id)){
				$this->query->set("UPDATE con_article SET view=".($res->view+1)." WHERE article_id=".$res->article_id);
				$this->session->set('ARTICLE_'.$res->article_id,'ADA');
			}
		}
		$this->load->view('second/article',array('data'=>$res,'ini'=>$this,'page'=>$page));
	}
	public function search(){
		$this->load->view('second/search',array('ini'=>$this));
	}
	public function tag(){
		$this->load->view('second/tag',array('ini'=>$this));
	}
	
}