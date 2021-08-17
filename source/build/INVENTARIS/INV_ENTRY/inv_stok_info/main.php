<?php
function initUpdate(){
	$item_id=_get('i');
	$unit_id=getSetting('INV_STOK_INFO','UNIT_ID');
	$tenant_id=_session()->tenant_id;
	$res=_this()->query->result("SELECT G.gin_id AS i,G.gin_code AS f1,G.in_date AS f2,G.qty AS f3,G.general_price AS f4,
		G.expire_date AS f5,G.batch AS f6
		FROM inv_gin G
		WHERE G.item_id=".$item_id." AND G.tenant_id=".$tenant_id." AND G.unit_id=".$unit_id." AND G.qty>0");
	$row=_this()->query->row("SELECT M.measurement_name AS f1,IM.fraction AS f2,MM.measurement_name AS f3,I.expire_alert AS f4
		FROM inv_item I 
		INNER JOIN inv_measurement M ON M.measurement_id=I.measurement_small
		INNER JOIN inv_item_measurement IM ON IM.item_id=I.item_id AND IM.storage_flag=1
		INNER JOIN inv_measurement MM ON MM.measurement_id=IM.measurement_id
		WHERE I.item_id=".$item_id." 
	");
	_data(array('o'=>$row,'l'=>$res));
}
function save(){
	$id=_post('id');
	$gin=_post('gin');
	$item_id=_post('i');
	$batch=_post('batch');
	$expired=_post('expired');
	$price=_post('price');
	$qty_val=_post('qty_val');
	$qty_sisa=_post('qty_sisa');
	$unit_id=getSetting('INV_STOK_INFO','UNIT_ID',false,'Unit');
	$sequenceGin=getSetting('INV_STOK_INFO','SEQUENCE_GIN',false,'Nomor Gin');
	$sequenceAdjusment=getSetting('INV_STOK_INFO','SEQUENCE_ADJUSMENT',false,'Nomor Adjusment');
	$tenant_id=_session()->tenant_id;
	$employee_id=_session()->employee_id;
	$now=new DateTime();
	_this()->query->start();
	$pid=_getTableSequence('inv_adjusment');
	$a=false;
	while($a==false){
		$codenya=_getSequenceById($sequenceAdjusment);
		$res=_this()->query->row("SELECT adjusment_code FROM inv_adjusment WHERE adjusment_code='".$codenya."' AND tenant_id=".$tenant_id);
		if(!$res){
			$no_adjust=$codenya;
			$a=true;
		}
	}
	$arr=array();
	$arr['adjusment_id']=$pid;
	$arr['tenant_id']=$tenant_id;
	$arr['unit_id']=$unit_id;
	$arr['item_id']=$item_id;
	$arr['adjusment_code']=$no_adjust;
	$arr['create_by']=$employee_id;
	$arr['create_on']=$now->format('Y-m-d H:i:s');
	_this()->db->insert('inv_adjusment',$arr);
	for($i=0,$iLen=count($id); $i<$iLen;$i++){
		if((double)$qty_val[$i]!=0){
			if($id[$i] ==null || $id[$i]==''){
				$arr=array();
				$id[$i]=_getTableSequence('inv_gin');
				$arr['gin_id']=(double)$id[$i];
				$arr['tenant_id']=(double)$tenant_id;
				$a=false;
				while($a==false){
					$codenya=_getSequenceById($sequenceGin);
					$res=_this()->query->row("SELECT gin_code FROM inv_gin WHERE gin_code='".$codenya."' AND tenant_id=".$tenant_id);
					if(!$res){
						$gin_code=$codenya;
						$a=true;
					}
				}
				$arr['gin_code']=$gin_code;
				$arr['item_id']=$item_id;
				$arr['unit_id']=$unit_id;
				$arr['in_date']=$now->format('Y-m-d');
				$arr['qty']=(double)$qty_val[$i];
				$arr['expire_flag']=0;
				if($expired[$i] !== null && $expired[$i] !==''){
					$arr['expire_flag']=1;
					$arr['expire_date']=$expired[$i];
				}else{
					$arr['expire_date']=null;
				}
				$arr['batch']=$batch[$i];
				$arr['general_price']=$price[$i];
				_this()->db->insert('inv_gin',$arr);
			}else{
				$row=_this()->query->row("SELECT G.qty FROM inv_gin G WHERE G.gin_id=".$id[$i]);
				if(($row->qty+$qty_val[$i])<0){
					_this()->query->back();
					_error_message("GIN '". $gin[$i]."' Kurang dari 0, Adjusment Tidak dapat Dilakukan Harap Keluar Masuk Program.")->end();
				}
				$arr=array();
				$arr['qty']=$row->qty+(double)$qty_val[$i];
				_this()->db->where('gin_id',$id[$i]);
				_this()->db->update('inv_gin',$arr);
			}
			$row=_this()->query->row("SELECT S.stock AS qty FROM inv_stock S 
				WHERE S.tenant_id=".$tenant_id." AND S.item_id=".$item_id." AND unit_id=".$unit_id);
			if($row){
				if(($row->qty+$qty_val[$i])<0){
					_this()->query->back();
					_error_message("Stok Barang ini Kurang dari 0, Adjusment Tidak dapat Dilakukan Harap Keluar Masuk Program.")->end();
				}
				$arr=array();
				$arr['stock']=$row->qty+(double)$qty_val[$i];
				_this()->db->where(array('tenant_id'=>$tenant_id,'unit_id'=>$unit_id,'item_id'=>$item_id));
				_this()->db->update('inv_stock',$arr);
			}else{
				$arr=array();
				$arr['stock_id']=_getTableSequence('inv_stock');
				$arr['tenant_id']=$tenant_id;
				$arr['item_id']=$item_id;
				$arr['unit_id']=$unit_id;
				$arr['stock']=$qty_val[$i];
				_this()->db->insert('inv_stock',$arr);
			}
			$arr=array();
			$pi=_getTableSequence('inv_adjusment_detail');
			$arr['adjusment_detail_id']=$pi;
			$arr['adjusment_id']=$pid;
			$arr['qty']=(double)$qty_val[$i];
			$arr['gin_id']=$id[$i];
			$arr['last_qty']=$qty_sisa[$i];
			_this()->db->insert('inv_adjusment_detail',$arr);
		}
	}
	
	_this()->query->end();
	_message("Barang Berhasil diUpdate.");
}
function getListHistory(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$item_id=_get('item_id');
	$unit_id=getSetting('INV_STOK_INFO','UNIT_ID');
	$entity=' inv_adjusment';
	$criteria=" WHERE";
	$inner='
		INNER JOIN app_employee E ON E.employee_id=M.create_by
			';
	$criteria.=" M.tenant_id="._session()->tenant_id." AND M.item_id=".$item_id." AND M.unit_id=".$unit_id." ";
	$orderBy=' ORDER BY M.create_on DESC';
	
	$total=_this()->query->row("SELECT count(adjusment_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT M.adjusment_id AS i,M.create_on AS f1,E.full_name AS f2
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function getListHistoryGin(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$adjusment_id=_get('adjusment_id');
	if($adjusment_id != null && $adjusment_id!==''){
		$entity=' inv_adjusment_detail';
		$criteria=" WHERE";
		$inner='
			INNER JOIN inv_gin G ON G.gin_id=M.gin_id
				';
		$criteria.=" M.adjusment_id=".$adjusment_id." ";
		
		$orderBy=' ORDER BY G.gin_code ';
		if($direction == null)
			$direction='DESC';
		$total=_this()->query->row("SELECT count(adjusment_detail_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
		$res=_this()->query->result("SELECT M.adjusment_detail_id AS i,G.gin_code AS f1,G.in_date AS f2,G.batch AS f3,
			G.expire_date AS f4,G.general_price AS f5,M.qty AS f6
					FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
		_data($res)->setTotal($total->total);
	}else{
		_data(array())->setTotal(0);
	}
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
	$unit_id=getSetting('INV_STOK_INFO','UNIT_ID',false,'Unit');
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner='	INNER JOIN inv_measurement SAT_B ON SAT_B.measurement_id=M.measurement_buy
				INNER JOIN inv_item_measurement IM ON IM.item_id=M.item_id AND IM.storage_flag=1
				INNER JOIN inv_measurement SAT_S ON SAT_S.measurement_id=M.measurement_storage
			';
	$criteria.="  M.active_flag=true AND M.tenant_id="._session()->tenant_id." AND M.item_type='ITEMTYPE_BARANG' ";
	if($code != null && $code !='')
		$criteria.=" AND upper(item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(item_name) like upper('%".$name."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(description) like upper('%".$desc."%')";
	if($type != null && $type !='')
		$criteria.=" AND item_type='".$type."'";
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
		default:
		   	$orderBy.='item_name '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(item_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT M.item_id AS i,item_code AS f1,item_name AS f2,description AS f3, 
	(SELECT S.stock FROM inv_stock S WHERE S.tenant_id=M.tenant_id AND S.item_id=M.item_id AND S.unit_id=".$unit_id.")/IM.fraction AS f4
	,M.active_flag AS f5,SAT_S.measurement_name AS f6,SAT_B.measurement_name AS f7,
	IFNULL((SELECT SUM(S.qty) FROM inv_gin S WHERE S.tenant_id=M.tenant_id AND S.item_id=M.item_id AND S.unit_id=".$unit_id." AND S.qty),0)/IM.fraction AS f8
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function delete(){
	$pid= _post('i');
	$tenant_id= _session()->tenant_id;
	$unit_id=getSetting('INV_STOK_INFO','UNIT_ID',false,'Unit');
	_this()->query->start();
	$res=  _this()->query->result("SELECT (G.qty-D.qty) AS qty_gin,G.gin_id,G.gin_code,G.item_id,D.qty
		FROM inv_adjusment_detail D
		INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		WHERE adjusment_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$o=$res[$i];
		$obj= _this()->query->row("SELECT S.stock,S.stock_id FROM inv_stock S WHERE S.tenant_id=".$tenant_id." AND S.unit_id=".$unit_id." AND item_id=".$o->item_id);
		if($o->qty_gin>=0){
			$arr=array();
			$arr['qty']=$o->qty_gin;
			_this()->db->where('gin_id',$o->gin_id);
			_this()->db->update('inv_gin',$arr);
		}else{
			_this()->query->back();
			_error_message("Kode Gin '".$o->gin_code."' Minus, Tidak Dapat dihapus.")->end();
		}
		if(($obj->stock-$o->qty)>=0){
			$arr=array();
			$arr['stock']=$obj->stock-$o->qty;
			_this()->db->where('stock_id',$obj->stock_id);
			_this()->db->update('inv_stock',$arr);
		}else{
			_this()->query->back();
			_error_message("Stok Minus, Tidak Dapat dihapus.")->end();
		}
	}	
	_this()->query->set("DELETE FROM inv_adjusment WHERE adjusment_id=".$pid);
	_this()->query->end();
	_message("History Berhasil diHapus.");
}