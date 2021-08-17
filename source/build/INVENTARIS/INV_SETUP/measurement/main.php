<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT measurement_type AS f3,active_flag as f4 FROM inv_measurement WHERE measurement_id=".$pid);
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
	$entity=' inv_measurement ';
	$criteria=" WHERE";
	$inner='
			INNER JOIN app_parameter_option A ON M.measurement_type=A.option_code';
	$criteria.=" tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(measurement_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(measurement_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND M.measurement_type='".$type."'";
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
			$orderBy.='measurement_name '.$direction;
			break;
		case "f3":
			$orderBy.='measurement_type '.$direction;
			break;
		default:
		   	$orderBy.='measurement_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(measurement_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT measurement_id AS i,measurement_code AS f1,measurement_name AS f2,A.option_name AS f3,M.active_flag AS f4
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$measurement_code=_post('f1');
	$measurement_name=_post('f2');
	$measurement_type=_post('f3');
	$activeFlag=_post('f4');
	if($pageType=='ADD'){
		$res= _this()->query->row("SELECT COUNT(measurement_code) AS total FROM inv_measurement WHERE measurement_code='".$measurement_code."' AND tenant_id="._session()->tenant_id);
		if ($res->total==0) {
			$id=_getTableSequence('inv_measurement');
			 _this()->query->set("INSERT INTO inv_measurement(measurement_id,measurement_code,measurement_name,measurement_type,active_flag,create_on,create_by,tenant_id)VALUES
					(".$id.",'".$measurement_code."','".$measurement_name."','".$measurement_type."',".$activeFlag.",'"._format()."',"._session()->employee_id.","._session()->tenant_id.")");
			_message_save('Kode Satuan', $measurement_code );
		}else
			_message_exist ('Kode Satuan', $measurement_code );
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE inv_measurement SET measurement_name='".$measurement_name."',measurement_type='".$measurement_type."',active_flag=".$activeFlag.",update_on='"._format()."',update_by="._session()->employee_id."
				WHERE measurement_id=".$pid);
		_message_update ('Kode Satuan', $measurement_code );
	}
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT measurement_code FROM inv_measurement WHERE measurement_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_measurement WHERE measurement_id=".$pid);
		_message_delete('Kode Satuan', $pid );
	}else
		_not_found();
}