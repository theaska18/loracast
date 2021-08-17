<?php
function getList() {
	$res=getChild();
	_data($res);
}
function getChild($parent=null) {
	$res=array();
	if($parent==null){
		$menus=_this()->query->result("SELECT ORG.structure_id,ORG.structure_code,ORG.structure_name,
			CONCAT(CASE WHEN EMP.first_name IS NULL THEN '' ELSE EMP.first_name END,' ',CASE WHEN EMP.last_name IS null THEN '' ELSE EMP.last_name END) AS name
			FROM org_structure ORG 
			LEFT JOIN app_employee EMP ON EMP.employee_id=ORG.employee_id 
			WHERE ORG.parent_id is null");
	}else{
		$menus=_this()->query->result("SELECT ORG.structure_id,ORG.structure_code,ORG.structure_name,
			CONCAT(CASE WHEN EMP.first_name IS NULL THEN '' ELSE EMP.first_name END,' ',CASE WHEN EMP.last_name IS null THEN '' ELSE EMP.last_name END) AS name
			FROM org_structure ORG 
			LEFT JOIN app_employee EMP ON EMP.employee_id=ORG.employee_id 
			WHERE ORG.parent_id=".$parent."");
	}
	for($i=0;$i<count($menus);$i++){
		$menu=$menus[$i];
		array_splice($menus,$i,1);
		$i--;
		$a=array();
		$a['text']=$menu->structure_name.' ('.$menu->structure_code.')'.iif($menu->name !==null && trim($menu->name) !=='',' -> Head : '.$menu->name,'');
		$a['f1']=$menu->structure_code;
		$a['i']=$menu->structure_id;
		$a['iconCls']='fa fa-folder-open';
		$a['children']=getChild($menu->structure_id);
		if(count($a['children'])>0){
			$deleted=true;
			$a['expanded']=false;
		}
		$res[]=$a;
	}
	return $res;
}
function getHierarchy() {
	$res=getChildHierarchy();
	$dat=_this()->query->row("SELECT description FROM org_structure WHERE structure_id="._get('i'));
	_data(array('l'=>$res,'o'=>$dat->description));
}
function getChildHierarchy($parent=null) {
	$res=array();
	if($parent==null){
		$pid=_get('i');
		$menus=_this()->query->result("SELECT ORG.structure_id,ORG.structure_code,ORG.structure_name,
			CONCAT(CASE WHEN EMP.first_name IS NULL THEN '' ELSE EMP.first_name END,' ',CASE WHEN EMP.last_name IS null THEN '' ELSE EMP.last_name END) AS name
			FROM org_structure ORG 
			LEFT JOIN app_employee EMP ON EMP.employee_id=ORG.employee_id 
			WHERE ORG.structure_id=".$pid);
	}else{
		$menus=_this()->query->result("SELECT ORG.structure_id,ORG.structure_code,ORG.structure_name,
			CONCAT(CASE WHEN EMP.first_name IS NULL THEN '' ELSE EMP.first_name END,' ',CASE WHEN EMP.last_name IS null THEN '' ELSE EMP.last_name END) AS name
			FROM org_structure ORG 
			LEFT JOIN app_employee EMP ON EMP.employee_id=ORG.employee_id 
			WHERE ORG.parent_id=".$parent."");
	}
	for($i=0;$i<count($menus);$i++){
		$menu=$menus[$i];
		array_splice($menus,$i,1);
		$i--;
		$a=array();
		$a['text']=$menu->structure_name;
		$a['f1']=iif($menu->name !==null && trim($menu->name) !=='',$menu->name,'');
		$a['child']=getChildHierarchy($menu->structure_id);
		$members=_this()->query->result("
			SELECT JOB.job_name,CONCAT(CASE WHEN EMP.first_name IS NULL THEN '' ELSE EMP.first_name END,' ',CASE WHEN EMP.last_name IS null THEN '' ELSE EMP.last_name END) AS name
			FROM app_employee EMP
			INNER JOIN app_employee_structure S ON S.employee_id=EMP.employee_id
			LEFT JOIN app_job JOB ON JOB.job_id=S.job_id
			WHERE S.structure_id=".$menu->structure_id." ORDER BY JOB.job_name");
		$a['members']=$members;
		$res[]=$a;
	}
	return $res;
}
function initUpdate(){
	$pid=_get('i');
	$structure=_this()->query->row("SELECT structure_code,structure_name,description,active_flag FROM org_structure WHERE structure_id=".$pid);
	if($structure){
		$arr=array();
		$arr['f1']=$structure->structure_code;
		$arr['f2']=$structure->structure_name;
		$arr['f3']=$structure->description;
		$arr['f4']=$structure->active_flag;
		$list=array();
		
		_data($arr);
	}else
		_not_found();
}
function initHead(){
	$pid=_get('i');
	$structure=_this()->query->row("SELECT ORG.structure_code,ORG.structure_name,ORG.description,ORG.active_flag,EMP.employee_id,
		CONCAT(CASE WHEN EMP.first_name IS NULL THEN '' ELSE EMP.first_name END,' ',CASE WHEN EMP.last_name IS null THEN '' ELSE EMP.last_name END) AS name FROM org_structure ORG
		LEFT JOIN app_employee EMP ON EMP.employee_id=ORG.employee_id WHERE ORG.structure_id=".$pid);
	if($structure){
		$arr=array();
		$arr['f1']=$structure->structure_code;
		$arr['f2']=$structure->structure_name;
		$arr['f3']=$structure->description;
		$arr['f4']=$structure->active_flag;
		$arr['f5']=$structure->employee_id;
		$arr['f6']=$structure->name;
		$list=array();
		
		_data($arr);
	}else
		_not_found();
}
function save() {
	_this()->query->start();
	$pageType=_post('p');
	$stuctureId=_post('i');
	$stuctureCode=_post('f1');
	$stuctureName=_post('f2');
	$desc=_post('f3');
	$activeFlag=_post('f4');
	$head=_post('f5');
	$parent=_post('pc');
	$tenant=_session()->tenant_id;
	$me=_this();
	if($pageType=='ADD'){
		$allow=true;
		if($stuctureCode==''){
			$a=false;
			$sequenceCode=getSetting('ORG_STRUCTURE','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=$me->query->row("SELECT structure_id FROM org_structure WHERE structure_code='".$codenya."' and tenant_id=".$tenant);
				if(!$res){
					$stuctureCode=$codenya;
					$a=true;
				}
			}
		}else{
			$res=$me->query->row("SELECT structure_id FROM org_structure WHERE structure_code='".$stuctureCode."' and tenant_id=".$tenant);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$id=_getTableSequence('org_structure');
			$arr=array();
			$arr['structure_id']=$id;
			$arr['tenant_id']=$tenant;
			if($parent !== null && $parent !=''){
				$arr['parent_id']=$parent;
			}
			$arr['structure_code']=$stuctureCode;
			$arr['structure_name']=$stuctureName;
			$arr['description']=$desc;
			$arr['active_flag']=$activeFlag;
			$arr['create_on']=_format();
			$arr['create_by']=_session()->employee_id;
			_this()->db->insert('org_structure',$arr);
			_this()->query->end();
			_message_save('Kode Structure',$stuctureCode);;
		}else{
			_this()->query->back();
			_message_exist('Kode Structure',$stuctureCode);
		}
	}else if($pageType=='UPDATE'){
		$arr=array();
		$arr['structure_name']=$stuctureName;
		$arr['description']=$desc;
		$arr['active_flag']=$activeFlag;
		$arr['update_on']=_format();
		$arr['update_by']=_session()->employee_id;
		_this()->db->where('structure_id',$stuctureId);
		_this()->db->update('org_structure',$arr);
		_this()->query->end();
		_message_Update('Kode Structure',$stuctureCode);
	}else if($pageType=='HEAD'){
		$arr=array();
		if($head != null && $head !=''){
			$arr['employee_id']=(double)$head;
		}else{
			$arr['employee_id']=null;
		}
		$arr['update_on']=_format();
		$arr['update_by']=_session()->employee_id;
		_this()->db->where('structure_id',$stuctureId);
		_this()->db->update('org_structure',$arr);
		_this()->query->end();
		_message_Update('Kode Structure',$stuctureCode);
	}
}
function delete(){
	$menuCode=_post('i');
	$menu=_this()->query->row("SELECT structure_code FROM org_structure WHERE structure_id=".$menuCode);
	if($menu) {
		$code=$menu->structure_code;
		_this()->query->set("DELETE FROM org_structure WHERE structure_id=".$menuCode);
		_message_delete('Kode Organisasi',$code);
	}else
		_not_found();
}