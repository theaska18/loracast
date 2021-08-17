<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT description AS f3,active_flag as f4 FROM inv_distributor_type WHERE distributor_type_id=".$pid);
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
	$entity=' inv_distributor_type ';
	$criteria=" WHERE";
	$inner='
			';
	$criteria.=" tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(distributor_type_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(distributor_type_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND upper(description) like upper('%".$type."%')";
	if($active != null && $active !=''){
		if($active=='Y')
			$criteria.=' AND M.active_flag=true ';
		else
			$criteria.=' AND M.active_flag=false ';
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='distributor_type_name '.$direction;
			break;
		case "f3":
			$orderBy.='description '.$direction;
			break;
		default:
		   	$orderBy.='distributor_type_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(distributor_type_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT distributor_type_id AS i,distributor_type_code AS f1,distributor_type_name AS f2,description AS f3,M.active_flag AS f4
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$distributor_type_code=_post('f1');
	$distributor_type_name=_post('f2');
	$description=_post('f3');
	$activeFlag=_post('f4');
	if($pageType=='ADD'){
		$allow=true;
		if($distributor_type_code==''){
			$a=false;
			$sequenceCode=getSetting('DISTRIBUTOR_TYPE','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT distributor_type_id FROM inv_distributor_type WHERE distributor_type_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$distributor_type_code=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT distributor_type_id FROM inv_distributor_type WHERE distributor_type_code='".$distributor_type_code."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$id=_getTableSequence('inv_distributor_type');
			 _this()->query->set("INSERT INTO inv_distributor_type(distributor_type_id,distributor_type_code,distributor_type_name,description,active_flag,create_on,create_by,tenant_id)VALUES
					(".$id.",'".$distributor_type_code."','".$distributor_type_name."','".$description."',".$activeFlag.",'".$now->format('Y-m-d H:i:s')."',"._session()->employee_id.","._session()->tenant_id.")");
			_message_save('Kode Jenis', $distributor_type_code );
		}else
			_message_exist ('Kode Jenis', $distributor_type_code );
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE inv_distributor_type SET distributor_type_name='".$distributor_type_name."',description='".$description."',active_flag=".$activeFlag.",update_on='"._format()."',update_by="._session()->employee_id."
				WHERE distributor_type_id=".$pid);
		_message_update ('Kode Jenis', $distributor_type_code );
	}
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT distributor_type_code FROM inv_distributor_type WHERE distributor_type_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_distributor_type WHERE distributor_type_id=".$pid);
		_message_delete('Kode Jenis', $pid );
	}else
		_not_found();
}