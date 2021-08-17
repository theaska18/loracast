<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT description AS f3,active_flag as f4 FROM app_menu_group WHERE group_id=".$pid);
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
	$entity=' app_menu_group ';
	$criteria=" WHERE";
	$inner='
			';
	$criteria.=" ";
	if($active != null && $active !=''){
		if($active=='Y')
			$criteria.=' M.active_flag=true ';
		else
			$criteria.=' M.active_flag=false ';
	}else{
		$criteria.=' M.active_flag=true ';
	}
	if($code != null && $code !='')
		$criteria.=" AND upper(group_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(group_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND upper(description) like upper('%".$type."%')";
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='group_name '.$direction;
			break;
		case "f3":
			$orderBy.='description '.$direction;
			break;
		default:
		   	$orderBy.='group_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(group_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT group_id AS i,group_code AS f1,group_name AS f2,description AS f3,M.active_flag AS f4
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$group_code=_post('f1');
	$group_name=_post('f2');
	$description=_post('f3');
	$activeFlag=_post('f4');
	$now=new DateTime();
	_load('lib/lib_language');
	_this()->lib_language->load('MENU_GROUP');
	if($pageType=='ADD'){
		$res= _this()->query->row("SELECT COUNT(group_code) AS total FROM app_menu_group WHERE group_code='".$group_code."' ");
		if ($res->total==0) {
			_load('lib/lib_table_sequence');
			$id=_this()->lib_table_sequence->get('app_menu_group');
			 _this()->query->set("INSERT INTO app_menu_group(group_id,group_code,group_name,description,active_flag,create_on,create_by)VALUES
					(".$id.",'".$group_code."','".$group_name."','".$description."',".$activeFlag.",'".$now->format('Y-m-d H:i:s')."','"._this()->pagesession->get()->user_code."')");
			_message_save(_this()->lang->line('CODE'), $group_code );
		}else
			_message_exist (_this()->lang->line('CODE'), $group_code );
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE app_menu_group SET group_name='".$group_name."',description='".$description."',active_flag=".$activeFlag.",update_on='".$now->format('Y-m-d H:i:s')."',update_by='"._this()->pagesession->get()->user_code."'
				WHERE group_id=".$pid);
		_message_update (_this()->lang->line('CODE'), $group_code );
	}
}
function delete(){
	_load('lib/lib_language');
	_this()->lib_language->load('MENU_GROUP');
	$pid= _post('i');
	$res=  _this()->query->row("SELECT group_code FROM app_menu_group WHERE group_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM app_menu_group WHERE group_id=".$pid);
		_message_delete(_this()->lang->line('CODE'), $pid );
	}else
		_not_found();
}