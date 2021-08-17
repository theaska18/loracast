<?php
function getList() {
	$menus=_this()->query->result("SELECT category_name,category_code,category_id,parent_id FROM inv_category WHERE tenant_id="._session()->tenant_id);
	$res=getChild($menus);
	_data($res);
}
function getChild($menus,$parent=null) {
	$res=array();
	for($i=0;$i<count($menus);$i++){
		if($menus[$i]->parent_id==$parent){
			$menu=$menus[$i];
			array_splice($menus,$i,1);
			$i--;
			$a=array();
			$a['text']=$menu->category_name.' ('.$menu->category_code.')';
			$a['f1']=$menu->category_code;
			$a['iconCls']='fa fa-genderless';
			$a['children']=getChild($menus,$menu->category_id);
			if(count($a['children'])>0){
				$deleted=true;
				$a['expanded']=false;
				$a['del']=false;
			}else{
				$a['del']=true;
			}
			$res[]=$a;
		}
	}
	return $res;
}
function initUpdate(){
	$pid=_get('i');
	$menu=_this()->query->row("SELECT category_group_id,category_name,active_flag FROM inv_category WHERE category_code='".$pid."' and tenant_id="._session()->tenant_id);
	if($menu){
		$child=0;
		$count=_this()->query->row("SELECT count(M.category_id) AS total FROM inv_category M INNER JOIN inv_category A ON M.parent_id=A.category_id WHERE A.category_code='".$pid."' and M.tenant_id="._session()->tenant_id);
		$child=$count->total;
		$arr=array();
		$arr['f1']=$pid;
		$arr['f2']=$menu->category_name;
		$arr['f4']=$menu->active_flag;
		$arr['f5']=$menu->category_group_id;
		$arr['c']=$child;
		_data(array('o'=>$arr));
	}else
		_not_found();
}
function save() {
	_this()->query->start();
	$pageType=_post('p');
	$menuCode=_post('f1');
	$menuName=_post('f2');
	$active=_post('f4');
	$group=_post('f5');
	$parentCode=_post('pc');
	if($pageType=='ADD'){
		$allow=true;
		if($menuCode==''){
			$a=false;
			$sequenceCode=getSetting('CATEGORY','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT category_id FROM inv_category WHERE category_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$menuCode=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT category_id FROM inv_category WHERE category_code='".$menuCode."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		
		if ($allow){
			$parent='null';
			if($parentCode != null){
				$pO=_this()->query->row("SELECT category_id FROM inv_category WHERE category_code='".$parentCode."' and tenant_id="._session()->tenant_id);
				if($pO){
					$parent=$pO->category_id;
				}
			} 
			$id=_getTableSequence('inv_category');
			_this()->query->set("INSERT INTO inv_category(category_id,category_code,category_name,parent_id,active_flag,create_on,create_by,tenant_id,category_group_id)VALUES
					(".$id.",'".$menuCode."','".$menuName."',".$parent.",".$active.",'"._format()."',"._session()->employee_id.","._session()->tenant_id.",".$group.")");
			_this()->query->end();
			_message_save('Category Code',$menuCode);;
		}else{
			_this()->query->back();
			_message_exist('Category Code',$menuCode);
		}
	}else if($pageType=='UPDATE'){
		_this()->query->set("UPDATE inv_category SET category_group_id=".$group.",category_name='".$menuName."'
				,active_flag=".$active.",update_on='"._format()."',update_by="._session()->employee_id." WHERE category_code='".$menuCode."' and tenant_id="._session()->tenant_id);
		_this()->query->end();
		_message_Update('Category Code',$menuCode);
	}
}
function delete() {;
	$menuCode=_post('i');
	$menu=_this()->query->row("SELECT category_id FROM inv_category WHERE category_code='".$menuCode."' and tenant_id="._session()->tenant_id);
	if($menu) {
		_this()->query->set("DELETE FROM inv_category WHERE category_code='".$menuCode."' and tenant_id="._session()->tenant_id);	
		_message_delete('Category Code',$menuCode);
	}else
		_not_found();
}