<?php
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$type=_get('f4',false);
	$partners=_get('p',false);
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner='	
		INNER JOIN inv_trans_partners_detail D ON D.item_id=M.item_id
		INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		INNER JOIN inv_trans_partners T ON T.trans_id=D.trans_id
		INNER JOIN inv_partners P ON P.partners_id=T.partners_id
		INNER JOIN inv_measurement SAT_B ON SAT_B.measurement_id=M.measurement_buy
		INNER JOIN inv_measurement SAT ON SAT.measurement_id=D.measurement_id
	';
	$criteria.=" M.tenant_id="._this()->pagesession->get()->tenant_id." AND M.item_type='ITEMTYPE_BARANG' AND D.qty_sisa>0 AND T.posted=1 ";
	if($code != null && $code !='')
		$criteria.=" AND upper(item_code) like upper('%".$code."%')";
	if($partners != null && $partners !='')
		$criteria.=" AND upper(P.partners_name) like upper('%".$partners."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(item_name) like upper('%".$name."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(M.description) like upper('%".$desc."%')";
	if($type != null && $type !='')
		$criteria.=" AND item_type='".$type."'";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f1": 
			$orderBy.='M.item_code '.$direction;
			break;
		case "f2":
			$orderBy.='M.item_name '.$direction;
			break;
		case "f3":
			$orderBy.='M.description '.$direction;
			break;
		case "f4":
			$orderBy.='item_type '.$direction;
			break;
		default:
		   	$orderBy.='P.partners_name '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(item_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT M.item_id AS i,G.gin_code AS f8,CONCAT(P.partners_code,' - ',P.partners_name) AS p,item_code AS f1,item_name AS f2,M.description AS f3, 
		(D.qty_sisa/D.fraction) AS f4,M.active_flag AS f5,SAT_B.measurement_name AS f7,SAT.measurement_name AS f6
		FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}