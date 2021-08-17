<?php
function getAccess(){
	$me=_this();
	$m=_get('i');
	_load('minifier');
	$menu=$me->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$m."'");
	$folder=$me->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
		CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
		,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl ASC SEPARATOR '/')) AS val
		FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
			FROM(SELECT @r := ".$menu->menu_id.", @l := NULL) vars,app_menu h
			WHERE @r IS NOT NULL) T1
		JOIN app_menu T2 ON T1._id = T2.menu_id
		LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
		ORDER BY T1.lvl DESC");
	$url="source/build".$folder->val;
	$mainJS=".js";
	$initJS="_init.js";
	$loadJS="_load.js";
	$runJS="_run.js";
	if(!file_exists($url.".js")){
		$mainJS="main.js";
		$initJS="init.js";
		$loadJS="load.js";
		$runJS="run.js";
		$url.='/';
	}
	if(file_exists($url.$mainJS)){
		$init='';
		$load='';
		$run='';
		$stream_opts = ["ssl" => ["verify_peer"=>false,"verify_peer_name"=>false]]; 
		$script=file_get_contents(base_url().$url.$mainJS,false,stream_context_create($stream_opts));
		if(file_exists($url.$initJS)){$init=file_get_contents(base_url().$url.$initJS,false,stream_context_create($stream_opts));}
		if(file_exists($url.$loadJS)){$load=file_get_contents(base_url().$url.$loadJS,false,stream_context_create($stream_opts));}
		if(file_exists($url.$runJS)){$run=file_get_contents(base_url().$url.$runJS,false,stream_context_create($stream_opts));}
		if(base64_decode($script,true)==true){$script=base64_decode($script);}
		$minifier=$me->minifier;
		$script = $minifier->minify($script);
		$init = $minifier->minify($init);
		$load = $minifier->minify($load);
		$run = $minifier->minify($run);
		echo '
			<link href="'.base_url().'vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<script type="text/javascript" src="'.base_url().'vendor/jquery-2.1.4.min.js"></script>
			<script src="'.base_url().'vendor/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
		';
		preg_match_all("/_access\('(.*?)'/",$script.$init.$load.$run,$access);
		$line=0;
		echo '&nbsp;<b>Kode:</b><br>';
		if(count($access)>0){
			for($i=0,$iLen=count($access[1]); $i<$iLen;$i++){
				$line++;
				echo '&nbsp;'.$line.' . '.$access[1][$i].'<br>';
			}
		}
		preg_match_all("/id:'(.*?)'/",$script.$init.$load.$run,$access);
		$line=0;
		echo '&nbsp;<b>ID Component :</b><br>';
		if(count($access)>0){
			for($i=0,$iLen=count($access[1]); $i<$iLen;$i++){
				$line++;
				echo '&nbsp;'.$line.' . '.$access[1][$i].'<br>';
			}
		}
		preg_match_all("/url\+'(.*?)'/",$script.$init.$load.$run,$access);
		$line=0;
		echo '&nbsp;<b>URL :</b><br>';
		if(count($access)>0){
			for($i=0,$iLen=count($access[1]); $i<$iLen;$i++){
				$line++;
				echo '&nbsp;'.$line.' . '.$access[1][$i].'<br>';
			}
		}
		return false;
	}else{$result->error()->setMessage('File '.strtolower($m).'.js'.' Not Found.')->end();}
}
function getList() {
	$me=_this();
	$res=getChild(null,$me);
	_data($res);
}
function getChild($parent=null,$me) {
	$res=array();
	if($parent==null){
		$group=_get('group');
		$query=' AND group_id is null ';
		if($group!=null && $group!=''){
			$query=" AND group_id='".$group."' ";
		}
		$menus=$me->query->result("SELECT menu_name,menu_code,menu_type,menu_id,parent_id,icon FROM app_menu  WHERE parent_id is null ".$query." ORDER BY line");
	}else{
		$menus=$me->query->result("SELECT menu_name,menu_code,menu_type,menu_id,parent_id,icon FROM app_menu  WHERE parent_id=".$parent." ORDER BY line");
	}
	for($i=0;$i<count($menus);$i++){
		if($menus[$i]->parent_id==$parent){
			$menu=$menus[$i];
			array_splice($menus,$i,1);
			$i--;
			$a=array();
			$a['text']=$menu->menu_name.' ('.$menu->menu_code.')';
			$a['f1']=$menu->menu_code;
			if($menu->icon != null && $menu->icon != '')
				$a['iconCls']=$menu->icon;
			if($menu->menu_type=='MENUTYPE_FOLDER'){
				$a['children']=getChild($menu->menu_id,$me);
				if(count($a['children'])>0){
					$deleted=true;
					$a['expanded']=false;
				}
			}else{
				$a['leaf']=true;
			}
			$res[]=$a;
		}
	}
	return $res;
}
function initUpdate(){
	$me=_this();
	$pid=_get('i');
	$menu=$me->query->row("SELECT menu_id,menu_name,menu_type,active_flag,icon,description,line,parent_id,group_id,master_flag FROM app_menu WHERE menu_code='".$pid."'");
	if($menu){
		$child=0;
		if($menu->menu_type=='MENUTYPE_FOLDER'){
			$count=$me->query->row("SELECT count(M.menu_id) AS total FROM app_menu M INNER JOIN app_menu A ON M.parent_id=A.menu_id WHERE A.menu_code='".$pid."'");
			$child=$count->total;
		}
		$arr=array();
		$arr['f1']=$pid;
		$arr['f2']=$menu->menu_name;
		$arr['f3']=$menu->menu_type;
		$arr['f4']=$menu->icon;
		$arr['f5']=$menu->description;
		$arr['f6']=$menu->active_flag;
		$arr['f7']=$menu->line;
		$arr['f8']=$menu->master_flag;
		$arr['f9']=$menu->parent_id;
		$arr['f10']=$menu->group_id;
		$arr['c']=$child;
		$list=array();
		if($menu->menu_type=='MENUTYPE_MENU'){
			$resDetail=$me->query->result("SELECT M.menu_access_id,M.access_code AS component_id,M.access_name  AS component_name,M.active_flag as active,M.acces_type as access_type
				FROM app_menu_access M INNER JOIN app_menu M1 ON M1.menu_id=M.menu_id WHERE M1.menu_code='".$pid."'");
			$m=$pid;
			_load('minifier');
			$folder=$me->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
				CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
				,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl DESC SEPARATOR '/')) AS val
				FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
					FROM(SELECT @r := ".$menu->menu_id.", @l := 0) vars,app_menu h
					WHERE @r IS NOT NULL) T1
				JOIN app_menu T2 ON T1._id = T2.menu_id
				LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
				ORDER BY T1.lvl DESC");
			$url="source/build".$folder->val;
			$mainJS=".js";
			$initJS="_init.js";
			$loadJS="_load.js";
			$runJS="_run.js";
			if(!file_exists($url.".js")){
				$mainJS="main.js";
				$initJS="init.js";
				$loadJS="load.js";
				$runJS="run.js";
				$url.='/';
			}
			if(file_exists($url.$mainJS)){
				$init='';
				$load='';
				$run='';
				$stream_opts = ["ssl" => ["verify_peer"=>false,"verify_peer_name"=>false]]; 
				$script=file_get_contents(base_url().$url.$mainJS,false,stream_context_create($stream_opts));
				if(file_exists($url.$initJS)){$init=file_get_contents(base_url().$url.$initJS,false,stream_context_create($stream_opts));}
				if(file_exists($url.$loadJS)){$load=file_get_contents(base_url().$url.$loadJS,false,stream_context_create($stream_opts));}
				if(file_exists($url.$runJS)){$run=file_get_contents(base_url().$url.$runJS,false,stream_context_create($stream_opts));}
				if(base64_decode($script,true)==true){$script=base64_decode($script);}
				$minifier=$me->minifier;
				// $script = $minifier->minify($script);
				// $init = $minifier->minify($init);
				// $load = $minifier->minify($load);
				// $run = $minifier->minify($run);
				$list=array();
				preg_match_all("/_access\('(.*?)'/",$script.$init.$load.$run,$access);
				if(count($access)>0){
					$access[1]=array_unique($access[1]);
					foreach($access[1] as $val){
						$obj=array();
						$obj['menu_access_id']='';
						$obj['component_id']=$val;
						$obj['component_name']='';
						$obj['active']=0;
						$obj['access_type']='ACCESSTYPE_CODE';
						$obj['take']=0;
						$list[]=$obj;
					}
				}
				preg_match_all("/id:'(.*?)'/",$script.$init.$load.$run,$access);
				if(count($access)>0){
					$access[1]=array_unique($access[1]);
					foreach($access[1] as $val){
						$obj=array();
						$obj['menu_access_id']='';
						$obj['component_id']=$val;
						$obj['component_name']='';
						$obj['active']=0;
						$obj['access_type']='ACCESSTYPE_ID';
						$obj['take']=0;
						$list[]=$obj;
					}
				}
				preg_match_all("/url\s\+\s'(.*?)'/",$script.$init.$load.$run,$access);
				if(count($access)>0){
					$access[1]=array_unique($access[1]);
					foreach($access[1] as $val){
						$obj=array();
						$obj['menu_access_id']='';
						$obj['component_id']=$val;
						$obj['component_name']='';
						$obj['active']=0;
						$obj['access_type']='ACCESSTYPE_URL';
						$obj['take']=0;
						$list[]=$obj;
					}
				}
				
				preg_match_all("/access\s(.*?)\n/",$script.$init.$load.$run,$access);
				if(count($access)>0){
					$access[1]=array_unique($access[1]);
					for($i=0,$iLen=count($list); $i<$iLen;$i++){
						foreach($access[1] as $val){
							$a=explode(" ",trim($val));
							$codenya=$a[0];
							$namenya=trim(substr(trim($val),strlen($a[0])));
							if($codenya==$list[$i]['component_id']){
								$list[$i]['component_name']=$namenya;
							}
						}
					}
				}
				
				
				for($i=0,$iLen=count($list); $i<$iLen;$i++){
					$iObj=$list[$i];
					for($j=0,$jLen=count($resDetail); $j<$jLen;$j++){
						if(isset($resDetail[$j])){
							$jObj=$resDetail[$j];
							if($iObj['component_id']==$jObj->component_id){
								$list[$i]['menu_access_id']=$jObj->menu_access_id;
								$list[$i]['component_name']=$jObj->component_name;
								$list[$i]['active']=$jObj->active;
								$list[$i]['take']=1;
								break;
							}
						}
					}
				}
			}else{
				_message('File '.strtolower($m).'.js'.' Not Found.')->error()->end();
			}	
		}
		_data(array('o'=>$arr,'l2'=>$list));
	}else
		_not_found();
}
function initSetting(){
	$me=_this();
	$pid=_get('i');
	$menu=$me->query->row("SELECT menu_id,menu_name FROM app_menu WHERE menu_code='".$pid."'");
	if($menu){
		$res=$me->query->result("SELECT setting_id,setting_name,setting_code,setting_value,setting_desc,setting_type,setting_object,setting_group,setting_index FROM app_menu_setting WHERE menu_id=".$menu->menu_id);
		_data(array('o'=>$menu,'l'=>$res));
	}else
		_not_found();
}
function saveSetting() {
	$me=_this();
	$me->query->start();
	$pid=_post('i');
	$setting_id=_post('setting_id');
	$setting_code=_post('setting_code');
	$setting_name=_post('setting_name');
	$setting_desc=_post('setting_desc');
	$setting_value=_post('setting_value');
	$setting_type=_post('setting_type');
	$setting_object=_post('setting_object');
	$setting_group=_post('setting_group');
	$setting_index=_post('setting_index');
	$settings=$me->query->result("SELECT setting_id FROM app_menu_setting WHERE menu_id=".$pid);
	$idSet=array();
	for($i=0,$iLen=count($settings); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($setting_code); $j<$jLen;$j++){
			if($setting_id[$j] !==''){
				if($settings[$i]->setting_id==$setting_id[$j]){
					$arr=array();
					$arr['setting_name']=$setting_name[$j];
					$arr['setting_value']=$setting_value[$j];
					$arr['setting_object']=$setting_object[$j];
					$arr['setting_group']=$setting_group[$j];
					$arr['setting_index']=$setting_index[$j];
					$arr['setting_type']=$setting_type[$j];
					$arr['setting_desc']=$setting_desc[$j];
					$me->db->where('setting_id',$setting_id[$j]);
					$me->db->update('app_menu_setting',$arr);
					$ada=true;
				}
			}
		}
		if($ada==false){
			$me->query->set("DELETE FROM app_menu_setting WHERE setting_id=".$settings[$i]->setting_id);
		}
	}
	for($j=0,$jLen=count($setting_code); $j<$jLen;$j++){
		if($setting_id[$j] ==''){
			$id=_getTableSequence('app_menu_setting');
			$idSet[]=$id;
			$arr=array();
			$arr['setting_id']=$id;
			$arr['menu_id']=$pid;
			$arr['setting_code']=$setting_code[$j];
			$arr['setting_name']=$setting_name[$j];
			$arr['setting_object']=$setting_object[$j];
			$arr['setting_type']=$setting_type[$j];
			$arr['setting_group']=$setting_group[$j];
			$arr['setting_value']=$setting_value[$j];
			$arr['setting_desc']=$setting_desc[$j];
			$me->db->insert('app_menu_setting',$arr);
		}
	}
	_data($idSet);
	$me->query->end();
	_message('Setting Berhasil disimpan.');
}
function save() {
	$me=_this();
	$me->query->start();
	$pageType=_post('p');
	$menuCode=_post('f1');
	$menuName=_post('f2');
	$menuType=_post('f3');
	$icon=_post('f4');
	$desc=_post('f5');
	$activeFlag=_post('f6');
	$line=_post('f7');
	$master=_post('f8');
	$group=_post('f9');
	$parentCode=_post('pc');
	if($group==null || $group==''){
		$group='null';
	}else{
		$group="'".$group."'";
	}
	$menu_access_id=_post('menu_access_id',false);
	$access_type=_post('access_type',false);
	$component_id=_post('component_id',false);
	$component_name=_post('component_name',false);
	$active=_post('active',false);
	$take=_post('take',false);
	if($pageType=='ADD'){
		$menu=$me->query->row("SELECT menu_id AS total FROM app_menu WHERE menu_code='".$menuCode."'");
		if(!$menu) {
			$parent='null';
			if($parentCode != null){
				$pO=$me->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$parentCode."'");
				if($pO){
					$parent=$pO->menu_id;
				}
			} 
			$id=_getTableSequence('app_menu');
			$me->query->set("INSERT INTO app_menu(menu_id,menu_code,menu_name,menu_type,parent_id,active_flag,script_on,icon,description,line,group_id,master_flag)VALUES
					(".$id.",'".$menuCode."','".$menuName."','".$menuType."',".$parent.",".$activeFlag.",'"._format()."','".$icon."','".$desc."',".$line.",".$group.",".$master.")");
			$me->load->helper('file');
			if($menuType=='MENUTYPE_MENU'){
				$folder=$me->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
				CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
				,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl ASC SEPARATOR '/')) AS val
				FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
					FROM(SELECT @r := ".$id.", @l := NULL) vars,app_menu h
					WHERE @r IS NOT NULL) T1
				JOIN app_menu T2 ON T1._id = T2.menu_id
				LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
				ORDER BY T1.lvl DESC");
				$url="source/build".$folder->val;
				// if (!file_exists("source/build".$folder)) {
					// mkdir("source/build".$folder, 0777, true);
				// }
				write_file($url."/main.js", base64_encode(''));
				write_file($url."/main.php", base64_encode(''));
			}
			$me->query->end();
			_message_save('Menu Code',$menuCode);;
		}else{
			$me->query->back();
			_message_exist('Menu Code',$menuCode);
		}
	}else if($pageType=='UPDATE'){
		$me->query->set("UPDATE app_menu SET line=".$line.",menu_name='".$menuName."',menu_type='".$menuType."'
				,active_flag=".$activeFlag.",icon='".$icon."',master_flag=".$master.",description='".$desc."', group_id=".$group." WHERE menu_code='".$menuCode."'");
		$res=$me->query->result("SELECT menu_access_id FROM app_menu_access M INNER JOIN app_menu M1 ON M1.menu_id=M.menu_id WHERE menu_code='".$menuCode."'");
		if($menuType=='MENUTYPE_MENU'){
			for($i=0,$iLen=count($res); $i<$iLen;$i++){
				$ada=false;
				for($j=0,$jLen=count($menu_access_id); $j<$jLen;$j++){
					if($menu_access_id[$j] !=''){
						if($menu_access_id[$j] !=''){
							if($menu_access_id[$j]==$res[$i]->menu_access_id){
								if($take[$j]=='true'){
									$ada=true;
								}
							}
						}
					}
				}
				if($ada==false){
					$me->db->where('menu_access_id',$res[$i]->menu_access_id);
					$me->db->delete('app_menu_access');
				}
			}
			$menu=$me->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$menuCode."'");
			for($i=0,$iLen=count($menu_access_id); $i<$iLen;$i++){
				if($take[$i]=='true'){
					$data=array();
					$data['acces_type']=$access_type[$i];
					$data['access_name']=$component_name[$i];
					$data['access_code']=$component_id[$i];
					$data['menu_id']=$menu->menu_id;
					if($active[$i]=='true'){
						$data['active_flag']=1;
					}else{
						$data['active_flag']=0;
					}
					if($menu_access_id[$i] !=''){
						$me->db->where('menu_access_id',$menu_access_id[$i]);
						$me->db->update('app_menu_access',$data);
					}else{
						$id_access=_getTableSequence('app_menu_access');
						$data['menu_access_id']=$id_access;
						$me->db->insert('app_menu_access',$data);
					}
				}
			}
		}
		$me->query->end();
		_message_Update('Menu Code',$menuCode);
	}
}
function delete(){
	$me=_this();
	$menuCode=_post('i');
	$menu=$me->query->row("SELECT menu_id,parent_id,group_id,menu_type FROM app_menu WHERE menu_code='".$menuCode."'");
	if($menu) {
		$folder=$me->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
			CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
			,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl ASC SEPARATOR '/')) AS val
			FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
				FROM(SELECT @r := ".$menu->menu_id.", @l := NULL) vars,app_menu h
				WHERE @r IS NOT NULL) T1
			JOIN app_menu T2 ON T1._id = T2.menu_id
			LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
			ORDER BY T1.lvl DESC");
		$url="source/build".$folder->val;
		$me->query->set("DELETE FROM app_menu WHERE menu_code='".$menuCode."'");
		if($menu->menu_type=='MENUTYPE_MENU'){
			if(file_exists($url.".js")){unlink($url.".js");}
			if(file_exists($url."_init.js")){unlink($url."_init.js");}
			if(file_exists($url."_load.js")){unlink($url."_load.js");}
			if(file_exists($url."_run.js")){unlink($url."_run.js");}
			if(file_exists($url.".php")){unlink($url.".php");}	
		}
		_message_delete('Menu Code',$menuCode);
	}else
		_not_found();
}