<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Comment extends MY_controller {
	function __construct() {
		parent::__construct();
	}
 	public function index(){
		$this->load->view('content/comment',array('ini'=>$this));
		
	}
	public function save(){
		$parent=$_POST['parent'];
		$url=$_POST['url'];
		$name=$_POST['name'];
		$email=$_POST['email'];
		$comment=$_POST['comment'];
		$this->query->start();
		$this->load->library('lib/lib_table_sequence');
		$now=new DateTime();
		$data=array(
			'comment_id'=>$this->lib_table_sequence->get('con_comment'),
			'url'=>$url,
			'email'=>$email,
			'name'=>$name,
			'comment'=>$comment,
			'create_on'=>$now->format('Y-m-d H:i:s')
		);
		if($parent !==''){
			$data['parent_id']=$parent;
		}
		$this->db->insert('con_comment',$data);
		$this->query->end();
		header('location: '.base_url().'fn/comment?url='.$url);
	}
}