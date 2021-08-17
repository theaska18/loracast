<?php
function delete(){
	$pid= _post('i');
	$res= _this()->query->row("SELECT unit_code FROM inv_unit WHERE unit_id=".$pid);
	if ($res != null) {
		$code=$res->unit_code;
		_this()->query->set("DELETE FROM inv_unit WHERE unit_id=".$pid);
		_message_delete('Kode Unit', $code );
	}else
		_not_found();
}
function get_allow(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$unitCode=_get('f2',false);
	$unitName=_get('f1',false);
	$tenant=_get('tenant_id',false);
	$entity=' inv_unit ';
	$criteria=" WHERE";
	$inner='
			INNER JOIN app_parameter_option A ON M.unit_type=A.option_code';
	$criteria.=" tenant_id=".$tenant;
	if($unitCode != null && $unitCode !='')
		$criteria.=" AND upper(unit_code) like upper('%".$unitCode."%')";
	if($unitName != null && $unitName !='')
		$criteria.=" AND upper(unit_name) like upper('%".$unitName."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2":
			$orderBy.='A.option_name '.$direction;
			break;
		default:
		   	$orderBy.='unit_name '.$direction;
		       	break;
	}
	$total=_this()->query->row("SELECT count(unit_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT unit_id AS id,CONCAT(unit_name,' - ',unit_code) AS text,A.option_name AS f2
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}