<?php
function delete(){
	$me=_this();
	$pid= _post('i');
	$code='';
	$res= $me->query->row("SELECT tenant_name,logo FROM app_tenant WHERE tenant_id=".$pid);
	$foto=null;
	if ($res != null) {
		$foto=$res->logo;
		$code=$res->tenant_name;
		$me->query->set("DELETE FROM app_tenant WHERE tenant_id=".$pid);
		_load('lib/lib_image');
		$me->lib_image->upload(null,'jpg',$foto);
		_message_delete('Nama Penyewa', $code );
	}else
		_not_found();
}
function getForMenu(){
	$me=_this();
	$id=_get('i');
	$roles=$me->query->result("SELECT A.menu_id FROM app_tenant_menu M INNER JOIN app_menu A ON M.menu_id=A.menu_id WHERE tenant_id=".$id);
	$res=getChild($roles,NULL,$me);
	_data($res);
}
function resetSetting(){
	$tenant_id=_post('tenant_id');
	$menu_id=_post('menu_id');
	_this()->query->set("DELETE FROM app_tenant_setting WHERE tenant_id=".$tenant_id." AND 
		setting_id IN(SELECT setting_id FROM app_menu_setting WHERE menu_id=".$menu_id.")");
	_message('Setting Kembali ke Default');
}
function updateSetting(){
	$me=_this();
	$tenant_id=_post('tenant_id');
	$setting_code=_post('setting_code');
	$value=_post('value');
	$menu_id=_post('menu_id');
	$setting=$me->query->row("SELECT T.tenant_setting_id FROM app_menu_setting M 
		INNER JOIN app_tenant_setting T ON T.setting_id=M.setting_id AND T.tenant_id=".$tenant_id." 
		WHERE M.menu_id=".$menu_id." AND M.setting_code='".$setting_code."'");
	$setting2=$me->query->row("SELECT M.setting_value FROM app_menu_setting M WHERE M.setting_code='".$setting_code."' 
			AND M.menu_id=".$menu_id);
	if($value !==$setting2->setting_value){
		if($setting){
			$arr=array();
			$arr['setting_value']=$value;
			$me->db->where('tenant_setting_id',$setting->tenant_setting_id);
			$me->db->update('app_tenant_setting',$arr);
		}else{
			$setting=$me->query->row("SELECT M.setting_id FROM app_menu_setting M WHERE M.setting_code='".$setting_code."' 
				AND M.menu_id=".$menu_id);
			$id=_getTableSequence('app_tenant_setting');
			$arr=array();
			$arr['tenant_setting_id']=(double)$id;
			$arr['setting_value']=$value;
			$arr['setting_id']=$setting->setting_id;
			$arr['tenant_id']=(double)$tenant_id;
			$me->db->insert('app_tenant_setting',$arr);
		}
	}else{
		if($setting){
			$me->query->set('DELETE FROM app_tenant_setting WHERE tenant_setting_id='.$setting->tenant_setting_id);
		}
	}
}
function getListSetting(){
	$me=_this();
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$menu_id=_get('menu_id');
	$tenant_id=_get('tenant_id');
	if($menu_id != null && $menu_id !=''){
		$entity=' app_menu_setting';
		$criteria=" WHERE";
		$inner='	
			LEFT JOIN app_tenant_setting T ON T.tenant_id='.$tenant_id.' AND T.setting_id=M.setting_id
		';
		$criteria.=" M.menu_id=".$menu_id." ";
		
		$orderBy=' ORDER BY ';
		if($direction == null)
			$direction='ASC';
		switch ($sorting){
			default:
				$orderBy.='setting_name '.$direction;
				break;
		}
		$total=$me->query->row("SELECT count(M.setting_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
		$res=$me->query->result("SELECT M.setting_code,M.setting_name,
			IFNULL(T.setting_value,M.setting_value) AS setting_value
		,M.setting_desc
					FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
		_data($res)->setTotal($total->total);
	}
}

function getChild($roles,$parentId=null,$me){
	$res=array();
	if($parentId==null){
		$group=_get('group');
		$query=' AND group_id is null ';
		if($group!=null && $group!=''){
			$query=" AND group_id='".$group."' ";
		}
		$menus=$me->query->result("SELECT menu_name,menu_code,menu_type,menu_id,parent_id,icon FROM app_menu  WHERE parent_id is null ".$query." and active_flag=1 ORDER BY line");
	}else{
		$menus=$me->query->result("SELECT menu_name,menu_code,menu_type,menu_id,parent_id,icon FROM app_menu  WHERE parent_id=".$parentId." and active_flag=1 ORDER BY line");
	}
	for($i=0; $i<count($menus);$i++){
		if($menus[$i]->parent_id==$parentId){
			$menu=$menus[$i];
			array_splice($menus,$i,1);
			$i--;
			$a=array();
			$a['text']=$menu->menu_name;
			$a['f1']=$menu->menu_id;
			$a['f2']=$menu->menu_code;
			$a['iconCls']='fa fa-folder-open';
			$a['checked']=false;
			for($j=0; $j<count($roles);$j++){
				if($roles[$j]->menu_id==$menu->menu_id){
					$a['checked']=true;
					array_splice($roles,$j,1);
					$j--;
				}
			}
			if($menu->menu_type=='MENUTYPE_FOLDER')
				$a['children']=getChild($roles,$menu->menu_id,$me);
			else{
				$a['type']='MENU';
				$a['iconCls']='fa fa-desktop';
				$a['children']=array();
			}
			$res[]=$a;
		}
	}
	return $res;
}
function getListAccess(){
	$me=_this();
	$id=_get('tenant_id');
	$menu_id=_get('menu_id');
	if($menu_id != null && $menu_id !=''){
		$access=$me->query->result("SELECT menu_access_id FROM app_tenant_menu_access WHERE tenant_id=".$id);
		$res=array();
		$menus=$me->query->result("SELECT access_name ,menu_access_id FROM app_menu_access WHERE menu_id=".$menu_id." AND active_flag=1 ORDER BY access_name");
		for($i=0,$iLen=count($menus); $i<$iLen;$i++){
			$menu=$menus[$i];
			$a=array();
			$a['f2']=$menu->access_name;
			$a['i']=$menu->menu_access_id;
			$a['f1']=false;
			for($j=0; $j<count($access);$j++){
				if($access[$j]->menu_access_id==$menu->menu_access_id){
					$a['f1']=true;
					array_splice($access,$j,1);
					$j--;
				}
			}
			$res[]=$a;
		}
		_data($res);
	}else{
		_data(array());
	}
}
function saveMenu(){
	$me=_this();
	$id=_post('i');
	$menuId=json_decode(_post('f1'));
	$menuId2=json_decode(_post('f2'));
	$menuIdC=json_decode(_post('f3'));
	$menuIdC2=json_decode(_post('f4'));
	$me->query->start();
	for($i=0,$iLen=count($menuId);$i<$iLen;$i++){
		if($menuIdC[$i]===true){
			$idRoleMenu=_getTableSequence('app_tenant_menu');
			$me->query->set("INSERT INTO app_tenant_menu(tenant_menu_id,menu_id,tenant_id)VALUES(".$idRoleMenu.",".$menuId[$i].",".$id.")");
		}else{
			$me->query->set("DELETE FROM app_tenant_menu WHERE tenant_id=".$id." AND menu_id=".$menuId[$i]);
		}
	}
	for($i=0,$iLen=count($menuId2);$i<$iLen;$i++){
		if($menuIdC2[$i]===true){
			$idRoleMenu=_getTableSequence('app_tenant_menu_access');
			$me->query->set("INSERT INTO app_tenant_menu_access(tenant_menu_access_id,menu_access_id,tenant_id)VALUES(".$idRoleMenu.",".$menuId2[$i].",".$id.")");
		}else{
			$me->query->set("DELETE FROM app_tenant_menu_access WHERE tenant_id=".$id." AND menu_access_id=".$menuId2[$i]);
		}
	}
	$me->query->end();
}