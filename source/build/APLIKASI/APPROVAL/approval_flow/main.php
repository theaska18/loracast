<?php
function delete(){
	$me=_this();
	$pid=_post('i');
	$res=$me->query->row("SELECT approval_flow_code FROM app_approval_flow WHERE approval_flow_id=".$pid);
	if($res){
		$code=$res->approval_flow_code;
		$me->query->set("DELETE FROM app_approval_flow WHERE approval_flow_id=".$pid);
		_message_delete('Kode Persetujuan',$code)->end();
	}else
		_not_found();
}
function initAllow_allow(){
	$me=_this();
	$pid=_post('i');
	$res=$me->query->row("SELECT AD.approval_detail_id 
		FROM app_approval_detail AD
		INNER JOIN app_approval A ON A.approval_id=AD.approval_id
		WHERE A.approval_id=".$pid." AND AD.approval_status ='APPROVE_REVISI'
			AND A.approval_status in('APPROVAL_PENDING','APPROVAL_PROGRESS')
		ORDER BY approval_detail_id LIMIT 1");
	if($res){
		$me->query->set("UPDATE app_approval_detail SET approval_status='APPROVE_WAIT'  WHERE approval_id=".$pid);
		$me->query->set("UPDATE app_approval SET approval_status='APPROVAL_REVISI'  WHERE approval_id=".$pid);
	}
	$res=$me->query->row("SELECT AD.approval_detail_id 
		FROM app_approval_detail AD
		INNER JOIN app_approval A ON A.approval_id=AD.approval_id
		WHERE A.approval_id=".$pid." AND AD.approval_status ='APPROVE_REJECT'
			AND A.approval_status in('APPROVAL_PENDING','APPROVAL_PROGRESS')
		ORDER BY approval_detail_id LIMIT 1");
	if($res){
		$me->query->set("UPDATE app_approval_detail SET approval_status='APPROVE_REJECT'  WHERE approval_id=".$pid);
		$me->query->set("UPDATE app_approval SET approval_status='APPROVAL_CANCEL'  WHERE approval_id=".$pid);
	}
	$res=$me->query->row("SELECT AD.approval_detail_id,AD.flow_type,AD.employee_id,AD.structure_id
		FROM app_approval_detail AD
		INNER JOIN app_approval A ON A.approval_id=AD.approval_id
		WHERE A.approval_id=".$pid." AND AD.approval_status ='APPROVE_WAIT'
			AND A.approval_status in('APPROVAL_PENDING','APPROVAL_PROGRESS')
		ORDER BY approval_detail_id LIMIT 1");
	if($res){
		if($res->flow_type=='APPROVAL_TYPE_ORGANIZATION'){
			if($res->structure_id !==null && $res->structure_id !=''){
				$str=$me->query->row("SELECT employee_id,structure_name FROM org_structure WHERE structure_id=".$res->structure_id);
				if($str->employee_id != null && $str->employee_id!==''){
					$me->query->set("UPDATE app_approval_detail SET employee_id=".$str->employee_id."  WHERE approval_detail_id=".$res->approval_detail_id);
					_data(array('r'=>'S'));
				}else{
					$me->query->set("UPDATE app_approval SET approval_status='APPROVAL_BUG'  WHERE approval_id=".$pid);
					$me->query->set("UPDATE app_approval_detail SET description_error='Tidak Pimpinan Struktur Organisasi ".$str->structure_name."'  WHERE approval_detail_id=".$res->approval_detail_id);
					_data(array('r'=>'S'));
				}
			}else{
				$me->query->set("UPDATE app_approval SET approval_status='APPROVAL_BUG'  WHERE approval_id=".$pid);
				$me->query->set("UPDATE app_approval_detail SET description_error='Struktur Tidak Ada'  WHERE approval_detail_id=".$res->approval_detail_id);
				_data(array('r'=>'S'));
			}
		}else if($res->flow_type=='APPROVAL_TYPE_EMPLOYEE'){
			if($res->employee_id !==null && $res->employee_id !=''){
				_data(array('r'=>'S'));
			}else{
				_data(array('r'=>'EM'));
			}
		}else if($res->flow_type=='APPROVAL_TYPE_TOP'){
			
		}else if($res->flow_type=='APPROVAL_TYPE_BOTTOM'){
			
		}else if($res->flow_type=='APPROVAL_TYPE_BOTTOM_STRUCTURE'){
			
		}
	}
}
