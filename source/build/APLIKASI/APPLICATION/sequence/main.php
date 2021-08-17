<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT sequence_name AS f2,digit AS f3,last_value AS f4,format AS f5,repeat_type AS f6 FROM app_sequence WHERE sequence_id='".$pid."'");
	if($ori){
		$data=array();
		// $data['l']=_param('REPEAT_TYPE');
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function get_allow(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$seqCode=_get('f2',false);
	$seqName=_get('f1',false);
	$tenant=_get('tenant_id',false);
	$entity=' app_sequence ';
	$criteria=" WHERE";
	$inner='
			INNER JOIN app_parameter_option A ON M.repeat_type=A.option_code';
	$criteria.=" tenant_id=".$tenant;
	if($seqCode != null && $seqCode !='')
		$criteria.=" AND upper(sequence_code) like upper('%".$seqCode."%')";
	if($seqName != null && $seqName !='')
		$criteria.=" AND upper(sequence_name) like upper('%".$seqName."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f3":
			$orderBy.='last_value '.$direction;
			break;
		case "f5":
			$orderBy.='format '.$direction;
			break;
		case "f4":
			$orderBy.='A.option_name '.$direction;
			break;
		case "f6":
			$orderBy.='M.last_on '.$direction;
			break;
		default:
		   	$orderBy.='sequence_name '.$direction;
		       	break;
	}
	$total=_this()->query->row("SELECT count(sequence_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT sequence_id AS id,CONCAT(sequence_name,' - ',sequence_code) AS text,last_value AS f3,format AS f5,A.option_name AS f4 ,M.last_on AS f6
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$seqCode=_get('f1',false);
	$seqName=_get('f2',false);
	$repeatType=_get('f3',false);
	$format=_get('f4',false);
	$entity=' app_sequence ';
	$criteria=" WHERE";
	$inner='
			INNER JOIN app_parameter_option A ON M.repeat_type=A.option_code';
	$criteria.=" tenant_id="._session()->tenant_id;
	if($seqCode != null && $seqCode !='')
		$criteria.=" AND upper(sequence_code) like upper('%".$seqCode."%')";
	if($seqName != null && $seqName !='')
		$criteria.=" AND upper(sequence_name) like upper('%".$seqName."%')";
	if($repeatType != null && $repeatType !='')
		$criteria.=" AND A.option_code='".$repeatType."'";
	if($format != null && $format !='')
		$criteria.=" AND upper(format) like upper('%".$format."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='sequence_name '.$direction;
			break;
		case "f3":
			$orderBy.='last_value '.$direction;
			break;
		case "f5":
			$orderBy.='format '.$direction;
			break;
		case "f4":
			$orderBy.='A.option_name '.$direction;
			break;
		case "f6":
			$orderBy.='M.last_on '.$direction;
			break;
		default:
		   	$orderBy.='sequence_code '.$direction;
		       	break;
	}
	$total=_this()->query->row("SELECT count(sequence_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT sequence_id AS i,sequence_code AS f1,sequence_name AS f2,last_value AS f3,format AS f5,A.option_name AS f4 ,M.last_on AS f6
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$seqCode=_post('f1');
	$seqName=_post('f2');
	$digit=_post('f3');
	$last=_post('f4');
	$format=_post('f5');
	$repeat=_post('f6');
	$now=new DateTime();
	if($pageType=='ADD'){
		$allow=true;
		if($seqCode==''){
			$a=false;
			_load('lib/lib_sequence');
			$seq=_this()->lib_sequence;
			$sequenceCode=getSetting('SEQUENCE','SEQUENCE_CODE');
			while($a==false){
				$codenya=$seq->getById($sequenceCode,array());
				$codenya=$codenya['val'];
				$res= _this()->query->row("SELECT sequence_id AS total FROM app_sequence WHERE sequence_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$seqCode=$codenya;
					$a=true;
				}
			}
		}else{
			$res= _this()->query->row("SELECT sequence_id AS total FROM app_sequence WHERE sequence_code='".$seqCode."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow) {
			 _this()->query->set("INSERT INTO app_sequence(sequence_code,sequence_name,digit,last_value,format,repeat_type,last_on,tenant_id)VALUES
					('".$seqCode."','".$seqName."',".$digit.",".$last.",'".$format."','".$repeat."','".$now->format('Y-m-d H:i:s')."',"._this()->pagesession->get()->tenant_id.")");
			_message_save('Sequence Code', $seqCode );
		}else
			_message_exist ('Sequence Code', $seqCode );
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE app_sequence SET sequence_name='".$seqName."',digit=".$digit.",last_value=".$last.",format='".$format."',repeat_type='".$repeat."'
				WHERE sequence_id='".$pid."'");
		_message_update ('Sequence Code', $seqCode );
	}
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT sequence_code FROM app_sequence WHERE sequence_id='".$pid."'");
	if ($res) {
		 _this()->query->set("DELETE FROM app_sequence WHERE sequence_id='".$pid."'");
		_message_delete('Sequence Code', $pid );
	}else
		_not_found();
}