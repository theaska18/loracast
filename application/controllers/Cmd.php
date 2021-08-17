<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Cmd extends CI_Controller {
	public $listFunc=array(),$now,$tmp=null,$setting=null,$notification=null,$tableSequence=null,$menuName='',
		$sequence=null;
	public function index(){
		$al=false;
		$menuName='';
		$pagesession=$this->pagesession;
		$result = $this->jsonresult;
		if(!$pagesession->cek()){$result->session()->end();}
		$m="";$f="";$t="";
		function setMenuName($menuName){}
		function _this(){$ci=&get_instance();return $ci;}
		function _format($format="Y-m-d H:i:s"){$ci=&get_instance();if($ci->now==null){$ci->now=new DateTime();}return $ci->now->format($format);}
		function setNotification($title,$msg,$code=null,$employee=null,$tenant=null,$start=null,$end=null){
			$ci=&get_instance(); 
			if($ci->notification==null){$ci->load->library('lib/lib_notification');$ci->notification=$ci->lib_notification;}
			$ci->notification->set($title,$msg,$code,$employee,$tenant,$start,$end,_session(),_tableSequence(),_format());
		}
		function iif($kondisi,$kondisi1,$kondisi2){if($kondisi==true){return $kondisi1;}else{return $kondisi2;}}
		function getSetting($mod,$code,$allow=false,$title=''){
			$ci=&get_instance(); 
			if($ci->setting==null){$ci->setting=$ci->pagesession->getSetting();}
			$session=$ci->setting;
			if(isset($session->setting->$mod)){
				if(isset($session->setting->$mod->$code)){
					if(($session->setting->$mod->$code !=null && $session->setting->$mod->$code !='')|| $allow==true){
						return $session->setting->$mod->$code;
					}else{
						$ci->query->back();
						_message("Menu ".$ci->menuName.", ". iif($title=='',"Code '".$code."'","'".$title."'") ." Belum di Setting.")->error()->end();
					}
				}else{$ci->query->back();_message("Tidak Ada Setting Menu Code '".$mod."' dan Setting Code '".$code."'.")->error()->end();}
			}else{$ci->query->back();_message("Tidak Ada Setting Menu Code'".$mod."'.")->error()->end();}
		}
		function _tableSequence(){
			$ci=&get_instance();
			if($ci->tableSequence==null){$ci->load->library('lib/lib_table_sequence');$ci->tableSequence=$ci->lib_table_sequence;}
			return $ci->tableSequence;
		}
		function _sequence(){
			$ci=&get_instance();
			if($ci->sequence==null){$ci->load->library('lib/lib_sequence');$ci->sequence=$ci->lib_sequence;}
			return $ci->sequence;
		}
		function _getTableSequence($code){return _tableSequence()->get($code);}
		function _getSequence($code){$codenya=_sequence()->get($code,array());$code=$codenya['val'];return $code;}
		function _getSequenceById($code){$codenya=_sequence()->getById($code,array());$code=$codenya['val'];return $code;}
		function _func($mod,$f){
			$ci=&get_instance(); 
			if(isset($ci->listFunc[$mod])){
				$f='__'.$mod.$f;
				if(function_exists($f)){return $f($ci);
				}else{$ci->query->back();_result()->error()->setMessage('Function Not Found.');}
			}else{
				$ci->listFunc[$mod]=true;
				$menu=$ci->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$mod."'");
				$folder=$ci->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
						CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
						,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl DESC SEPARATOR '/')) AS val
						FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
							FROM(SELECT @r := ".$menu->menu_id.", @l := 0) vars,app_menu h
							WHERE @r IS NOT NULL) T1
						JOIN app_menu T2 ON T1._id = T2.menu_id
						LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
						ORDER BY T1.lvl DESC");
				$result=_result();
				if($folder){
					$url="source/build".$folder->val;
					if(file_exists($url.".php") || file_exists($url."/main.php")){
						$urlMain='';
						if(file_exists($url.".php")){
							$urlMain=$url.".php";
						}else if(file_exists($url."/main.php")){
							$urlMain=$url."/main.php";
						}
						$ci->load->helper('url'); 
						$ci->load->helper('file');
						$string = str_replace('function ','function __'.$mod,str_replace('<?php','',read_file('./'.$urlMain)));
						eval($string);
						$f='__'.$mod.$f;
						if(function_exists($f)){return $f($ci);
						}else{$ci->query->back();$result->error()->setMessage('Function Not Found.');}
					}else{$ci->query->back();$result->error()->setMessage("File '".strtolower($mod).".php' Not Found.");}
				}else{
					$ci->query->back();$result->error()->setMessage("Menu '".strtolower($mod)."' Not Found.");
				}
			}
		}
		function _result(){$ci=&get_instance();return $ci->jsonresult;}
		function _session(){$ci=&get_instance();if($ci->tmp==null){$ci->tmp=$ci->pagesession->get();}return $ci->tmp;}
		function _validateDate($date){$d = DateTime::createFromFormat('Y-m-d', $date);return $d && $d->format('Y-m-d') == $date;}
		function _post($param, $allow = true,$alowLine=false) {
			if(isset($_POST[$param])){
				$p=$_POST[$param];
				if(is_array($p)){return $_POST[$param];}
				else if($p=='true'){return true;}
				else if($p=='false'){return 0;}
				else if(_validateDate($p) !== false){return new DateTime($p);}
				else if($p=='null'){return null;}
				if($alowLine===true){return preg_replace('/^\s+|\n|\r|\s+$/m', '', $p);
				}else{return $p;}
			}else
				if($allow==false){return null;}
				else{_this()->query->back();_result()->error()->setMessage("Parameter '".$param."' tidak diTemukan")->end();}
		}
		function _get($param, $allow = true,$alowLine=false) {
			if(isset($_GET[$param])){
				$p=$_GET[$param];
				if(is_array($p)){return $_POST[$param];}
				else if($p=='true'){return true;}
				else if($p=='false'){return 0;}
				else if(_validateDate($p) !== false){return new DateTime($p);}
				else if($p=='null'){return null;}
				if($alowLine===true){return preg_replace('/^\s+|\n|\r|\s+$/m', '', $p);
				}else{return $p;}
			}else
				if($allow==false){return null;}
				else{_this()->query->back();_result()->error()->setMessage("Parameter '".$param."' tidak diTemukan")->end();}
		}
		function _load($lib){$ci=&get_instance();$ci->load->library($lib);}
		function _message($message){_result()->setMessage($message);return _result();}
		function _error_message($message){_result()->error()->setMessage($message);return _result();}
		function _data($data){_result()->setData($data);return _result();}
		function _not_found(){_result()->error()->setMessageNotExist();}
		function _message_delete($val,$code){_result()->setMessageDelete($val,$code)->end ();}
		function _message_update($val,$code){_result()->setMessageEdit($val,$code)->end ();}
		function _message_save($val,$code){_result()->setMessageSave($val,$code)->end ();}
		function _number_format($num){return number_format($num,0,",",".");}
		function _message_exist($val,$code){_result()->warning ()->setMessageExist($val,$code)->end ();}
		if(_get('f',false) != null){$f=_get('f');$m=_get('m');}else{$f=_post('f');$m=_post('m');}
		if(_get('a',false) != null && _get('a',false) == 't'){$al=true;}else if(_post('a',false) != null && _post('a',false) == 't'){$al=true;}
		$session=$pagesession->getAccess();
		unset($pagesession);
		if($al==false){
			for($i=0,$iLen=count($session->access_list); $i<$iLen ; $i++){
				if($session->access_list[$i]->acces_type=='ACCESSTYPE_URL' && $session->access_list[$i]->access_code !='-'){
					if (strpos($_SERVER['REQUEST_URI'], $session->access_list[$i]->access_code) !== false) {_result()->privilege()->end();}
				}
			}
		}
		$m=strtoupper($m);
		if($al==false){
			$roleList=(array)$session->role_list;
			$ada=false;
			for($i=0,$iLen=count($roleList); $i<$iLen;$i++){if($roleList[$i]->code==$m){$ada=true;}}
			if($ada===false){$result->privilege()->end();}
		}
		$folderList=$session->folder_list;
		if($al==true){
			$menu=_this()->query->row("SELECT menu_id,menu_name FROM app_menu WHERE menu_code='".$m."'");
			_this()->menuName=$menu->menu_name;
			$folder=_this()->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
					CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
					,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl DESC SEPARATOR '/')) AS val
					FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
						FROM(SELECT @r := ".$menu->menu_id.", @l := 0) vars,app_menu h
						WHERE @r IS NOT NULL) T1
					JOIN app_menu T2 ON T1._id = T2.menu_id
					LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
					ORDER BY T1.lvl DESC");
			$result=_result();
			if($folder){
				$url="source/build".$folder->val;
			}else{$result->error()->setMessage("File '".strtolower($m).".php' Not Found.");}
		}else{
			$url=$folderList->$m;
		}
		if(file_exists($url.".php") || file_exists($url."/main.php")){
			$urlMain='';
			if(file_exists($url.".php")){
				$urlMain=$url.".php";
			}else if(file_exists($url."/main.php")){
				$urlMain=$url."/main.php";
			}
			include './'.$urlMain;
			if($menuName){_this()->menuName=$menuName;
			}else{
				if(_this()->menuName==''){
					$menu=_this()->query->row("SELECT menu_id,menu_name FROM app_menu WHERE menu_code='".$m."'");
					_this()->menuName=$menu->menu_name;
				}
			}
			if($al==true){$f=$f.'_allow';}
			if(function_exists($f)){if($f($this)===false){return true;}
			}else{$result->error()->setMessage('Function Not Found.');}
		}else{$result->error()->setMessage("File '".strtolower($m).".php' Not Found.");}
		$result->end();
	}
	public function js(){
		$result = $this->jsonresult;
		if(isset($_GET['m'])){
			$m=$_GET['m'];
			$session_id=null;
			$pageSession=$this->pagesession;
			if($pageSession->cek()){
				if(isset($_GET['session'])){$session_id=$_GET['session'];
				}else{$result->error()->setMessage('Session Tidak Ada, Harap Keluar dan Masuk Lagi Aplikasi.')->end();}
			}else{$result->session()->end();}
			$session=$pageSession->getAccess();
			$folderList=$session->folder_list;
			if(isset($folderList->$m)){
				$url=$folderList->$m;
				$this->load->library('lib/lib_language');
				$this->lib_language->load($m);
				if(file_exists($url.".js") || file_exists($url."/main.js")){
					$urlMain='';
					$init='';
					if(file_exists($url.".js")){
						$urlMain=$url.".js";
					}else if(file_exists($url."/main.js")){
						$urlMain=$url."/main.js";
					}
					$stream_opts = ["ssl" => ["verify_peer"=>false,"verify_peer_name"=>false]]; 
					$script=file_get_contents(base_url().$urlMain,false,stream_context_create($stream_opts));
					if(file_exists($url."_init.js")){$init=file_get_contents(base_url().$url."_init.js",false,stream_context_create($stream_opts));}
					else if(file_exists($url."/init.js")){
						$init=file_get_contents(base_url().$url."/init.js",false,stream_context_create($stream_opts));
					}
					if(base64_decode($script,true)==true){$script=base64_decode($script);}
					$this->load->library('minifier');
					$minifier=$this->minifier;
					$obj_imports=array();
					preg_match_all("/import (.*?)\n/",(string)$script.$init,$access); 
					if(count($access)>0){
						for($j=0,$jLen=count($access[1]); $j<$jLen;$j++){
							$obj_imports[trim($access[1][$j])]=true;
						}
					}
					if(base64_decode($script,true)==true){$script=base64_decode($script);}
					$script = $minifier->minify($script);
					$imports=array();
					foreach ($obj_imports as $import=>$text){
						$imports[]=$import;
					}
					
					
					$script = $minifier->minify($script);
					$init = $minifier->minify($init);
					$result->setData(array('script'=>$script,'language'=>json_encode($this->lang->language),'init'=>$init,'imports'=>$imports))->end();
				}else{$result->error()->setMessage('File '.strtolower($m).'.js'.' Tidak ditemukan.')->end();}
			}else{$result->privilege()->end();}
		}else{$result->error()->setMessage('Parameter Modul Tidak ditemukan.')->end();}
	}
	public function imports(){
		function _session(){$ci=&get_instance();if($ci->tmp==null){$ci->tmp=$ci->pagesession->get();}return $ci->tmp;}
		$result = $this->jsonresult;
		$pageSession=$this->pagesession;
		if($pageSession->cek()){
			if(isset($_GET['session']) && isset($_GET['param'])){
				$obj=array();
				$param=json_decode($_GET['param']);
				$this->load->library('minifier');
				$stream_opts = ["ssl" => ["verify_peer"=>false,"verify_peer_name"=>false]]; 
				$minifier=$this->minifier;
				for($i=0,$iLen=count($param);$i<$iLen;$i++){
					$split=explode('.',$param[$i]);
					$obj_imports=array();
					$obj_setting=array();
					$idMenu=$this->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$split[0]."'");
					if($idMenu){
						$idMenu=$idMenu->menu_id;
						$folder=$this->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
							CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
							,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl DESC SEPARATOR '/')) AS val
							FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
								FROM(SELECT @r := ".$idMenu.", @l := 0) vars,app_menu h
								WHERE @r IS NOT NULL) T1
							JOIN app_menu T2 ON T1._id = T2.menu_id
							LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
							ORDER BY T1.lvl DESC");
						$url="source/build".$folder->val;
						if(file_exists($url."/".$split[1].".js")){
							$script=file_get_contents(base_url().$url."/".$split[1].".js",false,stream_context_create($stream_opts));
							preg_match_all("/import\s(.*?)\n/",(string)$script,$access); 
							preg_match_all("/setting\s(.*?)\n/",(string)$script,$setting); 
							if(count($access)>0){
								for($j=0,$jLen=count($access[1]); $j<$jLen;$j++){
									$obj_imports[trim($access[1][$j])]=true;
								}
							}
							if(count($setting)>0){
								for($j=0,$jLen=count($setting[1]); $j<$jLen;$j++){
									$settingSplit=explode('.',trim($setting[1][$j]));
									$valSetting=null;
									$settings=$this->query->row("SELECT IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))) AS setting_value
										FROM app_menu_setting M
										INNER JOIN app_menu A ON A.menu_id=M.menu_id
										INNER JOIN (SELECT role_id,tenant_id,user_id FROM app_user WHERE user_id="._session()->user_id.") RO
										LEFT JOIN app_tenant_setting T ON T.setting_id=M.setting_id AND T.tenant_id=RO.tenant_id
										LEFT JOIN app_role_setting R ON R.setting_id=M.setting_id AND R.role_id=RO.role_id
										LEFT JOIN app_user_setting U ON U.setting_id=M.setting_id AND U.user_id=RO.user_id
										WHERE A.menu_code='".$settingSplit[0]."' AND M.setting_code='".$settingSplit[1]."'");
									if($settings){
										$valSetting=$settings->setting_value;
									}
									if(!isset($obj_setting[$settingSplit[0]])){
										$obj_setting[$settingSplit[0]]=array();
									}	
									$obj_setting[$settingSplit[0]][$settingSplit[1]]=$valSetting;
								}
							}
							if(base64_decode($script,true)==true){$script=base64_decode($script);}
							$script = $minifier->minify($script);
							$imports=array();
							foreach ($obj_imports as $import=>$text){
								$imports[]=$import;
							}
							$obj[$param[$i]]=array('script'=>$script,'imports'=>$imports,'setting'=>$obj_setting);
						}else{
							$obj[$param[$i]]=array('script'=>"Ext.MessageBox.alert('Error', 'Script Modul \'".$param[$i]."\' Tidak ditemukan, Harap Hubungi Admin.');",'imports'=>$obj_imports);;
						}
					}else{
						if($split[0]=='cmp'){
							if(file_exists("app/cmp/".$split[1].".js")){
								$script=file_get_contents(base_url()."app/cmp/".$split[1].".js",false,stream_context_create($stream_opts));
								preg_match_all("/import\s(.*?)\n/",(string)$script,$access); 
								preg_match_all("/setting \s(.*?)\n/",(string)$script,$setting); 
								if(count($access)>0){
									for($j=0,$jLen=count($access[1]); $j<$jLen;$j++){
										$obj_imports[trim($access[1][$j])]=true;
									}
								}
								if(count($setting)>0){
									for($j=0,$jLen=count($setting[1]); $j<$jLen;$j++){
										$settingSplit=explode('.',trim($setting[1][$j]));
										$valSetting=null;
										$settings=$this->query->row("SELECT IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))) AS setting_value
											FROM app_menu_setting M
											INNER JOIN app_menu A ON A.menu_id=M.menu_id
											INNER JOIN (SELECT role_id,tenant_id,user_id FROM app_user WHERE user_id="._session()->user_id.") RO
											LEFT JOIN app_tenant_setting T ON T.setting_id=M.setting_id AND T.tenant_id=RO.tenant_id
											LEFT JOIN app_role_setting R ON R.setting_id=M.setting_id AND R.role_id=RO.role_id
											LEFT JOIN app_user_setting U ON U.setting_id=M.setting_id AND U.user_id=RO.user_id
											WHERE A.menu_code='".$settingSplit[0]."' AND M.setting_code='".$settingSplit[1]."'");
										if($settings){
											$valSetting=$settings->setting_value;
										}
										if(!isset($obj_setting[$settingSplit[0]])){
											$obj_setting[$settingSplit[0]]=array();
										}	
										$obj_setting[$settingSplit[0]][$settingSplit[1]]=$valSetting;
									}
								}
								if(base64_decode($script,true)==true){$script=base64_decode($script);}
								$script = $minifier->minify($script);
								$imports=array();
								foreach ($obj_imports as $import=>$text){
									$imports[]=$import;
								}
								$obj[$param[$i]]=array('script'=>$script,'imports'=>$imports,'setting'=>$obj_setting);
							}else{
								$obj[$param[$i]]=array('script'=>"Ext.MessageBox.alert('Error', 'Script Komponen \'".$param[$i]."\' Tidak ditemukan, Harap Hubungi Admin.');",'imports'=>$obj_imports);;
							}
						}else{
							$obj[$param[$i]]=array('script'=>"Ext.MessageBox.alert('Error', 'Import \'".$param[$i]."\' Tidak ditemukan, Harap Hubungi Admin.');",'imports'=>$obj_imports);
						}
					}
				}
				$result->setData(array('imports'=>$obj))->end();
			}else{$result->error()->setMessage('Parameter tidak lengkap, Harap Keluar dan Masuk Lagi Aplikasi.')->end();}
		}else{$result->session()->end();}
	}
}