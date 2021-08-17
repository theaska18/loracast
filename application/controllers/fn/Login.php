<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Login extends MY_controller {
	function __construct() {parent::__construct();}
	private $folder_list=array();
	private $setting_list=array();
	private $role_list=array();
	private $import_list=array();
	private $tenant_id,$role_id,$user_id;
	public function login(){
		$db=$this->query;
		$jsonresult=$this->jsonresult;
		$username=$this->post('username');
		$password=$this->post('password');
		$user=$db->row("SELECT user_id,role_id,M.employee_id,A.first_name,A.last_name,A.tenant_id FROM app_user M
				INNER JOIN app_employee A ON M.employee_id=A.employee_id 
				INNER JOIN app_tenant T ON T.tenant_id=A.tenant_id WHERE user_code='".$username."' AND password='".hash('md5',$password )."'");
		if ($user != null) {
			$now=new DateTime();
			$this->load->library('lib/lib_tenant');
			$tenant=$this->lib_tenant->get($user->tenant_id);
			if($tenant->due_flag==false || ($tenant->due_flag==true && $tenant->due_on> $now)){
				$r=$db->result("SELECT A.menu_code,A.menu_id,A.parent_id,A.icon,A.menu_type,A.menu_name,A.group_id,A.master_flag  
						FROM app_role_menu M INNER JOIN app_tenant_menu M1 ON M1.menu_id=M.menu_id 
						INNER JOIN app_menu A ON M.menu_id=A.menu_id WHERE M1.tenant_id=".$user->tenant_id." 
						AND A.menu_id NOT IN(SELECT menu_id FROM app_user_menu WHERE user_id=".$user->user_id.") AND role_id=".$user->role_id." ORDER BY IFNULL(A.master_flag,0) ,A.line");
				$this->tenant_id=$user->tenant_id;
				$this->role_id=$user->role_id;
				$this->user_id=$user->user_id;
				$menu=array();
				$this->load->library('minifier');
				$menu=$this->getMenuChild($r,null,false);
				$accessList=$db->result("SELECT M.acces_type,M.access_code,M.access_name
					FROM app_menu_access M 
					left JOIN app_tenant_menu_access M1 ON M1.menu_access_id=M.menu_access_id AND tenant_id=".$user->tenant_id."
					left JOIN app_role_menu_access M2 ON M2.menu_access_id=M.menu_access_id AND M2.role_id=".$user->role_id."
					WHERE menu_id IN(
						SELECT m.menu_id FROM app_menu m
						INNER JOIN app_tenant_menu t ON t.menu_id=m.menu_id INNER JOIN app_role_menu r ON r.menu_id=m.`menu_id`
						WHERE t.tenant_id=".$user->tenant_id." AND r.role_id=".$user->role_id." AND r.menu_id NOT IN(SELECT menu_id FROM app_user_menu WHERE user_id=".$user->user_id.")) 
						AND M.active_flag=1  AND (M2.role_menu_access_id IS NULL OR M1.tenant_menu_access_id IS NULL 
						OR  M.menu_access_id IN(SELECT menu_access_id FROM app_user_menu_access WHERE user_id=".$user->user_id.")) 
				");
				unset($r);
				$this->load->library('lib/lib_system_property');
				$this->load->library('lib/lib_image');
				$this->load->library('lib/lib_encrypt');
				$page=$this->pagesession;
				$session_id=uniqid();//str_replace('=','',str_replace('/','',str_replace('+','',$this->lib_encrypt->encode($now->format('ymdHis').$user->user_id))));
				$page->employee_id=$user->employee_id;
				$page->tenant_id=$tenant->tenant_id;
				$page->user_id=$user->user_id;
				$page->user_code=$username;
				$page->user_name=$user->first_name.' '.$user->last_name;
				unset($user);
				$page->menu_list=$menu;
				unset($menu);
				$page->access_list=$accessList;
				unset($accessList);
				$page->folder_list=$this->folder_list;
				$page->setting=$this->setting_list;
				$page->role_list=$this->role_list;
				unset($this->role_list);
				$imports=array();
				foreach ($this->import_list as $import=>$text){
					$imports[]=$import;
				}
				$page->import_list=$imports;
				unset($this->import_list);
				unset($imports);
				$page->cache=$this->lib_system_property->get('CACHE');
				$page->clear_storage=$this->lib_system_property->get('CLEAR_STORAGE');
				$page->tenant_logo=$this->lib_image->get($tenant->logo);
				$page->tenant_name=$tenant->tenant_name;
				$page->tenant_address=$tenant->address.', Kota '.$tenant->city;
				$page->tenant_contact='<span class="fa fa-phone"></span> '.$tenant->phone_number.' <span class="fa fa-fax"></span> '.$tenant->fax_number;
				$page->app_name=$tenant->app_name;
				$page->app_powered=$this->lib_system_property->get('APP_POWERED');
				$page->session_id=$session_id;
				$page->set();
				$jsonresult->setData($session_id)->end();
			}else{$jsonresult->error()->setMessage('Penyewa Tidak Aktif.')->end();}
		}else{$jsonresult->error()->setMessage('Login Gagal Isi Data dengan benar.')->end();}
	}
	private function getMenuChild($roleMenus,$parentId=null,$master) {
		$res = array ();$line=1;
		for($j=0;$j<count($roleMenus);$j++) {
			$roleMenu=$roleMenus [$j];
			if ($roleMenu->parent_id==$parentId) {
				array_splice($roleMenus,$j,1);
				$j--;$a=array();
				if($roleMenu->icon != null && $roleMenu->icon != ''){$a['iconCls']=$roleMenu->icon;}else{
					$a['iconCls']=null;
				}
				$a['text']=$roleMenu->menu_name;
				$disini=false;
				if($roleMenu->master_flag==1){
					$master=true;
					$disini=true;
				}
				$a['master_flag']=$roleMenu->master_flag;
				if($roleMenu->menu_type=='MENUTYPE_FOLDER'){
					$m=$this->getMenuChild($roleMenus,$roleMenu->menu_id,$master);
					if($master==true){
						$a['menu']=$m;
					}else{
						$a['children']=$m;
						$a['cls']='i-menu-header';
					}
				}else{
					$minifier=$this->minifier;
					$script='';$load='';$stream_opts = ['ssl' => ['verify_peer'=>false,'verify_peer_name'=>false]];$folder='';
					$folder=$this->query->row("SELECT CONCAT('/',GROUP_CONCAT(CONCAT(
						CASE WHEN T2.parent_id IS NULL AND T2.group_id IS NOT NULL THEN CONCAT(G.group_code,'/') ELSE '' END
						,CASE WHEN T2.menu_type='MENUTYPE_FOLDER' THEN T2.menu_code ELSE LOWER(T2.menu_code) END) ORDER BY T1.lvl DESC SEPARATOR '/')) AS val
						FROM (SELECT  @r AS _id,(SELECT @r := parent_id FROM app_menu WHERE menu_id = _id) AS parent_id,@l := @l + 1 AS lvl
							FROM(SELECT @r := ".$roleMenu->menu_id.", @l := 0) vars,app_menu h
							WHERE @r IS NOT NULL) T1
						JOIN app_menu T2 ON T1._id = T2.menu_id
						LEFT JOIN app_menu_group G ON G.group_id=T2.group_id
						ORDER BY T1.lvl DESC");
					$url="source/build".$folder->val;
					$settings=$this->query->result("SELECT M.setting_code,
						IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))) AS setting_value
						FROM app_menu_setting M
						LEFT JOIN app_tenant_setting T ON T.setting_id=M.setting_id AND T.tenant_id=".$this->tenant_id."
						LEFT JOIN app_role_setting R ON R.setting_id=M.setting_id AND R.role_id=".$this->role_id."
						LEFT JOIN app_user_setting U ON U.setting_id=M.setting_id AND U.user_id=".$this->user_id." WHERE M.menu_id=".$roleMenu->menu_id);
					if(count($settings)>0){
						$arrSetting=array();
						for($k=0,$kLen=count($settings); $k<$kLen; $k++){
							$arrSetting[$settings[$k]->setting_code]=$settings[$k]->setting_value;
						}
						$this->setting_list[$roleMenu->menu_code]=$arrSetting;
					}
					$this->folder_list[$roleMenu->menu_code]=$url;
					if(file_exists($url.'.js')){
						$update=date('U', filemtime($url.'.js'));
					}else if(file_exists($url.'/main.js')){
						$update=date('U', filemtime($url.'/main.js'));
					}
					if(file_exists($url.'_init.js')){
						$initDate=date('U', filemtime($url.'_init.js'));
						if($initDate>$update){
							$update=$initDate;
						}
					}else if(file_exists($url.'/init.js')){
						$initDate=date('U', filemtime($url.'/init.js'));
						if($initDate>$update){
							$update=$initDate;
						}
					}
					if(file_exists($url.'/run.js')){$script=file_get_contents(base_url().$url.'/run.js',false,stream_context_create($stream_opts));}
					else if(file_exists($url.'_run.js')){$script=file_get_contents(base_url().$url.'_run.js',false,stream_context_create($stream_opts));}
					if(file_exists($url."/load.js")){$load=file_get_contents(base_url().$url.'/load.js',false,stream_context_create($stream_opts));}
					else if(file_exists($url."_load.js")){$load=file_get_contents(base_url().$url.'_load.js',false,stream_context_create($stream_opts));}
					preg_match_all("/import(.*?)\n/",(string)$script,$access); 
					if(count($access)>0){
						for($i=0,$iLen=count($access[1]); $i<$iLen;$i++){
							$this->import_list[trim($access[1][$i])]=true;
						}
					}
					$text=$roleMenu->menu_name;
					$a['text']=$text;
					$script = $minifier->minify($script);
					$a['script']=$script;
					$load = $minifier->minify($load);
					$a['load']=$load;
					$a['code']=$roleMenu->menu_code;
					if($master==false){
						$a['cls']='i-menu-list';
					}
					$line++;
					$a['update']=$update;
					$this->role_list[]=array('code'=>$roleMenu->menu_code,'update'=>$update);
					$a['leaf']=true;
				}
				if($disini==true){
					$master=false;
				}
				$res[]=$a;
			}
		}
		return $res;
	}
}