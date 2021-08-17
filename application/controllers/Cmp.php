<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Cmp extends MY_controller {
	public $queryInner="";
	public $queryVal="";
	public function barcode39(){
		$common=$this->common;
		$text=$this->get('text');
		$height=80;
		if(isset($_GET['height'])){
			$height=$_GET['height'];
		}
		$barcode39=new Barcode39($text);
		$barcode39->barcode_height=$height;
		$barcode39->draw();
		
	}
	public function cropFaceDetection(){
		$text=$this->post('uri');
		$this->load->library('FaceDetector');
		$detector = new FaceDetector('detection.dat');
		$detector->faceDetect($text);
		$this->jsonresult->setData($detector->cropFaceToBase64())->end();
	}
	public function setNotif(){
		if($this->allow()==true){
			$idnya=$_POST['id'];
			$now=new DateTime();
			$session=$this->pagesession->get();
			$this->load->library('lib/lib_table_sequence');
			$arr=array();
			$id=$this->lib_table_sequence->get('app_notification_read');
			$arr['notification_read_id']=$id;
			$arr['employee_id']=$session->employee_id;
			$arr['notification_id']=$idnya;
			$arr['read_on']=$now->format('Y-m-d H:i:s');
			$this->db->insert('app_notification_read',$arr);
			$this->jsonresult->end();	
		}
	}
	public function getNotif(){
		if($this->allow()==true){
			$session=$this->pagesession->get();
			$now=new DateTime();
			// echo json_encode($session->role_list);
			$sub='';
			for($i=0,$iLen=count($session->role_list);$i<$iLen;$i++){
				if(isset($session->role_list[$i]->code)){
					if($i==0){
						$sub.=" OR ME.menu_code IN(";
					}else{
						$sub.=",";
					}
					$sub.="'".$session->role_list[$i]->code."'";
				}
			}
			if($sub !=''){
				$sub.=")";
			}
			$res=$this->query->result("SELECT M.notification_id,title,message,ME.menu_code FROM app_notification M
				LEFT JOIN app_menu ME ON ME.menu_id=M.menu_id
				LEFT JOIN app_notification_read R ON R.notification_id=M.notification_id AND R.employee_id=".$session->employee_id."
				WHERE (M.tenant_id IS NULL OR M.tenant_id=".$session->tenant_id.") AND (ME.menu_id IS NULL ".$sub." )
				AND(M.employee_id IS NULL OR M.employee_id=".$session->employee_id.") AND (start_date>='".$now->format('Y-m-d')."') AND 
				(end_date IS NULL OR end_date <='".$now->format('Y-m-d')."')AND R.employee_id IS NULL");
			$this->load->library('lib/lib_table_sequence');
			for($i=0,$iLen=count($res); $i<$iLen;$i++){
				if($res[$i]->menu_code == null && $res[$i]->menu_code == ''){
					$arr=array();
					$id=$this->lib_table_sequence->get('app_notification_read');
					$arr['notification_read_id']=$id;
					$arr['employee_id']=$session->employee_id;
					$arr['notification_id']=$res[$i]->notification_id;
					$arr['read_on']=$now->format('Y-m-d H:i:s');
					$this->db->insert('app_notification_read',$arr);
				}
			}
			$this->jsonresult->setData($res)->end();	
		}
	}
	public function settingDefault(){
		if($this->allow()==true){
			$this->query->start();
			$menu_code=$this->post('menu_code');
			$setting_code=$this->post('setting_code');
			$tenant_id=$this->post('tenant_id');
			$role_id=$this->post('role_id');
			$level=$this->post('level');
			$user_id=$this->post('user_id');
			$menu_id=$this->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$menu_code."'")->menu_id;
			$setting_id=$this->query->row("SELECT setting_id FROM app_menu_setting WHERE menu_id=".$menu_id." AND setting_code='".$setting_code."'")->setting_id;
			$session=$this->pagesession->get()->getSetting()->getMenu()->getAccess();
			if($role_id==null || $role_id==''){
				$role_id=$this->query->row("SELECT role_id FROM app_user WHERE user_id=".$session->user_id)->role_id;
			}
			if($level==0){
				$this->query->back();
				$this->jsonresult->warning()->setMessage('Tidak Dapat Setting Default Untuk Level ini.')->end();
			}else if($level==1){
				$jum=$this->query->row("SELECT tenant_setting_id AS id FROM app_tenant_setting
					WHERE setting_id=".$setting_id." AND tenant_id=".$tenant_id);
				if($jum){
					$this->query->set("DELETE FROM app_tenant_setting WHERE tenant_setting_id=".$jum->id);
				}
			}else if($level==2){
				$jum=$this->query->row("SELECT role_setting_id AS id FROM app_role_setting
					WHERE setting_id=".$setting_id." AND role_id=".$role_id);
				if($jum){
					$this->query->set("DELETE FROM app_role_setting WHERE role_setting_id=".$jum->id);
				}
			}else if($level==3){
				$jum=$this->query->row("SELECT user_setting_id AS id FROM app_user_setting
					WHERE setting_id=".$setting_id." AND user_id=".$user_id);
				if($jum){
					$this->query->set("DELETE FROM app_user_setting WHERE user_setting_id=".$jum->id);
				}
			}
			$value=$this->query->row("SELECT IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))) AS value FROM app_menu_setting M 
				INNER JOIN app_menu ME ON ME.menu_id=M.menu_id
				LEFT JOIN app_tenant_setting T ON T.tenant_id=".$session->tenant_id." AND T.setting_id=M.setting_id
				LEFT JOIN app_role_setting R ON R.role_id=".$role_id." AND R.setting_id=M.setting_id
				LEFT JOIN app_user_setting U ON U.user_id=".$session->user_id." AND U.setting_id=M.setting_id
				WHERE  ME.menu_code='".$menu_code."' AND M.setting_code='".$setting_code."' ");
			$this->query->end();
			if($session->setting>$menu_code != null){
				if(isset($session->setting->$menu_code->$setting_code)){
					$session->setting->$menu_code->$setting_code=$value->value;
					$session->set();
				}
			}
			$this->jsonresult->setData($value->value)->end();
		}
	}
	public function saveSetting(){
		if($this->allow()==true){
			$this->query->start();
			$menu_code=$this->post('menu_code');
			$setting_code=$this->post('setting_code');
			$tenant_id=$this->post('tenant_id');
			$role_id=$this->post('role_id');
			$level=$this->post('level');
			$user_id=$this->post('user_id');
			$value=$this->post('value');
			$result=$this->post('result');
			$menu_id=$this->query->row("SELECT menu_id FROM app_menu WHERE menu_code='".$menu_code."'")->menu_id;
			$setting_id=$this->query->row("SELECT setting_id FROM app_menu_setting WHERE menu_id=".$menu_id." AND setting_code='".$setting_code."'")->setting_id;
			$session=$this->pagesession->get()->getSetting()->getMenu()->getAccess();
			if($role_id==null || $role_id==''){
				$role_id=$this->query->row("SELECT role_id FROM app_user WHERE user_id=".$session->user_id)->role_id;
			}
			if($level==0){
				$arr=array();
				$arr['setting_value']=$value;
				$arr['setting_result']=$result;
				$this->db->where(array('menu_id'=>$menu_id,'setting_code'=>$setting_code));
				$this->db->update('app_menu_setting',$arr);
			}else if($level==1){
				$jum=$this->query->row("SELECT tenant_setting_id AS id FROM app_tenant_setting
					WHERE setting_id=".$setting_id." AND tenant_id=".$tenant_id);
				if($jum){
					$arr=array();
					$arr['setting_value']=$value;
					$arr['setting_result']=$result;
					$this->db->where('tenant_setting_id',$jum->id);
					$this->db->update('app_tenant_setting',$arr);
				}else{
					$arr=array();
					$this->load->library('lib/lib_table_sequence');
					$id=$this->lib_table_sequence->get('app_tenant_setting');
					$arr['tenant_setting_id']=$id;
					$arr['setting_id']=$setting_id;
					$arr['tenant_id']=$tenant_id;
					$arr['setting_value']=$value;
					$arr['setting_result']=$result;
					$this->db->insert('app_tenant_setting',$arr);
				}
			}else if($level==2){
				$jum=$this->query->row("SELECT role_setting_id AS id FROM app_role_setting
					WHERE setting_id=".$setting_id." AND role_id=".$role_id);
				if($jum){
					$arr=array();
					$arr['setting_value']=$value;
					$arr['setting_result']=$result;
					$this->db->where('role_setting_id',$jum->id);
					$this->db->update('app_role_setting',$arr);
				}else{
					$arr=array();
					$this->load->library('lib/lib_table_sequence');
					$id=$this->lib_table_sequence->get('app_role_setting');
					$arr['role_setting_id']=$id;
					$arr['setting_id']=$setting_id;
					$arr['role_id']=$role_id;
					$arr['setting_value']=$value;
					$arr['setting_result']=$result;
					$this->db->insert('app_role_setting',$arr);
				}
			}else if($level==3){
				$jum=$this->query->row("SELECT user_setting_id AS id FROM app_user_setting
					WHERE setting_id=".$setting_id." AND user_id=".$user_id);
				if($jum){
					$arr=array();
					$arr['setting_value']=$value;
					$arr['setting_result']=$result;
					$this->db->where('user_setting_id',$jum->id);
					$this->db->update('app_user_setting',$arr);
				}else{
					$arr=array();
					$this->load->library('lib/lib_table_sequence');
					$id=$this->lib_table_sequence->get('app_user_setting');
					$arr['user_setting_id']=$id;
					$arr['setting_id']=$setting_id;
					$arr['user_id']=$user_id;
					$arr['setting_value']=$value;
					$arr['setting_result']=$result;
					$this->db->insert('app_user_setting',$arr);
				}
			}
			$value=$this->query->row("SELECT IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))) AS value FROM app_menu_setting M 
				INNER JOIN app_menu ME ON ME.menu_id=M.menu_id
				LEFT JOIN app_tenant_setting T ON T.tenant_id=".$session->tenant_id." AND T.setting_id=M.setting_id
				LEFT JOIN app_role_setting R ON R.role_id=".$role_id." AND R.setting_id=M.setting_id
				LEFT JOIN app_user_setting U ON U.user_id=".$session->user_id." AND U.setting_id=M.setting_id
				WHERE  ME.menu_code='".$menu_code."' AND M.setting_code='".$setting_code."' ");
			$this->query->end();
			if($session->setting>$menu_code != null){
				if(isset($session->setting->$menu_code->$setting_code)){
					$session->setting->$menu_code->$setting_code=$value->value;
					$session->set();
				}
			}
			$this->jsonresult->setData($value->value)->end();
		}
	}
	public function initSetting(){
		if($this->allow()==true){
			$menu_code=$this->get('menu_code');
			$setting_code=$this->get('setting_code');
			$tenant_id=$this->get('tenant_id');
			$role_id=$this->get('role_id');
			$level=$this->get('level');
			$user_id=$this->get('user_id');
			$session=$this->pagesession->get();
			if($role_id==null || $role_id==''){
				$role_id=$this->query->row("SELECT role_id FROM app_user WHERE user_id=".$session->user_id)->role_id;
			}
			$queryInnerLevel="";
			$queryValLevel="";
			$queryResLevel="";
			if($level==0){
				$queryValLevel="M.setting_value";
				$queryResLevel="M.setting_result";
			}else if($level==1){
				$queryInnerLevel="LEFT JOIN app_tenant_setting T ON T.tenant_id=".$tenant_id." AND T.setting_id=M.setting_id";
				$queryValLevel="IFNULL(T.setting_value,M.setting_value)";
				$queryResLevel="IFNULL(T.setting_result,M.setting_result)";
			}else if($level==2){
				$queryInnerLevel="LEFT JOIN app_tenant_setting T ON T.tenant_id=".$tenant_id." AND T.setting_id=M.setting_id
					LEFT JOIN app_role_setting R ON R.role_id=".$role_id." AND R.setting_id=M.setting_id
				";
				$queryValLevel="IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))";
				$queryResLevel="IFNULL(R.setting_result,IFNULL(T.setting_result,M.setting_result))";
			}else if($level==3){
				$queryInnerLevel="LEFT JOIN app_tenant_setting T ON T.tenant_id=".$tenant_id." AND T.setting_id=M.setting_id
					LEFT JOIN app_role_setting R ON R.role_id=".$role_id." AND R.setting_id=M.setting_id
					LEFT JOIN app_user_setting U ON U.user_id=".$user_id." AND U.setting_id=M.setting_id
				";
				$queryValLevel="IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value)))";
				$queryResLevel="IFNULL(U.setting_result,IFNULL(R.setting_result,IFNULL(T.setting_result,M.setting_result)))";
			}
			$set=$this->query->row("SELECT ".$queryValLevel." AS value,M.setting_type AS type,
				".$queryResLevel." AS result,M.setting_object AS object FROM app_menu_setting M 
				INNER JOIN app_menu ME ON ME.menu_id=M.menu_id
				".$queryInnerLevel."
				WHERE  ME.menu_code='".$menu_code."' AND M.setting_code='".$setting_code."' ");
				// echo "SELECT ".$queryValLevel." AS value,M.setting_type AS type,
				// ".$queryResLevel." AS result,M.setting_object AS object FROM app_menu_setting M 
				// INNER JOIN app_menu ME ON ME.menu_id=M.menu_id
				// ".$queryInnerLevel."
				// WHERE  ME.menu_code='".$menu_code."' AND M.setting_code='".$setting_code."' ";
			if($set){
				if((($set->type=='INPUT_TYPE_LISTQ' || $set->type=='INPUT_TYPE_OBJECTQ' )&& $level==0 && strpos($set->object,'$tenant_id')!==false)|| ($set->type=='INPUT_TYPE_CMP' && $level==0 )){
					$this->jsonresult->warning()->setMessage('Setting ini tidak dapat di ubah di level ini.')->end();
				}
				if($set->type=='INPUT_TYPE_LISTQ' || $set->type=='INPUT_TYPE_OBJECTQ' ){
					$strResult=$set->object;
					$strResult='$sql='.$strResult.";";
					eval($strResult);
					$set->object=$sql;
				}
			}else{
				$this->jsonresult->warning()->setMessage('Setting Tidak Ada.')->end();
			}
			$this->jsonresult->setData($set)->end();
		}
	}
	public function getSettingList(){
		if($this->allow()==true){
			function getSetting($fMenuCode,$fSettingCode){
				$ci=&get_instance();
				$set=$ci->query->row("SELECT ".$ci->queryVal." AS value FROM app_menu_setting M 
					INNER JOIN app_menu ME ON ME.menu_id=M.menu_id
					".$ci->queryInner."
					WHERE  ME.menu_code='".$fMenuCode."' AND M.setting_code='".$fSettingCode."' ");
				if($set){
					return $set->value;
				}else{
					return null;
				}
			}
			$first=$this->get('page');
			$size=$this->get('pageSize');
			$direction=$this->get('d',false);
			$sorting=$this->get('s',false);
			$menu_code=$this->get('menu_code');
			$tenant_id=$this->get('tenant_id');
			$role_id=$this->get('role_id');
			$level=$this->get('level');
			$user_id=$this->get('user_id');
			$code=json_decode($this->get('code'));
			$now=new DateTime();
			$session=$this->pagesession->get();
			if($role_id==null || $role_id==''){
				$role_id=$this->query->row("SELECT role_id FROM app_user WHERE user_id=".$session->user_id)->role_id;
			}
			$entity=' app_menu_setting';
			$criteria=" WHERE";
			$queryInnerLevel="";
			$queryValLevel="";
			$queryResLevel="";
			if($level==0){
				$queryValLevel="M.setting_value";
				$queryResLevel="M.setting_result";
			}else if($level==1){
				$queryInnerLevel="LEFT JOIN app_tenant_setting T ON T.tenant_id=".$tenant_id." AND T.setting_id=M.setting_id";
				$queryValLevel="IFNULL(T.setting_value,M.setting_value)";
				$queryResLevel="IFNULL(T.setting_result,M.setting_result)";
			}else if($level==2){
				$queryInnerLevel="LEFT JOIN app_tenant_setting T ON T.tenant_id=".$tenant_id." AND T.setting_id=M.setting_id
					LEFT JOIN app_role_setting R ON R.role_id=".$role_id." AND R.setting_id=M.setting_id
				";
				$queryValLevel="IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value))";
				$queryResLevel="IFNULL(R.setting_result,IFNULL(T.setting_result,M.setting_result))";
			}else if($level==3){
				$queryInnerLevel="LEFT JOIN app_tenant_setting T ON T.tenant_id=".$tenant_id." AND T.setting_id=M.setting_id
					LEFT JOIN app_role_setting R ON R.role_id=".$role_id." AND R.setting_id=M.setting_id
					LEFT JOIN app_user_setting U ON U.user_id=".$user_id." AND U.setting_id=M.setting_id
				";
				$queryValLevel="IFNULL(U.setting_value,IFNULL(R.setting_value,IFNULL(T.setting_value,M.setting_value)))";
				$queryResLevel="IFNULL(U.setting_result,IFNULL(R.setting_result,IFNULL(T.setting_result,M.setting_result)))";
			}
			$queryInner=$queryInnerLevel;
			$queryVal=$queryValLevel;
			$inner='	
				INNER JOIN app_menu ME ON ME.menu_id=M.menu_id
				'.$queryInnerLevel.'
			';
			$queryAddCode='';
			if(count($code)>0){
				$queryAddCode='AND M.setting_code in(';
			}
			for($i=0,$iLen=count($code);$i<$iLen;$i++){
				if($i!=0){
					$queryAddCode.=',';
				}
				$queryAddCode.="'".$code[$i]."'";
			}
			if($queryAddCode!=''){
				$queryAddCode.=')';
			}
			$criteria.=" ME.menu_code='".$menu_code."' ".$queryAddCode." ";
			
			$orderBy=' ORDER BY ';
			if($direction == null)
				$direction='ASC';
			switch ($sorting){
				default:
					$orderBy.='setting_group '.$direction;
					break;
			}
			$total=$this->query->row("SELECT count(M.setting_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
			$res=$this->query->result("SELECT M.setting_object,M.setting_code,".$queryValLevel." AS setting_value,".$queryResLevel." AS setting_result,M.setting_type,M.setting_name,CASE WHEN M.setting_group='' THEN 'General' ELSE M.setting_group END AS setting_group
						FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.',setting_index ASC,setting_name ASC LIMIT '.$size.' OFFSET '.$first);
			$arr=array();
			for($i=0,$iLen=count($res);$i<$iLen;$i++){
				$obj=$res[$i];
				$o=array();
				$o['i']=$obj->setting_code;
				$o['f1']=$obj->setting_name;
				$o['f3']=$obj->setting_group;
				$o['f2']='';
				if($obj->setting_type=='INPUT_TYPE_STRING'|| $obj->setting_type=='INPUT_TYPE_INTEGER'){
					$o['f2']=$obj->setting_value;
				}
				if($obj->setting_type=='INPUT_TYPE_DATE' ){
					$dt=new DateTime($obj->setting_value);
					$o['f2']=$dt->format('d M Y');
				}
				if($obj->setting_type=='INPUT_TYPE_CMP' ){
					$o['f2']=$obj->setting_result;
				}
				if($obj->setting_type=='INPUT_TYPE_LISTQ' || $obj->setting_type=='INPUT_TYPE_OBJECTQ'){
					$strResult=$obj->setting_object;
					if($strResult !='' && (($tenant_id!=null && $tenant_id!='null' && $tenant_id !='')||(strpos($strResult,'$tenant_id')===false))){
						$strResult='$sql='.$strResult.";";
						eval($strResult);
						$resList=$this->query->result($sql);
						if($obj->setting_type=='INPUT_TYPE_LISTQ'){
							$arrval=json_decode($obj->setting_value);
							for($j=0,$jLen=count($resList); $j<$jLen;$j++){
								for($k=0,$kLen=count($arrval); $k<$kLen;$k++){
									if((string)$arrval[$k]==(string)$resList[$j]->id){
										if($o['f2']!==''){
											$o['f2'].=', ';
										}
										$o['f2'].=$resList[$j]->text;
										break;
									}
								}
							}
						}else{
							for($j=0,$jLen=count($resList); $j<$jLen;$j++){
								if((string)$obj->setting_value==(string)$resList[$j]->id){
									if($o['f2']!==''){
										$o['f2'].=', ';
									}
									$o['f2'].=$resList[$j]->text;
									break;
								}
							}
						}
					}else{
						$o['f2']='';
					}
				}
				if($obj->setting_type=='INPUT_TYPE_PARAM' ){
					if($obj->setting_value != null && $obj->setting_value !=''){
						$par=$this->query->row("SELECT option_name FROM app_parameter_option WHERE option_code='".$obj->setting_value."'");
						if($par){
							$o['f2']=$par->option_name;
						}
					}
				}
				if($obj->setting_type=='INPUT_TYPE_YN' ){
					if($obj->setting_value=='Y'){
						$o['f2']='Yes';
					}
					if($obj->setting_value=='N'){
						$o['f2']='No';
					}
				}
				$arr[]=$o;
			}
			$this->jsonresult->setData($arr)->setTotal($total->total)->end();
		}
	}
	public function getPaymentList(){
		if($this->allow()==true){
			$i=$this->get('pid');
			$res=$this->query->result("SELECT M.payment_detail_id AS i,M.create_on AS f1,
				CONCAT(IFNULL(CASE WHEN T.transfer_flag=0 THEN T.payment_type_name ELSE CASE WHEN M.payment_id=".$i." THEN M.description ELSE CONCAT('Transfer Dari : ',P.payment_code) END END,M.description),CASE WHEN IFNULL(T.print_flag,1)=1 AND IFNULL(M.pay_code,'')<>'' THEN CONCAT(' (',M.pay_code,')') ELSE '' END) AS f2,
				CASE WHEN  M.payment_id=".$i." THEN M.debit ELSE M.kredit END AS f3,
				CASE WHEN  M.payment_id=".$i." THEN M.kredit ELSE M.debit END AS f4,IFNULL(T.print_flag,1) AS f5  
				FROM payment_detail M 
				INNER JOIN payment P ON P.payment_id=M.payment_id
				LEFT JOIN payment_type T ON T.payment_type_id=M.payment_type_id WHERE M.payment_id=".$i." OR payment_id_transfer=".$i." ORDER BY CASE WHEN IFNULL(M.payment_type_id,0)=0 THEN 0 ELSE 1 END , M.create_on ASC
			");
			$this->jsonresult->setData($res)->end();
		}
	}
	public function getByPayCode(){
		if($this->allow()==true){
			$i=$this->get('code');
			$res=$this->query->row("SELECT M.create_on AS tgl,M.payment_id,PR.partners_name,PR.partners_id FROM payment M 
			LEFT JOIN inv_trans_partners P ON P.payment_id=M.payment_id
			LEFT JOIN inv_partners PR ON PR.partners_id=P.partners_id
			WHERE M.payment_code='".$i."'");
			if($res){
				$this->jsonresult->setData($res)->end();
			}else{
				$this->jsonresult->warning()->setMessage('Pembayaran Tidak ada.')->end();
			}
		}
	}
	public function getPaymentDetailList(){
		if($this->allow()==true){
			$i=$this->get('pid');
			$res=$this->query->result("SELECT PT.payment_item_id AS i,I.item_name AS f1,
			(CASE WHEN (SUM(CASE WHEN D.payment_id=".$i." THEN T.kredit ELSE T.debit END)-SUM(CASE WHEN D.payment_id=".$i." THEN T.debit ELSE T.kredit END))<0 THEN 
			(SUM(CASE WHEN D.payment_id=".$i." THEN T.kredit ELSE T.debit END)-SUM(CASE WHEN D.payment_id=".$i." THEN T.debit ELSE T.kredit END))*-1 ELSE (SUM(CASE WHEN D.payment_id=".$i." THEN T.kredit ELSE T.debit END)-SUM(CASE WHEN D.payment_id=".$i." THEN T.debit ELSE T.kredit END)) END) AS f2 
				FROM payment M 
				INNER JOIN payment_detail D ON D.payment_id=M.payment_id OR D.payment_id_transfer=M.payment_id
				INNER JOIN payment_tag T ON T.payment_detail_id=D.payment_detail_id
				INNER JOIN payment_item PT ON PT.payment_item_id=T.payment_item_id
				INNER JOIN inv_item I ON I.item_id=PT.item_id
				WHERE M.payment_id=".$i."
				GROUP BY PT.payment_item_id,I.item_name
				ORDER BY T.payment_tag_id");
			$this->jsonresult->setData($res)->end();
		}
	}
	public function getDetailPayment(){
		if($this->allow()==true){
			$id=$this->get('pid');
			$det=$this->query->row("SELECT T.kredit FROM payment_detail D 
				INNER JOIN payment_type T ON T.payment_type_id=D.payment_type_id
				WHERE D.payment_detail_id=".$id);
			$field='debit';
			if($det->kredit==1){
				$field="kredit";
			}
			$res=$this->query->result("SELECT CAST(M.".$field." as DECIMAL(12,2)) AS f2,I.item_name AS f1 FROM payment_tag M
				INNER JOIN payment_item PI ON PI.payment_item_id=M.payment_item_id
				INNER JOIN inv_item I ON I.item_id=PI.item_id
				WHERE M.payment_detail_id=".$id);
			$this->jsonresult->setData($res)->end();
		}
	}
	public function pay(){
		if($this->allow()==true){
			$payment_id=$this->post('payment_id');
			$payment_id_transfer=$this->post('payment_id_transfer');
			$faktur=$this->post('faktur');
			$payment_type=$this->post('payment_type');
			$id=$_POST['i'];
			$cash=$_POST['f4'];
			$percent=$_POST['f3'];
			$this->query->start();
			$this->load->library('lib/lib_table_sequence');
			
			$type=$this->query->row("SELECT kredit,payment_type_name,print_flag,transfer_flag FROM payment_type WHERE payment_type_id=".$payment_type);
			$pay=$this->query->row("SELECT kredit,debit FROM payment WHERE payment_id=".$payment_id);
			$det=array();
			$now=new DateTime();
			$pidDet=$this->lib_table_sequence->get('payment_detail');
			$det['payment_detail_id']=$pidDet;
			$det['payment_id']=$payment_id;
			$det['payment_type_id']=$payment_type;
			if($type->print_flag==1){
				$this->load->library('lib/lib_sequence');
				$codenya=$this->lib_sequence->get('NO_KWITANSI');
				$det['pay_code']=$codenya['val'];
			}
			$payTransfer=array();
			if($type->transfer_flag==1){
				$payTransfer=$this->query->row("SELECT kredit,debit FROM payment WHERE payment_id=".$payment_id_transfer);
				if($payTransfer){
					if($payment_id_transfer !=='' && $payment_id_transfer!==null){
						$det['payment_id_transfer']=(double)$payment_id_transfer;
						$this->query->set("UPDATE payment SET paid=0 WHERE payment_id=".$payment_id_transfer);
						$det['description']='Transfer Ke : '.$faktur;
					}else{
						$this->query->back();
						$this->jsonresult->warning()->setMessage('Pilih Pembayaran Transfer.')->end();
					}
				}else{
					$this->query->back();
					$this->jsonresult->warning()->setMessage('Pembayaran Transfer Tidak ada.')->end();
				}
			}else{
				$det['description']=$type->payment_type_name;
			}
			$det['create_by']=$this->pagesession->get()->employee_id;
			$det['create_on']=$now->format('Y-m-d H:i:s');
			$this->db->insert('payment_detail',$det);
			$tot=0;
			for($i=0,$iLen=count($id); $i<$iLen;$i++){
				$tag=array();
				$pid=$this->lib_table_sequence->get('payment_tag');
				$tag['payment_tag_id']=$pid;
				$tag['payment_detail_id']=$pidDet;
				$tag['payment_item_id']=$id[$i];
				$tag['percent']=$percent[$i];
				$tot+=(double)$cash[$i];
				if($type->kredit==1){
					$tag['kredit']=(double)$cash[$i];
				}else{
					$tag['debit']=(double)$cash[$i];
				}
				$this->db->insert('payment_tag',$tag);
			}
			$det=array();
			if($type->kredit==1){
				(double)$pay->kredit+=(double)$tot;
				$det['kredit']=$tot;
			}else{
				$pay->debit+=$tot;
				$det['debit']=$tot;
			}
			if($type->transfer_flag==1){
				if(isset($det['kredit'])){
					$this->query->set("UPDATE payment SET 
					debit=".($payTransfer->debit+$det['kredit'])."
					WHERE payment_id=".$payment_id_transfer);
				}else{
					$this->query->set("UPDATE payment SET 
					kredit=".($payTransfer->kredit+$det['debit'])."
					WHERE payment_id=".$payment_id_transfer);
				}
			}
			$this->db->where('payment_detail_id',$pidDet);
			$this->db->update('payment_detail',$det);
			
			$payment=array();
			$payment['debit']=$pay->debit;
			$payment['kredit']=$pay->kredit;
			if($pay->debit==$pay->kredit){
				$payment['paid']=1;
			}
			$this->db->where('payment_id',$payment_id);
			$this->db->update('payment',$payment);
			$this->query->end();
			$this->jsonresult->end();
		}
	}
	public function del(){
		if($this->allow()==true){
			$payment_detail_id=$this->post('i');
			$this->query->start();
			$o=$this->query->row("SELECT M.payment_type_id,P.payment_id,(P.kredit-M.kredit) AS kredit,(P.debit-M.debit) AS debit,
				(IFNULL(P1.kredit,0)-M.debit) AS kredit_transfer,(IFNULL(P1.debit,0)-M.kredit) AS debit_transfer,
				M.payment_id_transfer
				FROM payment_detail M
				INNER JOIN payment P ON P.payment_id=M.payment_id
				LEFT JOIN payment P1 ON P1.payment_id=M.payment_id_transfer
				WHERE M.payment_detail_id=".$payment_detail_id);
			if($o->payment_type_id != null){
				$this->query->set("DELETE FROM payment_detail WHERE payment_detail_id=".$payment_detail_id);
				$pay=array();
				$pay['debit']=$o->debit;
				$pay['kredit']=$o->kredit;
				$pay['paid']=0;
				$this->db->where('payment_id',$o->payment_id);
				$this->db->update('payment',$pay);
				if($o->payment_id_transfer !== null && $o->payment_id_transfer !==''){
					$pay=array();
					$pay['debit']=$o->debit_transfer;
					$pay['kredit']=$o->kredit_transfer;
					if($o->kredit_transfer==$o->debit_transfer){
						$pay['paid']=1;
					}else{
						$pay['paid']=0;
					}
					$this->db->where('payment_id',$o->payment_id_transfer);
					$this->db->update('payment',$pay);
				}
				// if($o->payment_id_transfer !== null && $o->payment_id_transfer !==''){
					// $oi=$this->query->row("SELECT P.payment_id,(P.kredit-M.kredit) AS kredit,(P.debit-M.debit) AS debit,
						// FROM payment_detail M
						// INNER JOIN payment P ON P.payment_id=M.payment_id
						// WHERE M.payment_detail_id=".$o->payment_id_transfer);
					// $pay=array();
					// $pay['debit']=$o->debit;
					// $pay['kredit']=$o->kredit;
					// $pay['paid']=0;
					// $this->db->where('payment_id',$o->payment_id);
					// $this->db->update('payment',$pay);
				// }
				$this->query->end();
				$this->jsonresult->end();
			}else{
				$this->jsonresult->error()->setMessage('Tidak Bisa diHapus Karena Parent Transaksi.')->end();
			}
		}
	}
}