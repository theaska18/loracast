<?php
function initUpdate(){
	$pid=_get('i');
	$ori=_this()->query->row("SELECT system_property_name AS f2,system_property_value AS f3,description AS f4 FROM app_system_property WHERE system_property_code='".$pid."'");
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function delete(){
	$me=_this();
	$pid= _post('i');
	$res= $me->query->row("SELECT COUNT(system_property_code) AS total FROM app_system_property WHERE system_property_code='".$pid."'");
	if ($res->total != 0) {
		$me->query->set("DELETE FROM app_system_property WHERE system_property_code='".$pid."'");
		_message_delete('Property Code', $pid );
	}else
		_not_found();
}
function getList(){
	$me=_this();
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$propCode=_get('f1',false);
	$propName=_get('f2',false);
	$value=_get('f3',false);
	$description=_get('f4',false);
	$entity='app_system_property';
	$criteria='';
	$inner='';
	if($propCode != null && $propCode !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(system_property_code) like upper('%".$propCode."%')";
	}
	if($propName != null && $propName !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(system_property_name) like upper('%".$propName."%')";
	}
	if($value != null && $value !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(system_property_value) like upper('%".$value."%')";
	}
	if($description != null && $description !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(description) like upper('%".$description."%')";
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='system_property_name '.$direction;
			break;
		case "f3":
			$orderBy.='system_property_value '.$direction;
			break;
		case "f4":
			$orderBy.='description '.$direction;
			break;
		default:
			$orderBy.='system_property_code '.$direction;
			break;
	}
	$total=$me->query->row('SELECT count(system_property_code) AS total FROM '.$entity.' M '.$inner.' '.$criteria,false);
	$res=$me->query->result('SELECT system_property_code AS f1,system_property_name AS f2,system_property_value AS f3,
		description AS f4 FROM '.$entity.' M '.$inner.' '.$criteria.' '.$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
// function toExcel(){
	// $propCode=_get('f1');
	// $propName=_get('f2');
	// $value=_get('f3');
	// $description=_get('f4');
	// $criteria='';
	// if($propCode != null && $propCode !=''){
		// if($criteria=='')
			// $criteria.=' WHERE ';
		// else
			// $criteria.=' AND ';
		// $criteria.=" upper(system_property_code) like upper('%".$propCode."%')";
	// }
	// if($propName != null && $propName !=''){
		// if($criteria=='')
			// $criteria.=' WHERE ';
		// else
			// $criteria.=' AND ';
		// $criteria.=" upper(system_property_name) like upper('%".$propName."%')";
	// }
	// if($value != null && $value !=''){
		// if($criteria=='')
			// $criteria.=' WHERE ';
		// else
			// $criteria.=' AND ';
		// $criteria.=" upper(system_property_value) like upper('%".$value."%')";
	// }
	// if($description != null && $description !=''){
		// if($criteria=='')
			// $criteria.=' WHERE ';
		// else
			// $criteria.=' AND ';
		// $criteria.=" upper(description) like upper('%".$description."%')";
	// }
	// $orderBy=' ORDER BY system_property_code ASC ';
	// $res=_this()->query->result('SELECT system_property_code,system_property_name,system_property_value,description 
			// FROM app_system_property  '.$criteria.' '.$orderBy);
	// _excel(_function('generate_table',$res),_seq('EXPORT').'.xls');
	// return false;
// }