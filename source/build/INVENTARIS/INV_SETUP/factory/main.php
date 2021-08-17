<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT active_flag as f3 FROM inv_factory WHERE factory_id=".$pid);
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
	$active=_get('f3',false);
	$entity=' inv_factory ';
	$criteria=" WHERE";
	$inner='
			';
	$criteria.=" tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(factory_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(factory_name) like upper('%".$name."%')";
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
			$orderBy.='factory_name '.$direction;
			break;
		default:
		   	$orderBy.='factory_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(factory_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT factory_id AS i,factory_code AS f1,factory_name AS f2,M.active_flag AS f3
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$factory_code=_post('f1');
	$factory_name=_post('f2');
	$activeFlag=_post('f3');
	$id='';
	if($pageType=='ADD'){
		$allow=true;
		if($factory_code==''){
			$a=false;
			$sequenceCode=getSetting('FACTORY','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT factory_id FROM inv_factory WHERE factory_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$factory_code=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT factory_id FROM inv_factory WHERE factory_code='".$factory_code."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$id=_getTableSequence('inv_factory');
			 _this()->query->set("INSERT INTO inv_factory(factory_id,factory_code,factory_name,active_flag,create_on,create_by,tenant_id)VALUES
					(".$id.",'".$factory_code."','".$factory_name."',".$activeFlag.",'"._format()."',"._session()->employee_id.","._session()->tenant_id.")");
			_data(array('i'=>$id,'f1'=>$factory_code));
			_message_save('Kode Pabrik', $factory_code );
		}else
			_message_exist ('Kode Pabrik', $factory_code );
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE inv_factory SET factory_name='".$factory_name."',active_flag=".$activeFlag.",update_on='"._format()."',update_by="._session()->employee_id."
				WHERE factory_id=".$pid);
		_data(array('i'=>$id,'f1'=>$factory_code));
		_message_update ('Kode Pabrik', $factory_code );
	}
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT factory_code FROM inv_factory WHERE factory_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_factory WHERE factory_id=".$pid);
		_message_delete('kode Pabrik', $pid );
	}else
		_not_found();
}