<?php
function getList(){
	$me=_this();
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$roleCode=_get('f1',false);
	$roleName=_get('f2',false);
	$Description=_get('f3',false);
	$activeFlag=_get('f4',false);
	$tenant=_get('f5',false);
	
	$entity='app_role';
	$criteria=" WHERE ";
	$inner='';
	if($tenant!=null && $tenant != ''){
		$criteria.=" tenant_id=".$tenant;
	}else{
		$criteria.=" tenant_id="._session()->tenant_id;
	}
	if($roleCode != null && $roleCode !='')
		$criteria.=" AND upper(role_code) like upper('%".$roleCode."%')";
	if($roleName != null && $roleName !='')
		$criteria.=" AND upper(role_name) like upper('%".$roleName."%')";
	if($Description != null && $Description !='')
		$criteria.=" AND upper(description) like upper('%".$Description."%')";
	if($activeFlag != null && $activeFlag !=''){;
		if($activeFlag=='Y')
			$criteria.=' AND active_flag=true ';
		else
			$criteria.=' AND active_flag=false ';
	}else{
		$criteria.=' AND active_flag=true ';
	}
	$orderBy='ORDER BY';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2":
			$orderBy.=' role_name '.$direction;
			break;
		case "f3":
			$orderBy.=' description '.$direction;
			break;
		default:
			$orderBy.=' role_code '.$direction;
			break;
	}
	$total=$me->query->row("SELECT count(role_id) AS total FROM ".$entity."  ".$inner." ".$criteria);
	$res=$me->query->result("SELECT role_id AS i,role_code AS f1,role_name AS f2,description AS f3,active_flag AS f4,tenant_id AS f5 FROM ".$entity." ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$me=_this();
	$pageType=_post('p');
	$id=_post('i');
	$roleCode=_post('f1');
	$roleName=_post('f2');
	$description=_post('f3');
	$activeFlag=_post('f4');
	$tenant=_post('f5');
	
	if($pageType=='ADD'){
		$allow=true;
		if($roleCode==''){
			$a=false;
			$sequenceCode=getSetting('ROLE','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res= $me->query->row("SELECT role_id FROM app_role WHERE role_code='".$codenya."' AND tenant_id=".$tenant);
				if(!$res){
					$roleCode=$codenya;
					$a=true;
				}
			}
		}else{
			$res= $me->query->row("SELECT role_id FROM app_role WHERE role_code='".$roleCode."' AND tenant_id=".$tenant);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$id=_getTableSequence('app_role');
			$me->query->set("INSERT INTO app_role(role_id,role_code,role_name,description,active_flag,tenant_id)
					VALUES(".$id.",'".$roleCode."','".$roleName."','".$description."',".$activeFlag.",".$tenant.")");
			_message_save('Role Code',$roleCode);
		}else 
			_message_exist('Role Code',$roleCode);
	}else if($pageType=='UPDATE'){
		$res= $me->query->row("SELECT role_id FROM app_role WHERE role_id=".$id);
		if($res){
			$me->query->set("UPDATE app_role SET role_name='".$roleName."',description='".$description."',active_flag=".$activeFlag.",tenant_id=".$tenant." 
				WHERE role_id=".$id);
			_message_update ('Role Code', $roleCode );
		}else
			_not_found();
	}
}
function delete(){
	$me=_this();
	$pid= _post('i');
	$role= $me->query->row("SELECT role_code FROM app_role WHERE role_id=".$pid);
	if($role){
		$me->query->set("DELETE FROM app_role WHERE role_id=".$pid);
		_message_delete('Role Code',$role->role_code);
	}else 
		_not_found();
}
function getForMenu(){
	$me=_this();
	$id=_get('i');
	$tenant=_get('t');
	$roles=$me->query->result("SELECT A.menu_id FROM app_role_menu M INNER JOIN app_menu A ON M.menu_id=A.menu_id WHERE role_id=".$id);
	$res=getChild($roles,null,$tenant,$me);
	_data($res);
}
function getChild($roles,$parentId=null,$tenant_id,$me){
	$res=array();
	if($parentId==null){
		$group=_get('group');
		$query=' AND M.group_id is null ';
		if($group!=null && $group!=''){
			$query=" AND M.group_id='".$group."' ";
		}
		$menus=$me->query->result("SELECT M.menu_code,M.menu_id,menu_name,menu_type,parent_id FROM app_menu M
			INNER JOIN app_tenant_menu M1 ON M1.menu_id=M.menu_id WHERE M1.tenant_id=".$tenant_id." AND M.parent_id is null AND M.active_flag=1 ".$query." ORDER BY M.line");
	}else{
		$menus=$me->query->result("SELECT M.menu_code,M.menu_id,menu_name,menu_type,parent_id FROM app_menu M
			INNER JOIN app_tenant_menu M1 ON M1.menu_id=M.menu_id WHERE M1.tenant_id=".$tenant_id." AND M.parent_id=".$parentId." AND M.active_flag=1 ORDER BY M.line");
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
			$a['checked']=false;
			$a['iconCls']='fa fa-folder-open';
			for($j=0; $j<count($roles);$j++){
				if($roles[$j]->menu_id==$menu->menu_id){
					$a['checked']=true;
					array_splice($roles,$j,1);
					$j--;
				}
			}
			if($menu->menu_type=='MENUTYPE_FOLDER')
				$a['children']=getChild($roles,$menu->menu_id,$tenant_id,$me);
			else{
				$a['type']='MENU';
				$a['iconCls']='fa fa-desktop';
				$a['children']=array();//getAccess($menu->menu_id,$access,$tenant_id);
			}
			$res[]=$a;
		}
	}
	return $res;
}
function getListAccess(){
	$me=_this();
	$id=_get('role_id');
	$tenant_id=_get('tenant_id');
	$menu_id=_get('menu_id');
	if($menu_id != null && $menu_id !=''){
		$access=$me->query->result("SELECT menu_access_id FROM app_role_menu_access WHERE role_id=".$id);
		$res=array();
		$menus=$me->query->result("SELECT access_name,M.menu_access_id FROM app_menu_access M
			INNER JOIN app_tenant_menu_access M1 ON M.menu_access_id=M1.menu_access_id 
			WHERE M.menu_id=".$menu_id." AND M.active_flag=1 AND M1.tenant_id=".$tenant_id);
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
	for($i=0,$iLen=count($menuId);$i<$iLen;$i++){
		if($menuIdC[$i]===true){
			$idRoleMenu=_getTableSequence('app_role_menu');
			$me->query->set("INSERT INTO app_role_menu(role_menu_id,menu_id,role_id)VALUES(".$idRoleMenu.",".$menuId[$i].",".$id.")");
		}else{
			$me->query->set("DELETE FROM app_role_menu WHERE role_id=".$id." AND menu_id=".$menuId[$i]);
		}
	}
	for($i=0,$iLen=count($menuId2);$i<$iLen;$i++){
		if($menuIdC2[$i]===true){
			$idRoleMenu=_getTableSequence('app_role_menu_access');
			$me->query->set("INSERT INTO app_role_menu_access(role_menu_access_id,menu_access_id,role_id)VALUES(".$idRoleMenu.",".$menuId2[$i].",".$id.")");
		}else{
			$me->query->set("DELETE FROM app_role_menu_access WHERE role_id=".$id." AND menu_access_id=".$menuId2[$i]);
		}
	}
	$me->query->end();
}

function initUpdate(){
	$pid=_get('i');
	$o=_this()->query->row("SELECT role_code AS f1,role_name AS f2,description AS f3,active_flag AS f4,tenant_id AS f5 FROM app_role WHERE role_id=".$pid);
	if($o)
		_data($o);
	else
		_not_found();
}