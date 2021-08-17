<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT active_flag as f4,system_flag as f5,result as f7 FROM app_cache WHERE cache_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function generate(){
	$me=_this();
	$result=_result();
	$sesi=_get('sesi');
	if($sesi ==null || $sesi ==''){
		$result->error()->setMessage('Session Tidak Boleh Kosong')->end();
	}
	$me->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
	$session=$me->cache->get($sesi);
	$sessionAccess=$me->cache->get($sesi.'_ACCESS');
	$sessionMenu=$me->cache->get($sesi.'_MENU');
	$sessionSetting=$me->cache->get($sesi.'_SETTING');
	$sessionImports=$me->cache->get($sesi.'_IMPORTS');
	if($session){
		$result->setData(json_encode((object) array_merge((array)  json_decode($sessionSetting),array_merge((array)  json_decode($sessionImports),array_merge((array)json_decode($session),(array) array_merge((array)json_decode($sessionAccess),(array)json_decode($sessionMenu)))))));
	}else{
		$result->error()->setMessage('Session Tidak ada.')->end();
	}
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
	$sistem=_get('f5',false);
	$entity=' app_cache ';
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
	if($sistem != null && $sistem !=''){
		if($sistem=='Y')
			$criteria.=' M.system_flag=true ';
		else
			$criteria.=' M.system_flag=false ';
	}
	if($code != null && $code !='')
		$criteria.=" AND upper(cache_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(cache_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND upper(description) like upper('%".$type."%')";
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='cache_name '.$direction;
			break;
		case "f3":
			$orderBy.='description '.$direction;
			break;
		default:
		   	$orderBy.='cache_code '.$direction;
			break;
	}
	$me=_this();
	$total=$me->query->row("SELECT count(cache_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=$me->query->result("SELECT cache_id AS i,cache_code AS f1,cache_name AS f2,description AS f3,M.system_flag AS f4,M.active_flag AS f5
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
	$systemFlag=_post('f5');
	$Result=_post('f7');
	_load('lib/lib_language');
	$me=_this();
	$me->lib_language->load('CACHE');
	$me->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
	$Result=json_decode($Result);
	$Result->session_id=$group_code;
	$Result=json_encode($Result);
	if($pageType=='ADD'){
		$session=$me->cache->get($group_code);
		if($session){
			_result()->error()->setMessage("Session '".$group_code."' sudah ada di Sistem.")->end();
		}
		$res= $me->query->row("SELECT COUNT(cache_code) AS total FROM app_cache WHERE cache_code='".$group_code."' ");
		if ($res->total==0) {
			$id=_getTableSequence('app_cache');
			$arr=array();
			$arr['cache_id']=$id;
			$arr['cache_code']=$group_code;
			$arr['cache_name']=$group_name;
			$arr['description']=$description;
			$arr['active_flag']=$activeFlag;
			$arr['system_flag']=$systemFlag;
			$arr['create_on']=_format();
			$arr['create_by']=_session()->employee_id;
			$arr['result']=$Result;
			$me->db->insert('app_cache',$arr);
			_message_save('Kode Cache', $group_code );
		}else
			_message_exist ('Kode Cache', $group_code );
	}else if($pageType=='UPDATE'){
		$res= $me->query->row("SELECT COUNT(cache_code) AS total FROM app_cache WHERE cache_code='".$group_code."' AND cache_id <>".$pid);
		if ($res->total==0) {
			$arr=array();
			$arr['cache_code']=$group_code;
			$arr['cache_name']=$group_name;
			$arr['description']=$description;
			$arr['active_flag']=$activeFlag;
			$arr['system_flag']=$systemFlag;
			$arr['update_on']=_format();
			$arr['update_by']=_session()->employee_id;
			$arr['result']=$Result;
			$me->db->where('cache_id',$pid);
			$me->db->update('app_cache',$arr);
			$me->cache->delete($group_code);
			_message_update ('Kode Cache', $group_code );
		}else{
			_message_exist ('Kode Cache', $group_code );
		}
	}
}
function delete(){
	_load('lib/lib_language');
	$me=_this();
	$me->lib_language->load('CAHCE');
	$pid= _post('i');
	$res=  $me->query->row("SELECT cache_code FROM app_cache WHERE cache_id=".$pid);
	if ($res) {
		 $me->query->set("DELETE FROM app_cache WHERE cache_id=".$pid);
		 $me->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
		 $me->cache->delete($res->cache_code);
		_message_delete('Kode Cache', $res->cache_code );
	}else
		_not_found();
}