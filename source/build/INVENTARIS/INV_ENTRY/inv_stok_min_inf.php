<?php
function getMinStok(){
	$total=_this()->query->row("SELECT COUNT(M.item_id)AS jum FROM inv_item M
		LEFT JOIN inv_stock S ON S.item_id=M.item_id AND S.tenant_id=M.tenant_id AND S.unit_id=".getSetting('INV_STOK_MIN_INF','UNIT_ID')."
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_small
		WHERE M.active_flag=1 AND M.min_stok>IFNULL(S.stock,0) AND M.stok_alert=1 AND 
		M.tenant_id="._this()->pagesession->get()->tenant_id." AND M.item_type='ITEMTYPE_BARANG'");
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
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner="	LEFT JOIN inv_stock S ON S.item_id=M.item_id AND S.tenant_id=M.tenant_id AND S.unit_id=".getSetting('INV_STOK_MIN_INF','UNIT_ID')."
				INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_small
			";
	$criteria.=" M.active_flag=1 AND M.min_stok>IFNULL(S.stock,0) AND M.stok_alert=1 AND
		M.tenant_id="._this()->pagesession->get()->tenant_id." AND M.item_type='ITEMTYPE_BARANG' ";
	if($code != null && $code !='')
		$criteria.=" AND upper(item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(item_name) like upper('%".$name."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(description) like upper('%".$desc."%')";
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f1": 
			$orderBy.='item_code '.$direction;
			break;
		case "f3":
			$orderBy.='description '.$direction;
			break;
		case "f4":
			$orderBy.='item_type '.$direction;
			break;
		default:
		   	$orderBy.='item_name '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(item_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT CONCAT(M.item_code,' - ',M.item_name) AS item,M.min_stok,IFNULL(S.stock,0) AS stock,MEA.measurement_name
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}