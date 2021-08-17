<?php
function getListItem(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$type=_get('f4',false);
	$active=_get('f5',false);
	$gin=_get('f6',false);
	$batch=_get('f7',false);
	$no_terima=_get('f8',false);
	$unit_id=_get('unit_id');
	$now=new DateTime();
		$entity=' inv_gin';
		$criteria=" WHERE";
		$inner='	INNER JOIN inv_item ITEM ON ITEM.item_id=M.item_id
					INNER JOIN inv_item_measurement IM ON IM.item_id=ITEM.item_id AND IM.sell_flag=1
					INNER JOIN inv_receive_detail RECD ON RECD.gin_id=M.gin_id
					INNER JOIN inv_receive REC ON REC.receive_id=RECD.receive_id
					INNER JOIN inv_measurement SAT_S ON SAT_S.measurement_id=ITEM.measurement_sell
					INNER JOIN inv_stock S ON S.item_id=ITEM.item_id AND S.tenant_id=ITEM.tenant_id AND S.unit_id='.$unit_id.'
				';
		$criteria.="  M.tenant_id="._this()->pagesession->get()->tenant_id;//REC.unit_id=".$unit_id." AND
		$criteria.=" AND M.qty>0 AND M.unit_id=".$unit_id." ";
		if($code != null && $code !='')
			$criteria.=" AND upper(ITEM.item_code) like upper('%".$code."%')";
		if($name != null && $name !='')
			$criteria.=" AND upper(ITEM.item_name) like upper('%".$name."%')";
		if($no_terima != null && $no_terima !='')
			$criteria.=" AND upper(REC.receive_number) like upper('%".$no_terima."%')";
		if($desc != null && $desc !='')
			$criteria.=" AND upper(ITEM.description) like upper('%".$desc."%')";
		if($batch != null && $batch !='')
			$criteria.=" AND upper(M.batch) like upper('%".$batch."%')";
		if($gin != null && $gin !='')
			$criteria.=" AND upper(M.gin_code) like upper('%".$gin."%')";
		if($type != null && $type !='')
			$criteria.=" AND ITEM.item_type='".$type."'";
		if($active != null && $active !=''){
			if($active=='Y')
				$criteria.=' AND ITEM.active_flag=true ';
			else
				$criteria.=' AND ITEM.active_flag=false ';
		}
		
		$orderBy=' ORDER BY ITEM.item_code ASC,CASE WHEN M.in_date IS NULL THEN 1 ELSE 0 END DESC, M.expire_date ASC,M.in_date DESC, RECD.create_on DESC';
		$total=_this()->query->row("SELECT COUNT(X.item_code) AS total FROM(SELECT ITEM.item_code FROM ".$entity." M  ".$inner." ".$criteria." GROUP BY M.gin_code)X");
		$res=_this()->query->result("SELECT ITEM.item_id AS i,M.gin_id AS gin_id,CONCAT(ITEM.item_code,' - ',ITEM.item_name) as name,
			(M.qty-M.qty_out)/IM.fraction AS stock,IM.fraction AS frac
			,ITEM.active_flag AS a,SAT_S.measurement_name AS sat_s,
			M.in_date AS tgl,M.gin_code AS gin,REC.receive_number AS terima,RECD.buy_price/RECD.fraction AS harga,RECD.batch,
			CASE WHEN M.expire_flag=1 THEN M.expire_date ELSE '' END AS expire
					FROM ".$entity." M ".$inner." ".$criteria." GROUP BY M.gin_code  ".$orderBy.' LIMIT '.$size.' OFFSET '.$first.' ');
		_data($res)->setTotal($total->total);
}
function loadMeasurementByItem(){
	$pid=_get('i');
	$res=_this()->query->result('SELECT M1.measurement_id AS id,M1.measurement_name AS text, M.fraction AS f1 FROM inv_item_measurement M 
				INNER JOIN inv_measurement M1 ON M1.measurement_id=M.measurement_id WHERE item_id='.$pid);
	_data($res);
}
function getInitItem(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT MEA.measurement_id AS f1,MEA.measurement_name AS f2 FROM inv_item M 
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_sell
		WHERE M.item_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT M.retur_on,M.posted,M.retur_number,
		description
		FROM inv_retur_receive M
		WHERE retur_receive_id=".$pid);

	$oriList= _this()->query->result("SELECT 
		M.gin_id,GIN.gin_code,M.retur_receive_detail_id,ITM.item_id,CONCAT(ITM.item_code,' - ',ITM.item_name) AS item_name,
		SAT.measurement_name,
		SAT.measurement_id,CASE WHEN (((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 THEN (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) ELSE 0 END))<=0 THEN 0 ELSE (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) END AS qty,(((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 THEN (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) ELSE 0 END))AS qty_sisa,
		M.price,CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END AS fraction,M.description,(D.buy_price/D.fraction) AS buy_price,
		(GIN.qty-GIN.qty_out)+CASE WHEN P.posted=1 THEN M.qty ELSE 0 END AS sisa
		FROM inv_retur_receive_detail M
		INNER JOIN inv_retur_receive P ON P.retur_receive_id=M.retur_receive_id
		INNER JOIN inv_gin GIN ON GIN.gin_id=M.gin_id
		INNER JOIN inv_receive_detail D ON D.gin_id=GIN.gin_id
		INNER JOIN inv_item ITM ON ITM.item_id=GIN.item_id
		INNER JOIN inv_measurement SAT ON SAT.measurement_id=M.measurement_id
		
		WHERE M.retur_receive_id=".$pid." ORDER BY M.line ASC");
	if($ori){
		$data=array();
		$data['o']=$ori;
		$data['l']=$oriList;
		_data($data);
	}else
		_not_found();
}
function getDetail(){
	$pid=_get('i');
	$res=_this()->query->result("SELECT CONCAT(ITM.item_code,' - ',ITM.item_name) AS item_name,GIN.gin_code,R.receive_number,SAT.measurement_name,
		M.qty/M.fraction AS qty,
		M.price,M.description
		FROM inv_retur_receive_detail M
		INNER JOIN inv_gin GIN ON GIN.gin_id=M.gin_id
		INNER JOIN inv_receive_detail D ON D.gin_id=GIN.gin_id
		INNER JOIN inv_receive R ON R.receive_id=D.receive_id
		INNER JOIN inv_item ITM ON ITM.item_id=GIN.item_id
		INNER JOIN inv_measurement SAT ON SAT.measurement_id=M.measurement_id
		WHERE M.retur_receive_id=".$pid." ORDER BY M.line ASC");
		echo "<style>
			*{
				font-size: 12px;
				font: normal 11px/13px tahoma,arial,verdana,sans-serif;
			}
			table, th, td {
				border: 1px solid black;
				padding: 2px 5px;
			}
			th{
				font-weight: bold;
			}
			table {
				border-collapse: collapse;
			}
			body, html{
				height: min-content;
			}
		</style>
		";
		echo "<table><thead><tr><th>NO</th><th>BARANG</th><th>GIN</th><th>NO. TERIMA</th><th>SATUAN</th><th>QTY</th><th>HARGA</th><th>DESKRIPSI</th></tr><thead>";
		for($i=0,$iLen=count($res); $i<$iLen;$i++){
			$obj=$res[$i];
			echo "<tr><td>".($i+1)."</td><td>".$obj->item_name."</td><td>".$obj->gin_code."</td><td>".$obj->receive_number."</td><td>".$obj->measurement_name."</td><td>".$obj->qty."</td><td>".$obj->price."</td><td>".$obj->description."</td></tr>";
		}
		echo "</table>";
		//echo json_encode($res);
	return false;
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$no_retur=_get('f1',false);
	$tglRetur_awal=_get('f2',false);
	$tglRetur_akhir=_get('f3',false);
	$namaVendor=_get('f6',false);
	$noTerima=_get('f7',false);
	$posted=_get('f8',false);
	$keterangan=_get('f14',false);
	$unit_id=_get('unit_id');
	$entity=' inv_retur_receive ';
	$criteria=" WHERE";
	$inner='
			INNER JOIN inv_retur_receive_detail DE ON DE.retur_receive_id=M.retur_receive_id
			INNER JOIN inv_receive_detail D ON D.gin_id=DE.gin_id
			INNER JOIN inv_receive P ON P.receive_id=D.receive_id
			INNER JOIN inv_distributor PART ON PART.distributor_id=P.distributor_id';
	$criteria.=" ";
	$criteria.=" M.unit_id=".$unit_id." AND M.tenant_id="._this()->pagesession->get()->tenant_id;
	if($posted != null && $posted !=''){
		if($posted=='Y')
			$criteria.=' AND M.posted=true ';
		else
			$criteria.=' AND M.posted=false ';
	}
	if($no_retur != null && $no_retur !='')
		$criteria.=" AND upper(retur_number) like upper('%".$no_retur."%')";
	if($noTerima != null && $noTerima !='')
		$criteria.=" AND upper(P.receive_number) like upper('%".$noTerima."%')";
	if($keterangan != null && $keterangan !='')
		$criteria.=" AND upper(M.description) like upper('%".$keterangan."%')";
	if($tglRetur_awal !== null && $tglRetur_awal !==''){
		$criteria.=" AND retur_on >='". $tglRetur_awal->format('Y-m-d') ."'";
	}
	if($tglRetur_akhir !== null && $tglRetur_akhir !==''){
		$criteria.=" AND retur_on <='". $tglRetur_akhir->format('Y-m-d') ."'";
	}
	if($namaVendor != null && $namaVendor !=''){
		$criteria.=" AND upper(PART.distributor_name) like upper('%".$namaVendor."%')";
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "f1":
			$orderBy.='M.retur_number '.$direction;
			break;
		default:
		   	$orderBy.='M.retur_number '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT COUNT(X.retur_receive_id) AS total FROM(SELECT M.retur_receive_id FROM ".$entity." M  ".$inner." ".$criteria. " GROUP BY M.retur_receive_id)X ");
	$res=_this()->query->result("SELECT M.retur_receive_id AS i,retur_number AS f1,retur_on AS f2,M.description AS f3,M.posted AS f5 FROM ".$entity." M ".$inner." ".$criteria." GROUP BY M.retur_receive_id ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_jual=_post('f1');
	$tgl_jual=_post('f2');
	$keterangan=_post('f3');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$satuan=_post('sat');
	$qty=_post('qty');
	$fraction=_post('fraction');
	$gin=_post('gin_id');
	$note=_post('note');
	$harga=_post('harga');

	$now=new DateTime();
	$add=false;
	$par=array();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	$posting=false;
	if($no_jual==null || $no_jual==''){
		$codenya=_this()->lib_sequence->get('NO_RETUR_VENDOR');
		$no_jual=$codenya['val'];
		$pid=_this()->lib_table_sequence->get('inv_retur_receive');
		$add=true;
		$par['retur_receive_id']=$pid;
		$par['tenant_id']=_this()->pagesession->get()->tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['retur_number']=$no_jual;
		$par['posted']=0;
		$par['retur_on']=$tgl_jual->format('Y-m-d H:i:s');
	} 
	$par['description']=$keterangan;
	if($add==true){
		$par['create_by']=_this()->pagesession->get()->employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_retur_receive',$par);
	}else{
		$par['update_by']=_this()->pagesession->get()->employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		$post= _this()->query->row("SELECT posted FROM inv_retur_receive WHERE retur_receive_id=".$pid);
		if($post->posted==1){
			$posting=true;
		}
		_this()->db->where('retur_receive_id',$pid);
		_this()->db->update('inv_retur_receive',$par);
	}
	$res= _this()->query->result("SELECT retur_receive_detail_id FROM inv_retur_receive_detail WHERE retur_receive_id=".$pid);
	$line=1;
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->retur_receive_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					if($posting==false){
						$par['measurement_id']=$satuan[$j];
						$par['gin_id']=$gin[$j];
						$par['fraction']=$fraction[$j];
						$par['qty']=$qty[$j]*$fraction[$j];
						$par['price']=$harga[$j];
					}
					$par['description']=$note[$j];
					$par['line']=$line;
					$line++;
					$par['update_by']=_this()->pagesession->get()->employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('retur_receive_detail_id',$detail_id[$j]);
					_this()->db->update('inv_retur_receive_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_retur_receive_detail WHERE retur_receive_detail_id=".$res[$i]->retur_receive_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			_load('lib/lib_table_sequence');
			$par['retur_receive_detail_id']=_this()->lib_table_sequence->get('inv_retur_receive_detail');
			$arrId[]=$par['retur_receive_detail_id'];
			$par['retur_receive_id']=$pid;
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j]*$fraction[$j];
			$par['price']=$harga[$j];
			$par['fraction']=$fraction[$j];
			$par['description']=$note[$j];
			$par['gin_id']=$gin[$j];
			$par['line']=$line;
			$line++;
			$par['create_by']=_this()->pagesession->get()->employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_retur_receive_detail',$par);
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual));
	_message_save('Nomor Retur', $no_jual );
}
function posting(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_jual=_post('f1');
	$tgl_jual=_post('f2');
	$keterangan=_post('f3');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$satuan=_post('sat');
	$qty=_post('qty');
	$fraction=_post('fraction');
	$gin=_post('gin_id');
	$note=_post('note');
	$harga=_post('harga');

	$now=new DateTime();
	$add=false;
	$par=array();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	$posting=false;
	if($no_jual==null || $no_jual==''){
		$codenya=_this()->lib_sequence->get('NO_RETUR_VENDOR');
		$no_jual=$codenya['val'];
		$pid=_this()->lib_table_sequence->get('inv_retur_receive');
		$add=true;
		
		$par['retur_receive_id']=$pid;
		$par['tenant_id']=_this()->pagesession->get()->tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['retur_number']=$no_jual;
	} 
	$par['posted']=1;
	$par['retur_on']=$tgl_jual->format('Y-m-d H:i:s');
	$par['description']=$keterangan;
	if($add==true){
		$par['create_by']=_this()->pagesession->get()->employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_retur_receive',$par);
	}else{
		$par['update_by']=_this()->pagesession->get()->employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		$post= _this()->query->row("SELECT posted FROM inv_retur_receive WHERE retur_receive_id=".$pid);
		if($post->posted==1){
			$posting=true;
		}
		_this()->db->where('retur_receive_id',$pid);
		_this()->db->update('inv_retur_receive',$par);
	}
	$res= _this()->query->result("SELECT retur_receive_detail_id FROM inv_retur_receive_detail WHERE retur_receive_id=".$pid);
	$line=1;
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->retur_receive_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					if($posting==false){
						$par['measurement_id']=$satuan[$j];
						$par['gin_id']=$gin[$j];
						$par['fraction']=$fraction[$j];
						$par['qty']=$qty[$j]*$fraction[$j];
						$par['price']=$harga[$j];
					}
					$par['description']=$note[$j];
					$par['line']=$line;
					$line++;
					$par['update_by']=_this()->pagesession->get()->employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('retur_receive_detail_id',$detail_id[$j]);
					_this()->db->update('inv_retur_receive_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_retur_receive_detail WHERE retur_receive_detail_id=".$res[$i]->retur_receive_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			_load('lib/lib_table_sequence');
			$par['retur_receive_detail_id']=_this()->lib_table_sequence->get('inv_retur_receive_detail');
			$arrId[]=$par['retur_receive_detail_id'];
			$par['retur_receive_id']=$pid;
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j]*$fraction[$j];
			$par['price']=$harga[$j];
			$par['fraction']=$fraction[$j];
			$par['description']=$note[$j];
			$par['gin_id']=$gin[$j];
			$par['line']=$line;
			$line++;
			$par['create_by']=_this()->pagesession->get()->employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_retur_receive_detail',$par);
		}
	}
	
	$res= _this()->query->result("SELECT M.gin_id,M.qty,G.item_id,P.unit_id,ITM.item_name FROM inv_retur_receive_detail M 
		INNER JOIN inv_retur_receive P ON P.retur_receive_id=M.retur_receive_id 
		INNER JOIN inv_gin G ON G.gin_id=M.gin_id 
		INNER JOIN inv_item ITM ON ITM.item_id=G.item_id WHERE M.retur_receive_id=".$pid);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$o=$res[$i];
		$arr=array();
		$row= _this()->query->row("SELECT M.qty,M.gin_code FROM inv_gin M WHERE M.gin_id=".$o->gin_id);
		if($row){
			if(($row->qty-$o->qty)<0){
				_this()->query->back();
				_error_message("Kode GIN '".$row->gin_code."' Minus, tidak dapat di posting.")->end();
			}
			$arr['qty']=$row->qty-$o->qty;
			_this()->db->where('gin_id',$o->gin_id);
			_this()->db->update('inv_gin',$arr);
		}else{
			_this()->query->back();
			_error_message("Kode GIN tidak ada, tidak dapat di posting.")->end();
		}
		$row= _this()->query->row("SELECT stock,stock_id FROM inv_stock M WHERE M.tenant_id=".$tenant_id." AND M.item_id=".$o->item_id." AND M.unit_id=".$o->unit_id);
		if($row){
			if(($row->stock-$o->qty)>=0){
				$arr=array();
				$arr['stock']=((double)$row->stock)-((double)$o->qty);
				_this()->db->where('stock_id',$row->stock_id);
				_this()->db->update('inv_stock',$arr);
			}else{
				_this()->query->back();
				_error_message("Stok Barang '". $o->item_name."' kurang dari 0, tidak dapat di posting.")->end();
			}
		}else{
			_this()->query->back();
			_error_message("Stok Barang '". $o->item_name."' tidak ada, tidak dapat di posting.")->end();
		}
	}
	
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual));
	_message("No. Retur '".$no_jual."' Berhasil diPosting.");
}
function unposting(){
	_this()->query->start();
	$pid=_post('i');
	$now=new DateTime();
	$add=false;
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	
	$row=_this()->query->row("SELECT M.posted FROM inv_retur_receive M WHERE M.retur_receive_id=".$pid);
	if($row){
		if($row->posted==0){
			_this()->query->back();
			_error_message('Data Sudah Un Posting.')->end();
		}
	}else{
		_this()->query->back();
		_error_message('Data Tidak Ada.')->end();
	}
	
	$par=array();
	$par['posted']=0;
	$par['update_by']=$employee_id;
	$par['update_on']=$now->format('Y-m-d H:i:s');
	_this()->db->where('retur_receive_id',$pid);
	_this()->db->update('inv_retur_receive',$par);
	$res= _this()->query->result("SELECT M.gin_id,M.qty FROM inv_retur_receive_detail M 
		INNER JOIN inv_gin M1 ON M1.gin_id=M.gin_id 
		INNER JOIN inv_item M2 ON M1.item_id=M2.item_id WHERE M.retur_receive_id=".$pid);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$obj1= _this()->query->row("SELECT G.qty FROM inv_gin G WHERE gin_id=".$res[$i]->gin_id);
		$arr['qty']=$obj1->qty+$res[$i]->qty;
		_this()->db->where('gin_id',$res[$i]->gin_id);
		_this()->db->update('inv_gin',$arr);
	}
	$res= _this()->query->result("SELECT G.item_id,M.qty,M1.unit_id,M2.item_name FROM inv_retur_receive_detail M 
		INNER JOIN inv_retur_receive M1 ON M1.retur_receive_id=M.retur_receive_id 
		INNER JOIN inv_gin G ON G.gin_id=M.gin_id 
		INNER JOIN inv_item M2 ON M2.item_id=G.item_id WHERE M.retur_receive_id=".$pid);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$stok= _this()->query->row("SELECT M.stock,I.min_stok AS min_stock,M.stock_id FROM inv_stock M INNER JOIN inv_item I ON I.item_id=M.item_id 
			WHERE M.tenant_id=".$tenant_id." AND M.item_id=".$res[$i]->item_id." AND M.unit_id=".$res[$i]->unit_id);
		if($stok){
			// if(($stok->stock-$res[$i]->qty)<$stok->min_stock){
				// _this()->query->back();
				// _error_message("Barang '".$res[$i]->item_name."' Kurang Dari Minimal Stok.")->end();
			// }else{
				$par=array();
				$par['stock']=$stok->stock+$res[$i]->qty;
				_this()->db->where('stock_id',$stok->stock_id);
				_this()->db->update('inv_stock',$par);
			// }
		}else{
			_this()->query->back();
			_error_message("Barang '".$res[$i]->item_name."' Tidak Ada.")->end();
		}
	}
	_this()->query->end();
	_message("Berhasil diUnPosting.");
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT retur_number,posted FROM inv_retur_receive WHERE retur_receive_id=".$pid);
	if ($res) {
		if($res->posted==0){
			 _this()->query->set("DELETE FROM inv_retur_receive WHERE retur_receive_id=".$pid);
			_message_delete('No. Retur', $res->retur_number);
		}else{
			_error_message("No. Retur '".$res->retur_number."' sudah Posting, tidak bisa dihapus.");
		}
	}else
		_not_found();
}