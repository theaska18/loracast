<?php
function initUpdate(){
	$pid=_get('i');
	$user=_this()->query->row("SELECT m.user_code AS f1,m.role_id AS f4,m.tenant_id as f6,r.role_name as f7 FROM app_user m 
		INNER JOIN app_role r ON r.role_id=m.role_id
		WHERE m.user_id=".$pid);
	if($user != null){
		$data=array();
		$sql=" tenant_id="._session()->tenant_id;
		if($pid==1)
			$sql=" tenant_id IS NULL";
		$data['o']=$user;
		_data($data);
	}else
		_not_found();
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$srchUserCode=_get('f1',false);
	$idNumber=_get('f2',false);
	$srchName=_get('f3',false);
	$role=_get('f4',false);
	$startDate=_get('f5',false);
	$endDate=_get('f6',false);
	$tenant=_get('f7',false);
	
	$entity=' app_user ';
	$criteria=" WHERE ";
	if($tenant!=null && $tenant != ''){
		$criteria.=" M.tenant_id=".$tenant;
	}else{
		$criteria.=" M.tenant_id="._session()->tenant_id;
	}
	$innerJoin='
			INNER JOIN app_employee A ON M.employee_id=A.employee_id
			INNER JOIN app_role B ON M.role_id=B.role_id';
	if($srchUserCode != null && $srchUserCode !='')
		$criteria.=" AND UPPER(user_code) LIKE UPPER('%".$srchUserCode."%')";
	if($srchName != null && $srchName !='')
		$criteria.=" AND (UPPER(A.first_name) LIKE UPPER('%".$srchName."%') OR UPPER(A.second_name) LIKE UPPER('%".$srchName."%') OR 
					UPPER(A.last_name) LIKE UPPER('%".$srchName."%'))";
	if($idNumber != null && $idNumber !='')
		$criteria.=" AND UPPER(A.id_number) LIKE UPPER('%".$idNumber."%')";
	if($startDate != null)
		$criteria.=" AND A.birth_date>='".$startDate->format('Y-m-d')."' ";
	if($endDate != null)
		$criteria.=" AND A.birth_date<='".$endDate->format('Y-m-d')."' ";
	if($role != null && $role !='')
		$criteria.=" AND UPPER(B.role_name) LIKE UPPER('%".$role."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2":
			$orderBy.='A.id_number '.$direction;
			break;
		case "f3":
			$orderBy.='A.first_name '.$direction;
			break;
		case "f4":
			$orderBy.='B.role_name '.$direction;
			break;
		case "f5":
			$orderBy.='A.birth_date '.$direction;
			break;
		default:
			$orderBy.='user_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(user_id) AS total FROM ".$entity." M  ".$innerJoin." ".$criteria);
	$res=_this()->query->result("SELECT user_id AS i,user_code AS f1,A.id_number AS f2,B.role_name AS f4,
		CONCAT(A.first_name,' ',A.last_name) AS f3,
		DATE_FORMAT(A.birth_date,'%d %b %Y') AS f5, M.role_id AS f6,M.tenant_id AS f7
		FROM ".$entity." M ".$innerJoin." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function getEmployeeList(){
	$text=_get('query',false);
	$tenant=_get('tenant_id',false);
	if($tenant==null || $tenant==''){
		$tenant=_session()->tenant_id;
	}
	$arr=array();
	$res=_this()->query->result("SELECT 
		employee_id AS id,CONCAT(id_number,' - ',first_name,' ',last_name) AS text FROM app_employee
		WHERE (UPPER(first_name) LIKE UPPER('%".$text."%') OR UPPER(last_name) LIKE UPPER('%".$text."%') OR UPPER(id_number) 
		LIKE UPPER('%".$text."%')) AND active_flag=true AND employee_id NOT IN(SELECT i.employee_id FROM app_user i) AND 
		tenant_id=".$tenant." ORDER BY id_number ASC LIMIT 10");
	_data($res);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$userCode=_post('f1');
	$password=_post('f2');
	$role=_post('f4');
	$employee=_post('f5');
	$tenant=_post('f6');
	$query=_this()->query;
	if($pageType=='ADD'){
		$res=$query->row("SELECT COUNT(user_id) AS total FROM app_user WHERE user_code='".$userCode."' AND tenant_id=".$tenant);
		if ($res->total==0) {
			$id=_getTableSequence('app_user');
			$query->set("INSERT INTO app_user(user_id,user_code,password,last_login_on,login_flag,employee_id,role_id,tenant_id)VALUES(
					".$id.",'".$userCode."','".hash('md5',$password)."',null,false,".$employee.",".$role.",".$tenant.")");
			_message_save(' Kode Pengguna ', $userCode);
		}else
			_message_exist(' Kode Pengguna ', $userCode);
	}else if($pageType=='UPDATE'){
		$res=$query->row("SELECT COUNT(user_id) AS total FROM app_user  WHERE user_code='".$userCode."' AND user_id !=".$pid);
		if ($res->total==0) {
			$user=$query->row("SELECT COUNT(user_id) AS total FROM app_user  WHERE user_id =".$pid);
			if ($user->total != 0){
				$query->set("UPDATE app_user SET user_code='".$userCode."',role_id=".$role.", tenant_id=".$tenant." WHERE user_id=".$pid);
				_message_update(' Kode Pengguna ', $userCode );
			}else
				_not_found();
		}else
			_message_exist(' Kode Pengguna ', $userCode);
	}else if($pageType=='CHANGE'){
		$user=$query->row("SELECT COUNT(user_id) AS total FROM app_user  WHERE user_id =".$pid);
		if ($user->total != 0){
			$query->set("UPDATE app_user SET password='".hash('md5',$password)."' WHERE user_id=".$pid);
			_message_update(' Kode Pengguna ', $userCode );
		}else
			_not_found();
	}
}
function delete(){
	$query=_this()->query;
	$pid= _post('i');
	$res=$query->row("SELECT login_flag,user_code FROM app_user WHERE user_id=".$pid);
	if ($res != null) {
		$code=$res->user_code;
		if($res->login_flag==false){
			$query->set("DELETE FROM app_user WHERE user_id=".$pid);
			_message_delete('Kode Pengguna', $code);
		}else
			_error_message("Kode Pengguna '".$code."' sedang Login, tidak dapat dihapus.");
	}else
		_not_found();
}
function getForMenu(){
	$query=_this()->query;
	$id=_get('i');
	$role_id=_get('r');
	$tenant_id=_get('t');
	$roles=$query->result("SELECT A.menu_id FROM app_user_menu M 
		INNER JOIN app_menu A ON M.menu_id=A.menu_id 
	WHERE user_id=".$id);
	$access=$query->result("SELECT menu_access_id FROM app_user_menu_access WHERE user_id=".$id);
	$res=getChild($roles,null,$access,$tenant_id,$role_id,$query);
	_data($res);
}
function getChild($roles,$parentId=null,$access,$tenant_id,$role_id,$que){
	$res=array();
	if($parentId==null){
		$group=_get('group');
		$query=' AND M.group_id is null ';
		if($group!=null && $group!=''){
			$query=" AND M.group_id=".$group." ";
		}
		$menus=$que->result("SELECT M.menu_code,M.menu_id,menu_name,menu_type,parent_id FROM app_menu M
			INNER JOIN app_tenant_menu M1 ON M1.menu_id=M.menu_id 
			INNER JOIN app_role_menu M2 ON M2.menu_id=M.menu_id 
			WHERE M1.tenant_id=".$tenant_id." AND M2.role_id=".$role_id." AND M.parent_id is null AND M.active_flag=1 ".$query." ORDER BY M.line");
	}else{
		$menus=$que->result("SELECT M.menu_code,M.menu_id,menu_name,menu_type,parent_id FROM app_menu M
			INNER JOIN app_tenant_menu M1 ON M1.menu_id=M.menu_id 
			INNER JOIN app_role_menu M2 ON M2.menu_id=M.menu_id 
			WHERE M1.tenant_id=".$tenant_id." AND M2.role_id=".$role_id." AND M.parent_id=".$parentId." AND M.active_flag=1 ORDER BY M.line");
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
			$a['checked']=true;
			$a['iconCls']='fa fa-folder-open';
			for($j=0; $j<count($roles);$j++){
				if($roles[$j]->menu_id==$menu->menu_id){
					$a['checked']=false;
					array_splice($roles,$j,1);
					$j--;
				}
			}
			if($menu->menu_type=='MENUTYPE_FOLDER'){
				$a['children']=getChild($roles,$menu->menu_id,$access,$tenant_id,$role_id,$que);
				// $a['cls']='i-menu-header';
			}else{
				$a['type']='MENU';
				// $a['cls']='i-menu-app';
				$a['iconCls']='fa fa-desktop';
				$a['children']=array();//getAccess($menu->menu_id,$access,$tenant_id,$role_id);
			}
			$res[]=$a;
		}
	}
	return $res;
}
// function getAccess($menu_id,$access,$tenant_id,$role_id){
	// $res=array();
	// $menus=_this()->query->result("SELECT access_name,M.menu_access_id FROM app_menu_access M
		// INNER JOIN app_tenant_menu_access M1 ON M.menu_access_id=M1.menu_access_id 
		// INNER JOIN app_role_menu_access M2 ON M.menu_access_id=M2.menu_access_id 
		// WHERE M.menu_id=".$menu_id." AND M.active_flag=1 AND M1.tenant_id=".$tenant_id." AND M2.role_id=".$role_id);
		// $line=1;
	// for($i=0,$iLen=count($menus); $i<$iLen;$i++){
		// $menu=$menus[$i];
		// $a=array();
		// $a['text']=$menu->access_name;
		// $a['f1']=$menu->menu_access_id;
		// $a['iconCls']='fa fa-key';
		// $a['checked']=true;
		// for($j=0; $j<count($access);$j++){
			// if($access[$j]->menu_access_id==$menu->menu_access_id){
				// $a['checked']=false;
				// array_splice($access,$j,1);
				// $j--;
			// }
		// }
		// if ($line % 2 == 0){
			// $a['cls']='i-menu-list-gen';
		// }else{
			// $a['cls']='i-menu-list-gan';
		// }
		// $line++;
		// $a['leaf']=true;
		// $a['type']='ACCESS';
		// $res[]=$a;
	// }
	// return $res;
// }
function getListAccess(){
	$query=_this()->query;
	$id=_get('user_id');
	$menu_id=_get('menu_id');
	$tenant_id=_get('tenant_id');
	$role_id=_get('role_id');
	$res=array();
	if($menu_id != null && $menu_id !=''){
		$access=$query->result("SELECT menu_access_id FROM app_user_menu_access WHERE user_id=".$id);
		$menus=$query->result("SELECT access_name,M.menu_access_id FROM app_menu_access M
			INNER JOIN app_tenant_menu_access M1 ON M.menu_access_id=M1.menu_access_id 
			INNER JOIN app_role_menu_access M2 ON M.menu_access_id=M2.menu_access_id 
			WHERE M.menu_id=".$menu_id." AND M.active_flag=1 AND M1.tenant_id=".$tenant_id." AND M2.role_id=".$role_id);
			$line=1;
		for($i=0,$iLen=count($menus); $i<$iLen;$i++){
			$menu=$menus[$i];
			$a=array();
			$a['f2']=$menu->access_name;
			$a['i']=$menu->menu_access_id;
			$a['f1']=true;
			for($j=0; $j<count($access);$j++){
				if($access[$j]->menu_access_id==$menu->menu_access_id){
					$a['f1']=false;
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
	$query=_this()->query;
	$id=_post('i');
	$menuId=json_decode(_post('f1'));
	$menuId2=json_decode(_post('f2'));
	$menuIdC=json_decode(_post('f3'));
	$menuIdC2=json_decode(_post('f4'));
	for($i=0,$iLen=count($menuId);$i<$iLen;$i++){
		if($menuIdC[$i]===false){
			$idRoleMenu=_getTableSequence('app_user_menu');
			$query->set("INSERT INTO app_user_menu(user_menu_id,menu_id,user_id)VALUES(".$idRoleMenu.",".$menuId[$i].",".$id.")");
		}else{
			$query->set("DELETE FROM app_user_menu WHERE user_id=".$id." AND menu_id=".$menuId[$i]);
		}
	}
	for($i=0,$iLen=count($menuId2);$i<$iLen;$i++){
		if($menuIdC2[$i]===false){
			$idRoleMenu=_getTableSequence('app_user_menu_access');
			$query->set("INSERT INTO app_user_menu_access(user_menu_access_id,menu_access_id,user_id)VALUES(".$idRoleMenu.",".$menuId2[$i].",".$id.")");
		}else{
			$query->set("DELETE FROM app_user_menu_access WHERE user_id=".$id." AND menu_access_id=".$menuId2[$i]);
		}
	}
	_this()->query->end();
}