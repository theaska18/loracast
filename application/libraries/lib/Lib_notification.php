<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_notification {
	public function set($title,$msg,$code=null,$employee=null,$tenant=null,$start=null,$end=null,$session,$tableSequence,$format){
		$ci=& get_instance();
		if($tenant==null || $tenant==''){$tenant=$session->tenant_id;}
		$arr=array();
		$id=$tableSequence->get('app_notification');
		$arr['notification_id']=$id;
		if($tenant != null && $tenant !=''){$arr['tenant_id']=(double)$tenant;}
		if($employee != null && $employee !==''){$arr['employee_id']=(double)$employee;}
		$arr['title']=$title;
		$arr['message']=$msg;
		if($code != null && $code !==''){
			$menu=$ci->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$code."'");
			if($menu){$arr['menu_id']=(double)$menu->menu_id;
			}else{$ci->query->back();$ci->jsonresult->setMessage("Kode Menu '".$code."' Tidak Ada.")->error()->end();}
		}
		if($start==null || $start==''){$arr['start_date']=$format;}
		if($end != null && $end !==''){$arr['end_date']=$format;}
		$arr['create_on']=$format;
		$arr['create_by']=$session->employee_id;
		$ci->db->insert('app_notification',$arr);
	}
}
?>