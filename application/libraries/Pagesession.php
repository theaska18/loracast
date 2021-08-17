<?php
if (! defined ( 'BASEPATH' ))exit ( 'No direct script access allowed' );
class Pagesession{
	public $sessionName='APP_FRAMEWORK',$session_id=null,$employee_id=null,$user_id=null,$user_code=null,$user_name=null,$tenant_id=null,$menu_list=array(),
		$access_list=array(),$role_list=array(),$import_list=array(),$app_name=null,$app_powered=null,$tenant_name=null,$tenant_address=null,$tenant_contact=null,$tenant_logo=null,$cache=null,
		$folder_list=array(),$setting=array(),$load=false,$loadAccess=false,$loadMenu=false,$loadSetting=false,$caches=null,$loadImports=false;
	function __construct() {
		$ci = & get_instance();
        $ci->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
        $this->caches=$ci->cache;
    }
	public function get(){
		if($this->load==false){
			$type=$this->getServiceType();
			if($type==2){$session=json_decode($this->caches->get($_GET['session']));
			}else if($type==3){$session=json_decode($this->caches->get($_POST['session']));}
			$this->employee_id=$session->employee_id;
			$this->user_id=$session->user_id;
			$this->tenant_id=$session->tenant_id;
			$this->user_code=$session->user_code;
			$this->user_name=$session->user_name;
			$this->tenant_id=$session->tenant_id;
			$this->app_name=$session->app_name;
			$this->app_powered=$session->app_powered;
			$this->tenant_name=$session->tenant_name;
			$this->tenant_address=$session->tenant_address;
			$this->tenant_contact=$session->tenant_contact;
			$this->tenant_logo=$session->tenant_logo;
			$this->cache=$session->cache;
			$this->clear_storage=$session->clear_storage;
			$this->session_id=$session->session_id;
			$this->load=true;
		}
		return $this;
	}
	public function getAccess(){
		if($this->loadAccess==false){
			$type=$this->getServiceType();
			if($type==2){$session=json_decode($this->caches->get($_GET['session'].'_ACCESS'));
			}else if($type==3){$session=json_decode($this->caches->get($_POST['session'].'_ACCESS'));}
			$this->access_list=$session->access_list;
			$this->role_list=$session->role_list;
			$this->folder_list=$session->folder_list;
			$this->loadAccess=true;
		}
		return $this;
	}
	public function getSetting(){
		if($this->loadSetting==false){
			$type=$this->getServiceType();
			if($type==2){$session=json_decode($this->caches->get($_GET['session'].'_SETTING'));
			}else if($type==3){$session=json_decode($this->caches->get($_POST['session'].'_SETTING'));}
			$this->setting=$session->setting;
			$this->loadSetting=true;
		}
		return $this;
	}
	public function getMenu(){
		if($this->loadMenu==false){
			$type=$this->getServiceType();
			if($type==2){$session=json_decode($this->caches->get($_GET['session'].'_MENU'));
			}else if($type==3){$session=json_decode($this->caches->get($_POST['session'].'_MENU'));}
			$this->menu_list=$session->menu_list;
			$this->loadMenu=true;
		}
		return $this;
	}
	public function getImports(){
		if($this->loadImports==false){
			$type=$this->getServiceType();
			if($type==2){$session=json_decode($this->caches->get($_GET['session'].'_IMPORTS'));
			}else if($type==3){$session=json_decode($this->caches->get($_POST['session'].'_IMPORTS'));}
			$this->import_list=$session->import_list;
			$this->loadImports=true;
		}
		return $this;
	}
	public function set($arr=null){
		if($arr==null){$arr=$this;}
		$this->caches->save($arr->session_id, json_encode(
			array(
				'employee_id'=>$arr->employee_id,
				'user_id'=>$arr->user_id,
				'tenant_id'=>$arr->tenant_id,
				'user_code'=>$arr->user_code,
				'user_name'=>$arr->user_name,
				'tenant_id'=>$arr->tenant_id,
				'app_name'=>$arr->app_name,
				'app_powered'=>$arr->app_powered,
				'tenant_name'=>$arr->tenant_name,
				'tenant_address'=>$arr->tenant_address,
				'tenant_contact'=>$arr->tenant_contact,
				'tenant_logo'=>$arr->tenant_logo,
				'cache'=>$arr->cache,
				'clear_storage'=>$arr->clear_storage,
				'setting'=>$arr->setting,
				'session_id'=>$arr->session_id
			)
		), 3600);
		$this->caches->save($arr->session_id.'_ACCESS', json_encode(
			array(
				'access_list'=>$arr->access_list,
				'role_list'=>$arr->role_list,
				'folder_list'=>$arr->folder_list
			)
		), 3600);
		$this->caches->save($arr->session_id.'_MENU', json_encode(array('menu_list'=>$arr->menu_list)), 3600);
		$this->caches->save($arr->session_id.'_SETTING', json_encode(array('setting'=>$arr->setting)), 3600);
		$this->caches->save($arr->session_id.'_IMPORTS', json_encode(array('import_list'=>$arr->import_list)), 3600);
		return $arr;
	}
	public function cek(){
		$a = false;
		$type=$this->getServiceType();
		if($type==2){
			if($this->caches->get($_GET['session'])){$a = true;
			}else{
				$ci = & get_instance ();
				$res=$ci->query->row("SELECT result FROM app_cache WHERE cache_code='".$_GET['session']."'");
				if($res){
					$this->set(json_decode($res->result));
					$a = true;
				}
			}
		}
		if($type==3){
			if($this->caches->get($_POST['session'])){$a = true;
			}else{
				$ci = & get_instance ();
				$res=$ci->query->row("SELECT result FROM app_cache WHERE cache_code='".$_POST['session']."'");
				if($res){
					$this->set(json_decode($res->result));
					$a = true;
				}
			}
		}
		return $a;
	}
	public function getServiceType(){
		$a = 0;
		if(isset($_GET['session'])){$a = 2;}
		if(isset($_POST['session'])){$a = 3;}
		return $a;
	}
	public function destroy() {
		$type=$this->getServiceType();
		if($type==2){
			$ses=$_GET['session'];
			$this->caches->delete($ses);
			$this->caches->delete($ses.'_ACCESS');
			$this->caches->delete($ses.'_MENU');
			$this->caches->delete($ses.'_SETTING');
			$this->caches->delete($ses.'_IMPORTS');
		}else if($type==3){
			$ses=$_POST['session'];
			$this->caches->delete($ses);
			$this->caches->delete($ses.'_ACCESS');
			$this->caches->delete($ses.'_MENU');
			$this->caches->delete($ses.'_SETTING');
			$this->caches->delete($ses.'_IMPORTS');
		}
	}	
}
?>