<?php
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$jobCode=_get('f1',false);
	$jobName=_get('f2',false);
	$active=_get('f3',false);
	
	$entity=' app_job ';
	$criteria=" WHERE tenant_id="._session()->tenant_id;
	$inner='';
	if($jobCode != null && $jobCode !='')
		$criteria.=" AND upper(job_code) like upper('%".$jobCode."%')";
	if($jobName != null && $jobName !='')
		$criteria.=" AND upper(job_name) like upper('%".$jobName."%')";
	if($active != null && $active !=''){
		if($active=='Y')
			$criteria.=' AND active_flag=true ';
		else
			$criteria.=' AND active_flag=false ';
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.=' job_name '.$direction;
			break;
		default:
			$orderBy.='job_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(job_id) AS total FROM ".$entity." ".$criteria);
	$res=_this()->query->result("SELECT job_id AS i,job_code AS f1,job_name AS f2,active_flag AS f3 FROM ".$entity." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
// function toExcel(){
	// $jobCode=_get('f1');
	// $jobName=_get('f2');
	// $active=_get('f3');
	
	// $entity='app_job';
	// $criteria=" WHERE tenant_id="._tenant_id();
	
	// if($jobCode != null && $jobCode !='')
		// $criteria.=" AND upper(job_code) like upper('%".$jobCode."%')";
	// if($jobName != null && $jobName !='')
		// $criteria.=" AND upper(job_name) like upper('%".$jobName."%')";
	// if($active != null && $active !=''){
		// if(trim($active)=='Y')
			// $criteria.=' AND active_flag=true ';
		// else
			// $criteria.=' AND active_flag=false ';
	// }
	// $orderBy=' ORDER BY job_code ASC ';
	// $res=_sql_result("SELECT job_code,job_name,active_flag FROM ".$entity." ".$criteria." ".$orderBy);
	// _excel(_function('generate_table',$res),_seq('EXPORT',_tenant_id()).'.xls');
	// return false;
// }
function initUpdate(){
	$pid=_get('i');
	$ori=_this()->query->row("SELECT job_code AS f1,job_name AS f2,active_flag AS f3 FROM app_job WHERE job_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$jobCode=_post('f1');
	$jobName=_post('f2');
	$activeFlag=_post('f3');
	
	if($pageType=='ADD'){
		$allow=true;
		if($jobCode==''){
			$a=false;
			$sequenceCode=getSetting('JOB','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT job_id FROM app_job WHERE job_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$jobCode=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT job_id FROM app_job WHERE job_code='".$jobCode."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$id=_getTableSequence('app_job');
			_this()->query->set("INSERT INTO app_job(job_id,job_code,job_name,active_flag,tenant_id) VALUES(".$id.",'".$jobCode."','".$jobName."',".$activeFlag.","._session()->tenant_id.")");
			_message_save('Job Code',$jobCode);
		}else
			_message_exist('Job Code',$jobCode);
	}else if($pageType=='UPDATE'){
		$res=_this()->query->row("SELECT job_id FROM app_job WHERE job_id=".$pid);
		if($res){
			_this()->query->set("UPDATE app_job SET job_name='".$jobName."',active_flag=".$activeFlag." WHERE job_id=".$pid);
			_message_update('Job Code',$jobCode);
		}else
			_not_found();
	}
}
function delete(){
	$pid= _post('i');
	$res= _this()->query->row("SELECT job_code FROM app_job WHERE job_id=".$pid);
	if ($res) {
		_this()->query->set("DELETE FROM app_job WHERE job_id=".$pid);
		_message_delete('Job Code',$res->job_code);
	}else
		_not_found();
}