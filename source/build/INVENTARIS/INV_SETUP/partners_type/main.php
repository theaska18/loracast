<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT description AS f3,active_flag as f4,permission_flag as f5 FROM inv_partners_type WHERE partners_type_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$type=_get('f3',false);
	$active=_get('f4',false);
	$izin=_get('f5',false);
	$entity=' inv_partners_type ';
	$criteria=" WHERE";
	$inner='
			';
	$criteria.=" tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(partners_type_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(partners_type_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND upper(description) like upper('%".$type."%')";
	if($active != null && $active !=''){
		if($active=='Y')
			$criteria.=' AND M.active_flag=true ';
		else
			$criteria.=' AND M.active_flag=false ';
	}
	if($izin != null && $izin !=''){
		if($izin=='Y')
			$criteria.=' AND M.permission_flag=true ';
		else
			$criteria.=' AND M.permission_flag=false ';
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='partners_type_name '.$direction;
			break;
		case "f3":
			$orderBy.='description '.$direction;
			break;
		default:
		   	$orderBy.='partners_type_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(partners_type_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT partners_type_id AS i,partners_type_code AS f1,partners_type_name AS f2,description AS f3,M.active_flag AS f4
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$partners_type_code=_post('f1');
	$partners_type_name=_post('f2');
	$description=_post('f3');
	$activeFlag=_post('f4');
	$permission=_post('f5');
	if($pageType=='ADD'){
		$allow=true;
		if($partners_type_code==''){
			$a=false;
			$sequenceCode=getSetting('PARTNERS_TYPE','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT partners_type_id FROM inv_partners_type WHERE partners_type_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$partners_type_code=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT partners_type_id FROM inv_partners_type WHERE partners_type_code='".$partners_type_code."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$id=_getTableSequence('inv_partners_type');
			 _this()->query->set("INSERT INTO inv_partners_type(partners_type_id,partners_type_code,partners_type_name,description,active_flag,create_on,create_by,tenant_id,permission_flag)VALUES
					(".$id.",'".$partners_type_code."','".$partners_type_name."','".$description."',".$activeFlag.",'"._format()."',"._session()->employee_id.","._session()->tenant_id.",".$permission.")");
			_message_save(_this()->lang->line('CODE'), $partners_type_code );
		}else
			_message_exist (_this()->lang->line('CODE'), $partners_type_code );
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE inv_partners_type SET permission_flag=".$permission.",partners_type_name='".$partners_type_name."',description='".$description."',active_flag=".$activeFlag.",update_on='"._format()."',update_by="._session()->employee_id."
				WHERE partners_type_id=".$pid);
		_message_update (_this()->lang->line('CODE'), $partners_type_code );
	}
}
function delete(){
	_load('lib/lib_language');
	_this()->lib_language->load('PARTNERS_TYPE');
	$pid= _post('i');
	$res=  _this()->query->row("SELECT partners_type_code FROM inv_partners_type WHERE partners_type_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_partners_type WHERE partners_type_id=".$pid);
		_message_delete(_this()->lang->line('CODE'), $pid );
	}else
		_not_found();
}