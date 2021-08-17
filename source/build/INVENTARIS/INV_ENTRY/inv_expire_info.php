<?php
function getMinStok(){
	$now=new DateTime();
	$total=_this()->query->row("SELECT COUNT(D.item_id)AS jum  FROM inv_receive_detail D
		INNER JOIN inv_receive M ON M.receive_id=D.receive_id
		INNER JOIN inv_item I ON I.item_id=D.item_id
		INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=I.measurement_small
		WHERE M.posted=1 AND G.qty>G.qty_out AND I.expire_alert=1 
		AND DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."') <=I.expire_date AND
		M.tenant_id="._this()->pagesession->get()->tenant_id." AND M.unit_id=1");
	_data($total->jum);
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$type=_get('f4',false);
	$active=_get('f5',false);
	$unit_id=_get('unit_id');
	$entity=' inv_receive_detail';
	$now=new DateTime();
	$criteria=" WHERE";
	$inner='	INNER JOIN inv_receive M ON M.receive_id=D.receive_id
		INNER JOIN inv_item I ON I.item_id=D.item_id
		INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=I.measurement_small
	';
	$criteria.=" M.posted=1 AND G.qty>G.qty_out AND I.expire_alert=1 
		AND DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."') <=I.expire_date  AND
		M.tenant_id="._this()->pagesession->get()->tenant_id." AND M.unit_id=".$unit_id." ";
	if($code != null && $code !='')
		$criteria.=" AND upper(I.item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(I.item_name) like upper('%".$name."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(I.description) like upper('%".$desc."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		default:
		   	$orderBy.='M.receive_on '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(item_code) AS total FROM ".$entity." D  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT  M.receive_on,M.receive_number,G.gin_code,CONCAT(I.item_code,' - ',I.item_name) AS item,
	(G.qty-qty_out)AS jum,MEA.measurement_name,
	D.expire_date,CASE WHEN DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."')<0 THEN CONCAT(DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."')*-1,' Hari Yang Lalu') 
	WHEN DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."')=0 THEN 'Hari Ini' 
	WHEN DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."')>0 THEN CONCAT(DATEDIFF(D.expire_date,'".$now->format('Y-m-d')."'),' Hari Lagi') END  AS hari
				FROM ".$entity." D ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}