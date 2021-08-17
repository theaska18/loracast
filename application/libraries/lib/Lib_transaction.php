<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_transaction {
	public function setLoadTransaction($obj){
		$data=array();
		foreach($obj as $key=>$value){
			if($key !='_command'){
				$objArr=get_object_vars($obj);
				if(gettype($value)=='object'){$data[$key]=$this->loadTransaction($key,$value,$obj->_command);
				}else{$cmdArr=get_object_vars($obj->_command);$data[$key]=$this->loadTransaction($key,$value[0],$obj->_command,$cmdArr[$key]->parent->field,$cmdArr[$key]->parent->value,$obj);}
			}
		}
		return $data;
	}
	private function loadTransaction($name,$obj,$cmd,$field='',$field2=array(),$ori=array()){
		$hasil=array();
		$query="SELECT ";
		$querySelect="";
		$queryWhere="";
		$cmdArr=get_object_vars($cmd);
		$ci=& get_instance();
		foreach($obj as $key=>$value){
			if($querySelect!==''){$querySelect.=',';}
			$querySelect.=$key;
			if($field==''){
				if($cmdArr[$name]->primary==$key){
					$queryWhere=$cmdArr[$name]->primary."=";
					if(!isset($value->type) || (isset($value->type) && $value->type=='string')){	$queryWhere.="'".$value->value."'";}else{$queryWhere.=$value->value;}
				}
			}else{
				$oriArr=get_object_vars($ori);
				$queryWhere=$field2->field."=";
				$tableArr=get_object_vars($oriArr[$field2->table]);
				if(!isset($field2->type) || (isset($field2->type) && $field2->type=='string')){$queryWhere.="'".$tableArr[$field2->field]->value."'";
				}else{$queryWhere.=$tableArr[$field2->field]->value;}
			}
		}
		unset($cmdArr);
		$query.=$querySelect." FROM ".$name." WHERE ".$queryWhere;
		if($field==''){
			$res=$ci->query->row($query);
			if($res){
				$resArr=get_object_vars($res);
				foreach($obj as $key=>$value){
					if(isset($value->type) && ($value->type=='file' && $value->file=='image')){$ci->load->library('lib/lib_image');$resArr[$key]=$ci->lib_image->get($resArr[$key]);}
				}
				$hasil=$resArr;
			}else{$ci->query->back();$ci->jsonresult->error()->setMessage("Data tidak ditemukan.")->end();}
		}else{$hasil=$ci->query->result($query);}
		return $hasil;
	}
	public function setTransaction($obj,$tenant){
		$ci=&get_instance();
		$ci->db->trans_begin();
		foreach($obj as $key=>$value){
			if($key !='_command' && $key !='_file'){
				$objArr=get_object_vars($obj);
				if(gettype($value)=='object'){$this->transaction($key,$value,$tenant,$obj);
				}else{
					$_command=get_object_vars($obj->_command);
					$objArrTable=get_object_vars($objArr[$_command[$key]->parent->value->table]);
					$listOption=array();
					$sql='';
					if(!isset($objArrTable[$_command[$key]->parent->value->field]->type) ||(isset($objArrTable[$_command[$key]->parent->value->field]->type) && 
						($objArrTable[$_command[$key]->parent->value->field]->type=='string' || $objArrTable[$_command[$key]->parent->value->field]->type=='datetime'))){
						$sql="SELECT ". $_command[$key]->primary ." FROM ".$key." WHERE ". $_command[$key]->parent->field ."='".$objArrTable[$_command[$key]->parent->value->field]->value."'";
					}else{$sql="SELECT ". $_command[$key]->primary ." FROM ".$key." WHERE ". $_command[$key]->parent->field ."=".$objArrTable[$_command[$key]->parent->value->field]->value;}
					$listOption=$ci->query->result($sql);
					$line=0;
					for($i=0,$iLen=count($listOption); $i<$iLen; $i++){
						$option=get_object_vars($listOption[$i]);
						$ada=false;
						for($j=0,$jLen=count($value); $j<$jLen; $j++){
							$dtlArr=get_object_vars($value[$j]);
							if($dtlArr[$_command[$key]->primary]->value==$option[$_command[$key]->primary]){$ada=true;$line++;}
						}
						$sql2='';
						if($ada==false){
							if(!isset($objArrTable[$_command[$key]->parent->value->field]->type) ||(isset($objArrTable[$_command[$key]->parent->value->field]->type) && 
								($objArrTable[$_command[$key]->parent->value->field]->type=='string' || $objArrTable[$_command[$key]->parent->value->field]->type=='datetime'))){
								$sql2="DELETE FROM ".$key." WHERE ".$_command[$key]->primary."='".$option[$_command[$key]->primary]."'";
							}else{$sql2="DELETE FROM ".$key." WHERE ".$_command[$key]->primary."=".$option[$_command[$key]->primary];}
							$ci->query->set($sql2);
							array_splice($listOption,$i,1);
							$i--;
							$iLen--;
						}
					}
					for($i=0,$iLen=count($value); $i<$iLen; $i++){$this->transaction($key,$value[$i],$tenant,$obj);}
				}
			}
		}
		if ($ci->db->trans_status() === FALSE){$ci->db->trans_rollback();$ci->jsonresult->error()->setMessage("Unknown Error, Please contact Admin.")->end();
		}else{$ci->db->trans_commit();}
	}
	private function transaction($name,$obj,$tenant,$ori){
		$ci=&get_instance();
		$field=array();
		$added=true;
		$fileImage=array();
		$cmdArray=get_object_vars($ori->_command);
		$oriArr=get_object_vars($ori);
		$objArr=get_object_vars($obj);
		foreach($obj as $key=>$value){
			if($cmdArray[$name]->primary==$key){
				//echo json_encode($value);
				if(!isset($value->value) || trim($value->value)==''){
					$ci->load->library('lib/lib_table_sequence');
					$field[$key]=$ci->lib_table_sequence->get($name);
					$value->value=$field[$key];
				}else{$field[$key]=$value->value;$added=false;}
			}else{
				if(isset($value->type) && $value->type=='boolean'){
					if(trim($value->value)=='' || $value->value===false){$field[$key]=false;
					}else{$field[$key]=true;$value->value=true;}
				}else if(isset($value->type) && $value->type =='datetime' && $value->value=='now()'){$now=new DateTime();$field[$key]=$now->format('Y-m-d H:i:s');
				}else if(isset($value->type) && $value->type =='file' && isset($value->file) && $value->file =='image'){$fileImage[]=array('field'=>$key,'file'=>$value->value);
				}else if(isset($value->type) && $value->type =='double'){
					if($value->value !== null && $value->value !== ''){$field[$key]=$value->value;
					}else{$field[$key]=null;}
				}else{
					if((trim($value->value)=='' || $value->value=='null')){
						if(isset($value->sequence) && $value->sequence!==null && $value->sequence!=='null' && $value->sequence!==''){
							$ci->load->library('lib/lib_sequence');
							$seq=$ci->lib_sequence;
							$codenya=$seq->getById($value->sequence,array());
							$codenya=$codenya['val'];
							$field[$key]=$codenya;
						}else{
							$field[$key]=null;
						}
					}else{$field[$key]=$value->value;if(isset($value->option)){$ci->load->library('lib/lib_dynamic_option');$ci->lib_dynamic_option->set($value->value,$value->option);}}
				}
			}
		}
		//value
		if(isset($cmdArray[$name]->value) && isset($cmdArray[$name]->value)){
			for($i=0,$iLen=count($cmdArray[$name]->value);$i<$iLen;$i++){
				$strVal=null;
				$valueArr=$cmdArray[$name]->value[$i];
				if($valueArr->type=='child'){
					$type='';
					for($j=0,$jLen=count($oriArr[$valueArr->table]); $j<$jLen;$j++){
						$dtlArr=get_object_vars($oriArr[$valueArr->table][$j]);
						for($k=0,$kLen=count($valueArr->value); $k<$kLen;$k++){
							if(substr($valueArr->value[$k],0,1)=='%'){$strVal.=substr($valueArr->value[$k],1);
							}else{
								$strVal.=$dtlArr[$valueArr->value[$k]]->value;
								if(isset($dtlArr[$valueArr->value[$k]]->type)){$type=$dtlArr[$valueArr->value[$k]]->type;}else{$type='string';}
							}
						}
					}
					$field[$cmdArray[$name]->value[$i]->field]=$strVal;
					$objArr[$cmdArray[$name]->value[$i]->field]=json_decode(json_encode(array('value'=>$strVal,'type'=>$type)));
				}else if($valueArr->type=='tenant'){
					if(isset($cmdArray[$name]->unique)){
						$adaUnique=false;
						for($j=0,$jLen=count($cmdArray[$name]->unique); $j<$jLen; $j++){if($valueArr->field==$cmdArray[$name]->unique[$j]->field){$adaUnique=true;}}
						if($adaUnique===false){
							$field[$cmdArray[$name]->value[$i]->field]=$tenant;
							$objArr[$cmdArray[$name]->value[$i]->field]=json_decode(json_encode(array('value'=>$tenant,'type'=>'double')));
						}
					}
				}
			}
		}
		//parent
		if(isset($cmdArray[$name]->parent)){
			$obj2=get_object_vars($obj);
			$oriDtlArray=get_object_vars($oriArr[$cmdArray[$name]->parent->value->table]);
			if(!isset($obj2[$cmdArray[$name]->primary]->type)||(isset($obj2[$cmdArray[$name]->primary]->type) && $obj2[$cmdArray[$name]->primary]->type=='datetime')||
				(isset($obj2[$cmdArray[$name]->primary]->type) && $obj2[$cmdArray[$name]->primary]->type=='string')){
				$oriDtlArray=get_object_vars($oriArr[$cmdArray[$name]->parent->value->table]);
				if(!isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type)||
				(isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type) && $oriDtlArray[$cmdArray[$name]->parent->value->field]->type=='datetime')||
				(isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type) && $oriDtlArray[$cmdArray[$name]->parent->value->field]->type=='string')){
					$sqlParent="SELECT count(". $cmdArray[$name]->parent->field.") AS jum FROM ". $name ." WHERE 
					".$cmdArray[$name]->primary."='".$obj2[$cmdArray[$name]->primary]->value."' AND 
					".$cmdArray[$name]->parent->field." <> '". $oriDtlArray[$cmdArray[$name]->parent->value->field]->value ."'";
				}else{
					$sqlParent="SELECT count(". $cmdArray[$name]->parent->field.") AS jum FROM ". $name ." WHERE 
					".$cmdArray[$name]->primary."='".$obj2[$cmdArray[$name]->primary]->value."' AND 
					".$cmdArray[$name]->parent->field." <> ". $oriDtlArray[$cmdArray[$name]->parent->value->field]->value;
				}	
			}else{
				if(!isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type)||
				(isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type) && $oriDtlArray[$cmdArray[$name]->parent->value->field]->type=='datetime')||
				(isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type) && $oriDtlArray[$cmdArray[$name]->parent->value->field]->type=='string')){
					$sqlParent="SELECT count(". $cmdArray[$name]->parent->field.") AS jum FROM ". $name ." WHERE 
					".$cmdArray[$name]->primary."=".$obj2[$cmdArray[$name]->primary]->value." AND 
					".$cmdArray[$name]->parent->field." <> '". $oriDtlArray[$cmdArray[$name]->parent->value->field]->value ."'";
				}else{
					$sqlParent="SELECT count(". $cmdArray[$name]->parent->field.") AS jum FROM ". $name ." WHERE 
					".$cmdArray[$name]->primary."=".$obj2[$cmdArray[$name]->primary]->value." AND 
					".$cmdArray[$name]->parent->field." <> ". $oriDtlArray[$cmdArray[$name]->parent->value->field]->value;
				}
			}
			$jumlah=$ci->query->row($sqlParent);
			if($jumlah->jum>0){
				$ci->db->trans_rollback();
				$ci->jsonresult->error()->setMessage("Child '".$obj2[$cmdArray[$name]->primary]->value."' Sudah Ada di Bagian Lain.")->end();
			}
			$oriDtlArray=get_object_vars($oriArr[$cmdArray[$name]->parent->value->table]);
			$field[$cmdArray[$name]->parent->field]=$oriDtlArray[$cmdArray[$name]->parent->value->field]->value;
			$type='string';
			if(isset($oriDtlArray[$cmdArray[$name]->parent->value->field]->type)){$type=$oriDtlArray[$cmdArray[$name]->parent->value->field]->type;}
			$objArr[$cmdArray[$name]->parent->field]=json_decode(json_encode(array('value'=>$oriDtlArray[$cmdArray[$name]->parent->value->field]->value,'type'=>$type)));
		}
		unset($oriArr);
		if($added===true){
			for($i=0,$iLen=count($fileImage); $i<$iLen;$i++){
				$field[$fileImage[$i]['field']]='';
				if($fileImage[$i]['file'] == null || $fileImage[$i]['file'] !==true){
					$ci->load->library('lib/lib_image');
					$field[$fileImage[$i]['field']]=$ci->lib_image->upload($fileImage[$i]['file'],'jpg');
					$objArr[$fileImage[$i]['field']]=json_decode(json_encode(array('value'=>$field[$fileImage[$i]['field']],'type'=>'string')));
				}
			}
			if(isset($cmdArray[$name]->value) && isset($cmdArray[$name]->value)){
				for($i=0,$iLen=count($cmdArray[$name]->value);$i<$iLen;$i++){
					$strVal=null;
					$valueArr=$cmdArray[$name]->value[$i];
					if($valueArr->type=='tenant'){
						if(isset($cmdArray[$name]->unique)){
							$adaUnique=false;
							for($j=0,$jLen=count($cmdArray[$name]->unique); $j<$jLen; $j++){
								if($valueArr->field==$cmdArray[$name]->unique[$j]->field){$adaUnique=true;break;}
							}
							if($adaUnique===true){
								$field[$cmdArray[$name]->value[$i]->field]=$tenant;
								$objArr[$cmdArray[$name]->value[$i]->field]=json_decode(json_encode(array('value'=>$tenant,'type'=>'double')));
							}
						}
					}
				}
			}
			//CHECK UNIQUE
			if(isset($cmdArray[$name]->unique)){
				$sqlUnique="SELECT count(". $cmdArray[$name]->primary.") AS jum FROM ".$name." WHERE ";
				$uniqueWhere='';
				$uniqueMsg='';
				for($j=0,$jLen=count($cmdArray[$name]->unique); $j<$jLen; $j++){
					if($uniqueWhere!=''){$uniqueWhere.=' AND ';}
					if(!isset($cmdArray[$name]->unique[$j]->type) || (isset($cmdArray[$name]->unique[$j]->type) && ($cmdArray[$name]->unique[$j]->type=='string' || $cmdArray[$name]->unique[$j]->type=='datetime'))){
						$uniqueWhere.=$cmdArray[$name]->unique[$j]->field."='".$objArr[$cmdArray[$name]->unique[$j]->field]->value."' ";
					}else{$uniqueWhere.=$cmdArray[$name]->unique[$j]->field."=".$objArr[$cmdArray[$name]->unique[$j]->field]->value." ";}
					if(isset($cmdArray[$name]->unique[$j]->name)){
						if($uniqueMsg!=''){$uniqueMsg.=', ';}
						$uniqueMsg.=$cmdArray[$name]->unique[$j]->name;
					}
				}
				$sqlUnique.=$uniqueWhere;
				$checkUnique=$ci->query->row($sqlUnique);
				if($checkUnique->jum >0){
					$ci->db->trans_rollback();
					$ci->jsonresult->error()->setMessage("Data  '".$uniqueMsg."' Sudah Ada.")->end();
				}
			}
			$ci->db->insert($name,$field);
		}else{
			$sql="SELECT ". $cmdArray[$name]->primary;
			for($i=0,$iLen=count($fileImage); $i<$iLen;$i++){$sql.=",".$fileImage[$i]['field'];}
			$sql.=" FROM ".$name." WHERE ";
			$obj2=get_object_vars($obj);
			if(isset($obj2[$cmdArray[$name]->primary]->type)){
				if($obj2[$cmdArray[$name]->primary]->type=='datetime'){$sql.=$cmdArray[$name]->primary."='".$obj2[$cmdArray[$name]->primary]->value."' ";
				}else{$sql.=$cmdArray[$name]->primary."=".$obj2[$cmdArray[$name]->primary]->value." ";}
			}else{$sql.=$cmdArray[$name]->primary."='".$obj2[$cmdArray[$name]->primary]->value."'";}
			$d=$ci->query->row($sql);
			if($d){
				$dArr=get_object_vars($d);
				for($i=0,$iLen=count($fileImage); $i<$iLen;$i++){
					$field[$fileImage[$i]['field']]=$dArr[$fileImage[$i]['field']];
					if($fileImage[$i]['file'] == null || $fileImage[$i]['file'] !==true){
						$ci->load->library('lib/lib_image');
						$field[$fileImage[$i]['field']]=$ci->lib_image->upload($fileImage[$i]['file'],'jpg',$dArr[$fileImage[$i]['field']]);
						$objArr[$fileImage[$i]['field']]=json_decode(json_encode(array('value'=>$field[$fileImage[$i]['field']],'type'=>'string')));
					}
				}
				$ci->db->where(array($cmdArray[$name]->primary=>$obj2[$cmdArray[$name]->primary]->value));
				$ci->db->update($name,$field);
			}else{
				for($i=0,$iLen=count($fileImage); $i<$iLen;$i++){
					$field[$fileImage[$i]['field']]='';
					if($fileImage[$i]['file'] == null || $fileImage[$i]['file'] !==true){
						$ci->load->library('lib/lib_image');
						$field[$fileImage[$i]['field']]=$ci->lib_image->upload($fileImage[$i]['file'],'jpg');
						$objArr[$fileImage[$i]['field']]=json_decode(json_encode(array('value'=>$field[$fileImage[$i]['field']],'type'=>'string')));
					}
				}
				if(isset($cmdArray[$name]->value) && isset($cmdArray[$name]->value)){
					for($i=0,$iLen=count($cmdArray[$name]->value);$i<$iLen;$i++){
						$strVal=null;
						$valueArr=$cmdArray[$name]->value[$i];
						if($valueArr->type=='tenant'){
							if(isset($cmdArray[$name]->unique)){
								$adaUnique=false;
								for($j=0,$jLen=count($cmdArray[$name]->unique); $j<$jLen; $j++){if($valueArr->field==$cmdArray[$name]->unique[$j]){$adaUnique=true;break;}}
								if($adaUnique===true){
									$field[$cmdArray[$name]->value[$i]->field]=$tenant;
									$objArr[$cmdArray[$name]->value[$i]->field]=json_decode(json_encode(array('value'=>$tenant,'type'=>'double')));
								}
							}
						}
					}
				}
				if(isset($cmdArray[$name]->unique)){
					$sqlUnique="SELECT count(". $cmdArray[$name]->primary.") AS jum FROM ".$name." WHERE ";
					$uniqueWhere='';
					$uniqueMsg='';
					for($j=0,$jLen=count($cmdArray[$name]->unique); $j<$jLen; $j++){
						if($uniqueWhere!=''){$uniqueWhere.=' AND ';}
						if(!isset($cmdArray[$name]->unique[$j]->type) || (isset($cmdArray[$name]->unique[$j]->type) && 
						($cmdArray[$name]->unique[$j]->type=='string' || $cmdArray[$name]->unique[$j]->type=='datetime'))){
							$uniqueWhere.=$cmdArray[$name]->unique[$j]->field."='".$objArr[$cmdArray[$name]->unique[$j]->field]->value."' ";
						}else{$uniqueWhere.=$cmdArray[$name]->unique[$j]->field."=".$objArr[$cmdArray[$name]->unique[$j]->field]->value." ";}
						if(isset($cmdArray[$name]->unique[$j]->name)){
							if($uniqueMsg!=''){$uniqueMsg.=', ';}
							$uniqueMsg.=$cmdArray[$name]->unique[$j]->name;
						}
					}
					$sqlUnique.=$uniqueWhere;
					$checkUnique=$ci->query->row($sqlUnique);
					if($checkUnique->jum >0){
						$ci->db->trans_rollback();
						$ci->jsonresult->error()->setMessage("Data  '".$uniqueMsg."' Sudah Ada.")->end();
					}
				}
				$ci->db->insert($name,$field);
			}
		}
	}
}
?>