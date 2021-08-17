<?php
function loadMeasurementByItem(){
	$pid=_get('i');
	$res=_this()->query->result('SELECT M1.measurement_id AS id,M1.measurement_name AS text, M.fraction AS f1 FROM inv_item_measurement M 
				INNER JOIN inv_measurement M1 ON M1.measurement_id=M.measurement_id WHERE item_id='.$pid);
	_data($res);
}
function loadMeasurementByUpdate(){
	$pid=_get('i');
	$frac=_get('frac');
	$mou=_get('mou');
	$res=_this()->query->result('SELECT x.id,x.text,f1 FROM(SELECT M1.measurement_id AS id,M1.measurement_name AS text, M.fraction AS f1 FROM inv_item_measurement M
		INNER JOIN inv_measurement M1 ON M1.measurement_id=M.measurement_id WHERE item_id='.$pid.' 
		UNION
		SELECT measurement_id AS id, measurement_name AS TEXT,'.$frac.' AS f1 FROM inv_measurement WHERE measurement_id='.$mou.'
		)x
		GROUP BY x.id,x.text
		ORDER BY x.text ASC');
	_data($res);
}
function getListItem(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$active=_get('f5',false);
	$gin=_get('f6',false);
	$batch=_get('f7',false);
	$unit_id=getSetting('INV_DIST_UNIT','UNIT_ID');
	$now=new DateTime();
	$entity=' inv_gin';
	$criteria=" WHERE";
	$inner='	INNER JOIN inv_item ITEM ON ITEM.item_id=M.item_id
				INNER JOIN inv_item_measurement IM ON IM.item_id=ITEM.item_id AND IM.sell_flag=1
				LEFT JOIN inv_receive_detail RECD ON RECD.gin_id=M.gin_id
				LEFT JOIN inv_receive REC ON REC.receive_id=RECD.receive_id
				LEFT JOIN inv_measurement SAT_S ON SAT_S.measurement_id=ITEM.measurement_sell
				LEFT JOIN inv_stock S ON S.item_id=ITEM.item_id AND S.tenant_id=ITEM.tenant_id AND S.unit_id='.$unit_id.'
				LEFT JOIN inv_stock_price_measurement SPM ON SPM.stock_id=S.stock_id AND SPM.measurement_id=ITEM.measurement_sell
			';
	$criteria.="  M.tenant_id="._session()->tenant_id;
	$criteria.=" AND M.qty>0 AND M.unit_id=".$unit_id." AND ITEM.item_type='ITEMTYPE_BARANG' ";
	if($code != null && $code !='')
		$criteria.=" AND upper(ITEM.item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(ITEM.item_name) like upper('%".$name."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(ITEM.description) like upper('%".$desc."%')";
	if($batch != null && $batch !='')
		$criteria.=" AND upper(M.batch) like upper('%".$batch."%')";
	if($gin != null && $gin !='')
		$criteria.=" AND upper(M.gin_code) like upper('%".$gin."%')";
	
	$orderBy=' ORDER BY ITEM.item_code ASC,CASE WHEN M.in_date IS NULL THEN 1 ELSE 0 END DESC, M.expire_date ASC,M.in_date DESC, RECD.create_on DESC';
	$total=_this()->query->row("SELECT COUNT(X.item_code) AS total FROM(SELECT ITEM.item_code FROM ".$entity." M  ".$inner." ".$criteria." GROUP BY M.gin_code)X");
	$res=_this()->query->result("SELECT ITEM.item_id AS i,M.gin_id AS gin_id,CONCAT(ITEM.item_name,' - ',ITEM.item_code) as name,
		(M.qty-M.qty_out)/IM.fraction AS stock,IM.fraction AS frac,
		ITEM.active_flag AS a,SAT_S.measurement_name AS sat_s,
		M.in_date AS tgl,M.gin_code AS gin,CASE WHEN M.in_date IS NOT NULL THEN REC.receive_number ELSE '(REAL)' END AS terima,
		CASE WHEN M.expire_flag=1 THEN M.expire_date ELSE '' END AS expire
				FROM ".$entity." M ".$inner." ".$criteria." GROUP BY M.gin_code  ".$orderBy.' LIMIT '.$size.' OFFSET '.$first.' ');
	_data($res)->setTotal($total->total);
}

function getInitItem(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT M.measurement_buy AS f1,BUY.fraction AS f2,SMALL_MEA.measurement_name AS f3,M.expire_alert AS f4,SMALL_MEA.measurement_id AS f5,
		M.measurement_sell AS f6,SELL.fraction AS f7 FROM inv_item M 
		INNER JOIN inv_item_measurement BUY ON BUY.item_id=M.item_id AND BUY.buy_flag=1
		INNER JOIN inv_item_measurement SELL ON SELL.item_id=M.item_id AND SELL.sell_flag=1
		INNER JOIN inv_measurement SMALL_MEA ON SMALL_MEA.measurement_id=M.measurement_small
		WHERE M.item_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}

function getInitItemByBarcode(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT M.item_id AS i,CONCAT(M.item_code,' - ',M.item_name) AS item,M.measurement_buy AS f1,BUY.fraction AS f2,SMALL_MEA.measurement_name AS f3,M.expire_alert AS f4,SMALL_MEA.measurement_id AS f5,
		M.measurement_sell AS f6,SELL.fraction AS f7, 
		(SELECT S.buy_price FROM inv_receive_detail S
			INNER JOIN inv_receive R ON R.receive_id=S.receive_id
			WHERE R.tenant_id=M.tenant_id AND S.item_id=M.item_id AND R.posted=1 ORDER BY R.receive_on DESC, S.create_on DESC limit 1) AS harga
		FROM inv_item M 
		INNER JOIN inv_item_measurement BUY ON BUY.item_id=M.item_id AND BUY.buy_flag=1
		INNER JOIN inv_item_measurement SELL ON SELL.item_id=M.item_id AND SELL.sell_flag=1
		INNER JOIN inv_measurement SMALL_MEA ON SMALL_MEA.measurement_id=M.measurement_small
		WHERE M.tenant_id="._session()->tenant_id." AND M.barcode=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT receive_on,due_date,posted,M.distributor_id,CONCAT(DIS.distributor_name,' - ',DIS.distributor_code) AS vendor,materai,description
		FROM inv_receive M
		INNER JOIN inv_distributor DIS ON DIS.distributor_id=M.distributor_id
		WHERE receive_id=".$pid);
	$oriList= _this()->query->result("SELECT receive_detail_id,ITM.item_id,CONCAT(ITM.item_name,' - ',ITM.item_code) AS item_name,M.measurement_id,M.qty,M.fraction,
		SAT.measurement_name,buy_price,disc,disc_price,ppn,M.expire_date,M.batch,M.expire_flag,(IFNULL(GIN.qty,(M.qty*M.fraction))-(M.qty*M.fraction)) AS qty_out,GIN.gin_code
		FROM inv_receive_detail M
		INNER JOIN inv_item ITM ON ITM.item_id=M.item_id
		INNER JOIN inv_measurement SAT ON SAT.measurement_id=ITM.measurement_small
		LEFT JOIN inv_gin GIN ON GIN.gin_id=M.gin_id
		WHERE receive_id=".$pid." ORDER BY M.create_on ASC");
	if($ori){
		$data=array();
		$data['o']=$ori;
		$data['l']=$oriList;
		_data($data);
	}else
		_not_found();
}

function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$no_terima=_get('f1',false);
	$tglTerima_awal=_get('f2',false);
	$tglTerima_akhir=_get('f3',false);
	$jatuhTempo_awal=_get('f4',false);
	$jatuhTempo_akhir=_get('f5',false);
	$namaVendor=_get('f6',false);
	$noSurat=_get('f7',false);
	$posted=_get('f8',false);
	$barang=_get('f9',false);
	$kodeBarang=_get('f10',false);
	$kodeGin=_get('f11',false);
	$entity=' inv_receive ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_distributor DIS ON DIS.distributor_id=M.distributor_id
		LEFT JOIN inv_receive_detail DET ON DET.receive_id=M.receive_id
		LEFT JOIN inv_item I ON I.item_id=DET.item_id
		LEFT JOIN inv_gin G ON G.gin_id=DET.gin_id
			';
	$criteria.=" ";
	$criteria.=" M.unit_id=".getSetting('INV_RCV_VENDOR','UNIT_ID',false,'Unit')." AND M.tenant_id="._session()->tenant_id;
	if($posted != null && $posted !=''){
		if($posted=='Y')
			$criteria.=' AND M.posted=true ';
		else
			$criteria.=' AND M.posted=false ';
	}
	if($no_terima != null && $no_terima !='')
		$criteria.=" AND upper(receive_number) like upper('%".$no_terima."%')";
	if($barang != null && $barang !='')
		$criteria.=" AND upper(I.item_name) like upper('%".$barang."%')";
	if($kodeBarang != null && $kodeBarang !='')
		$criteria.=" AND I.item_code ='".$kodeBarang."'";
	if($kodeGin != null && $kodeGin !='')
		$criteria.=" AND G.gin_code ='".$kodeGin."'";
	if($tglTerima_awal !== null && $tglTerima_awal !==''){
		$criteria.=" AND receive_on >='". $tglTerima_awal->format('Y-m-d') ."'";
	}
	if($tglTerima_akhir !== null && $tglTerima_akhir !==''){
		$criteria.=" AND receive_on <='". $tglTerima_akhir->format('Y-m-d') ."'";
	}
	if($jatuhTempo_awal !== null && $jatuhTempo_awal !==''){
		$criteria.=" AND due_date >='". $jatuhTempo_awal->format('Y-m-d') ."'";
	}
	if($jatuhTempo_akhir !== null && $jatuhTempo_akhir !==''){
		$criteria.=" AND due_date <='". $jatuhTempo_akhir->format('Y-m-d') ."'";
	}
	if($namaVendor != null && $namaVendor !='')
		$criteria.=" AND upper(DIS.distributor_name) like upper('%".$namaVendor."%')";
	if($noSurat != null && $noSurat !='')
		$criteria.=" AND upper(no_surat) like upper('%".$noSurat."%')";
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "f2": 
			$orderBy.='receive_on '.$direction;
			break;
		case "f3":
			$orderBy.='due_date '.$direction;
			break;
		case "f4":
			$orderBy.='DIS.distributor_name '.$direction;
			break;
		default:
		   	$orderBy.='receive_number '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT COUNT(X.receive_id) AS total FROM(SELECT M.receive_id FROM ".$entity." M  ".$inner." ".$criteria. " GROUP BY M.receive_id)X ");
	$res=_this()->query->result("SELECT M.receive_id AS i,receive_number AS f1,receive_on AS f2,due_date AS f3,DIS.distributor_name AS f4,posted AS f5,no_surat AS f6
				FROM ".$entity." M ".$inner." ".$criteria."  GROUP BY M.receive_id ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_terima=_post('f1');
	$tgl_terima=_post('f2');
	$berlaku=_post('f3');
	$vendor=_post('f4');
	$no_surat=_post('f5');
	$keterangan=_post('f6');
	
	$materai=_post('materai');
	$all_ppn=_post('all_ppn');
	$all_diskon=_post('all_diskon');
	$all_jumlah=_post('all_jumlah');
	$total=_post('total');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$satuan=_post('sat');
	$qty=_post('qty');
	$fraction=_post('fraction');
	$harga_beli=_post('harga_beli');
	$discount=_post('discount');
	$discount_rp=_post('discount_rp');
	$ppn=_post('ppn');
	$harga_dasar=_post('harga_dasar');
	$expire_flag=_post('expire_flag');
	$jumlah=_post('jumlah');
	$expired=_post('expired');
	$batch=_post('batch');

	$now=new DateTime();
	$add=false;
	$par=array();
	$sequenceCode=getSetting('INV_RCV_VENDOR','SEQUENCE_CODE',false,'Nomor Penerimaan');
	$unitId=(double)getSetting('INV_RCV_VENDOR','UNIT_ID',false,'Unit');
	if($no_terima==null || $no_terima==''){
		$a=false;
		while($a==false){
			$codenya=_getSequenceById($sequenceCode);
			$res=_this()->query->row("SELECT receive_number FROM inv_receive WHERE receive_number='".$codenya."' AND tenant_id="._session()->tenant_id);
			if(!$res){
				$no_terima=$codenya;
				$a=true;
			}
		}
		$pid=_getTableSequence('inv_receive');
		$add=true;
		$par['receive_id']=$pid;
		$par['tenant_id']=_session()->tenant_id;
		$par['unit_id']=$unitId;
		$par['receive_number']=$no_terima;
		$par['posted']=0;
	} 
	$par['distributor_id']=$vendor;
	$par['receive_on']=$tgl_terima->format('Y-m-d H:i:s');
	$par['due_date']=$berlaku->format('Y-m-d H:i:s');
	$par['description']=$keterangan;
	$par['no_surat']=$no_surat;
	$par['materai']=$materai;
	$par['tot_sub']=$all_jumlah;
	$par['tot_discount']=$all_diskon;
	$par['tot_ppn']=$all_ppn;
	$par['tot']=$total;
	if($add==true){
		setNotification('Penerimaan','Terdapat Penerimaan Baru, No. Penerimaan : '.$no_terima,'INV_RCV_VENDOR');
		$par['create_by']=_session()->employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_receive',$par);
	}else{
		$par['update_by']=_session()->employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('receive_id',$pid);
		_this()->db->update('inv_receive',$par);
	}
	$posting=false;
	$post= _this()->query->row("SELECT posted FROM inv_receive WHERE receive_id=".$pid);
	if($post->posted==1){
		$posting=true;
	}
	$res= _this()->query->result("SELECT receive_detail_id,gin_id FROM inv_receive_detail WHERE receive_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->receive_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					$par['item_id']=$barang[$j];
					$par['measurement_id']=$satuan[$j];
					$par['qty']=$qty[$j];
					$par['fraction']=$fraction[$j];
					$par['buy_price']=$harga_beli[$j];
					$par['general_price']=$harga_dasar[$j];
					$par['disc']=$discount[$j];
					$par['disc_price']=$discount_rp[$j];
					$par['ppn']=$ppn[$j];
					$par['tot']=$jumlah[$j];
					$par['expire_flag']=(int)$expire_flag[$j];
					if($expired[$j] !== null && $expired[$j] !==''){
						$par['expire_date']=$expired[$j];
					}
					$par['batch']=$batch[$j];
					$par['update_by']=_session()->employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('receive_detail_id',$detail_id[$j]);
					_this()->db->update('inv_receive_detail',$par);
					if($posting==true){
						$par=array();
						$par['general_price']=$harga_dasar[$j];
						_this()->db->where('gin_id',$res[$i]->gin_id);
						_this()->db->update('inv_gin',$par);
					}
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_receive_detail WHERE receive_detail_id=".$res[$i]->receive_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			$par['receive_detail_id']=_getTableSequence('inv_receive_detail');
			$arrId[]=$par['receive_detail_id'];
			$par['receive_id']=$pid;
			$par['item_id']=$barang[$j];
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j];
			$par['fraction']=$fraction[$j];
			$par['buy_price']=$harga_beli[$j];
			$par['general_price']=$harga_dasar[$j];
			$par['disc']=$discount[$j];
			$par['disc_price']=$discount_rp[$j];
			$par['ppn']=$ppn[$j];
			$par['tot']=$jumlah[$j];
			$par['expire_flag']=(int)$expire_flag[$j];
			if($expired[$j] !== null && $expired[$j] !==''){
				$par['expire_date']=$expired[$j];
			}
			$par['batch']=$batch[$j];
			$par['create_by']=_session()->employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_receive_detail',$par);
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_terima));
	_message_save('Nomor Penerimaan', $no_terima );
}
function posting(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_terima=_post('f1');
	$tgl_terima=_post('f2');
	$berlaku=_post('f3');
	$vendor=_post('f4');
	$no_surat=_post('f5');
	$keterangan=_post('f6');
	
	$materai=_post('materai');
	$all_ppn=_post('all_ppn');
	$all_diskon=_post('all_diskon');
	$all_jumlah=_post('all_jumlah');
	$total=_post('total');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$satuan=_post('sat');
	$qty=_post('qty');
	$fraction=_post('fraction');
	$harga_beli=_post('harga_beli');
	$discount=_post('discount');
	$discount_rp=_post('discount_rp');
	$ppn=_post('ppn');
	$harga_dasar=_post('harga_dasar');
	$expire_flag=_post('expire_flag');
	$jumlah=_post('jumlah');
	$expired=_post('expired');
	$batch=_post('batch');

	$now=new DateTime();
	$add=false;
	$par=array();
	$tenant_id=_session()->tenant_id;
	$employee_id=_session()->employee_id;
	$sequenceCode=getSetting('INV_RCV_VENDOR','SEQUENCE_CODE',false,'Nomor Penerimaan');
	$sequenceGin=getSetting('INV_RCV_VENDOR','SEQUENCE_GIN',false,'Nomor Gin');
	$unitId=(double)getSetting('INV_RCV_VENDOR','UNIT_ID',false,'Unit');
	if($no_terima==null || $no_terima==''){
		$a=false;
		while($a==false){
			$codenya=_getSequenceById($sequenceCode);
			$res=_this()->query->row("SELECT receive_number FROM inv_receive WHERE receive_number='".$codenya."' AND tenant_id=".$tenant_id);
			if(!$res){
				$no_terima=$codenya;
				$a=true;
			}
		}
		$pid=_getTableSequence('inv_receive');
		$add=true;
		
		$par['receive_id']=$pid;
		$par['tenant_id']=$tenant_id;
		$par['unit_id']=$unitId;
		$par['receive_number']=$no_terima;
		
	} 
	$par['distributor_id']=$vendor;
	$par['posted']=1;
	$par['receive_on']=$tgl_terima->format('Y-m-d H:i:s');
	$par['due_date']=$berlaku->format('Y-m-d H:i:s');
	$par['description']=$keterangan;
	$par['no_surat']=$no_surat;
	$par['materai']=$materai;
	$par['tot_sub']=$all_jumlah;
	$par['tot_discount']=$all_diskon;
	$par['tot_ppn']=$all_ppn;
	$par['tot']=$total;
	if($add==true){
		$par['create_by']=$employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_receive',$par);
	}else{
		$par['update_by']=$employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('receive_id',$pid);
		_this()->db->update('inv_receive',$par);
	}
	$res= _this()->query->result("SELECT receive_detail_id FROM inv_receive_detail WHERE receive_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->receive_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					$par['item_id']=$barang[$j];
					$par['measurement_id']=$satuan[$j];
					$par['qty']=$qty[$j];
					$par['fraction']=$fraction[$j];
					$par['buy_price']=$harga_beli[$j];
					$par['general_price']=$harga_dasar[$j];
					$par['disc']=$discount[$j];
					$par['disc_price']=$discount_rp[$j];
					$par['ppn']=$ppn[$j];
					$par['tot']=$jumlah[$j];
					$par['expire_flag']=(int)$expire_flag[$j];
					if($expired[$j] !== null && $expired[$j] !==''){
						$par['expire_date']=$expired[$j];
					}
					$par['batch']=$batch[$j];
					$par['update_by']=$employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('receive_detail_id',$detail_id[$j]);
					_this()->db->update('inv_receive_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_receive_detail WHERE receive_detail_id=".$res[$i]->receive_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			$par['receive_detail_id']=_getTableSequence('inv_receive_detail');
			$arrId[]=$par['receive_detail_id'];
			$par['receive_id']=$pid;
			$par['item_id']=$barang[$j];
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j];
			$par['fraction']=$fraction[$j];
			$par['buy_price']=$harga_beli[$j];
			$par['general_price']=$harga_dasar[$j];
			$par['disc']=$discount[$j];
			$par['disc_price']=$discount_rp[$j];
			$par['ppn']=$ppn[$j];
			$par['tot']=$jumlah[$j];
			$par['expire_flag']=(int)$expire_flag[$j];
			if($expired[$j] !== null && $expired[$j] !==''){
				$par['expire_date']=$expired[$j];
			}
			$par['batch']=$batch[$j];
			$par['create_by']=$employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_receive_detail',$par);
		}
	}
	$res= _this()->query->result("SELECT receive_detail_id,M.item_id,M.measurement_id,(M.qty*M.fraction) AS qty,M.fraction,
		M.general_price,M.expire_flag,M.expire_date,M1.receive_on,M1.unit_id,M.batch,IFNULL(G.qty,0) AS qty_gin,G.gin_id,G.in_date,I.multi_gin_flag
		FROM inv_receive_detail M 
		INNER JOIN inv_receive M1 ON M1.receive_id=M.receive_id 
		INNER JOIN inv_item I ON I.item_id=M.item_id
		LEFT JOIN inv_gin G ON G.gin_id=M.gin_id
		WHERE M.receive_id=".$pid);
		$arrGinCode=array();
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$o=$res[$i];
		$arr=array();
		$arr['qty']=$o->qty_gin+$o->qty;
		$arr['general_price']=$o->general_price;
		if($o->multi_gin_flag==1){
			$arr['expire_flag']=$o->expire_flag;
			$arr['expire_date']=$o->expire_date;
			$arr['batch']=$o->batch;
			if($o->gin_id == null || $o->gin_id==''){
				$arr['item_id']=$o->item_id;
				$arr['unit_id']=$o->unit_id;
				$arr['tenant_id']=$tenant_id;
				$arr['in_date']=$o->receive_on;
				$arr['gin_id']=_getTableSequence('inv_gin');
				$a=false;
				while($a==false){
					$codenya=_getSequenceById($sequenceGin);
					$res=_this()->query->row("SELECT gin_code FROM inv_gin WHERE gin_code='".$codenya."' AND tenant_id=".$tenant_id);
					if(!$res){
						$gin_code=$codenya;
						$a=true;
					}
				}
				$arrGinCode[]=$gin_code;
				$arr['gin_code']=$gin_code;
				_this()->db->insert('inv_gin',$arr);
				$par=array();
				$par['gin_id']=$arr['gin_id'];
				_this()->db->where('receive_detail_id',$o->receive_detail_id);
				_this()->db->update('inv_receive_detail',$par);
			}else{
				if($o->in_date != null){
					_this()->db->where('gin_id',$o->gin_id);
					_this()->db->update('inv_gin',$arr);
				}else{
					$arr['qty']=$o->qty;
					$arr['item_id']=$o->item_id;
					$arr['unit_id']=$o->unit_id;
					$arr['tenant_id']=$tenant_id;
					$arr['in_date']=$o->receive_on;
					$arr['gin_id']=_getTableSequence('inv_gin');
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
					$arrGinCode[]=$gin_code;
					_this()->db->insert('inv_gin',$arr);
					$par=array();
					$par['gin_id']=$arr['gin_id'];
					_this()->db->where('receive_detail_id',$o->receive_detail_id);
					_this()->db->update('inv_receive_detail',$par);
				}
			}
		}else{
			$ginA= _this()->query->row("SELECT M.qty,M.gin_id,M.gin_code
				FROM inv_gin M 
				WHERE M.item_id=".$o->item_id." AND M.unit_id=".$o->unit_id." AND in_date IS NULL AND M.tenant_id=".$tenant_id);
			if($ginA){
				$arr['qty']=$ginA->qty+$o->qty;
				_this()->db->where('gin_id',$ginA->gin_id);
				_this()->db->update('inv_gin',$arr);
				$arrGinCode[]=$ginA->gin_code;
				// if($o->gin_id == null || $o->gin_id==''){
					$par=array();
					$par['gin_id']=$ginA->gin_id;
					_this()->db->where('receive_detail_id',$o->receive_detail_id);
					_this()->db->update('inv_receive_detail',$par);
				// }
			}else{
				$arr['item_id']=$o->item_id;
				$arr['unit_id']=$o->unit_id;
				$arr['tenant_id']=$tenant_id;
				$arr['gin_id']=_getTableSequence('inv_gin');
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
				$arrGinCode[]=$gin_code;
				_this()->db->insert('inv_gin',$arr);
				$par=array();
				$par['gin_id']=$arr['gin_id'];
				_this()->db->where('receive_detail_id',$o->receive_detail_id);
				_this()->db->update('inv_receive_detail',$par);
			}
		}
		$row= _this()->query->row("SELECT stock,stock_id FROM inv_stock M WHERE M.tenant_id=".$tenant_id." AND M.item_id=".$o->item_id." AND M.unit_id=".$o->unit_id);
		if($row){
			$arr=array();
			$arr['stock']=((double)$row->stock)+((double)$o->qty);
			_this()->db->where('stock_id',$row->stock_id);
			_this()->db->update('inv_stock',$arr);
		}else{
			$arr=array();
			$arr['stock_id']=_getTableSequence('inv_stock');
			$arr['tenant_id']=$tenant_id;
			$arr['item_id']=$o->item_id;
			$arr['unit_id']=$o->unit_id;
			$arr['stock']=((double)$o->qty);
			_this()->db->insert('inv_stock',$arr);
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_terima,'lg'=>$arrGinCode));
	_message("No. Terima '".$no_terima."' Berhasil diPosting.");
}
function unposting(){
	try{
		_this()->query->start();
		$pid=_post('i');
		$now=new DateTime();
		$add=false;
		$tenant_id=_session()->tenant_id;
		$employee_id=_session()->employee_id;
		
		$row=_this()->query->row("SELECT posted FROM inv_receive WHERE receive_id=".$pid);
		if($row){
			if($row->posted==0){
				_this()->query->back();
				_error_message('Data Sudah Posting.')->end();
			}
		}else{
			_this()->query->back();
			_error_message('Data Tidak Ada.')->end();
		}
		$par=array();
		$par['posted']=0;
		$par['update_by']=$employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('receive_id',$pid);
		_this()->db->update('inv_receive',$par);
		$res= _this()->query->result("SELECT M.gin_id,M2.item_name,(M.qty*M.fraction) AS qty_terima FROM inv_receive_detail M 
			INNER JOIN inv_gin M1 ON M1.gin_id=M.gin_id 
			INNER JOIN inv_item M2 ON M.item_id=M2.item_id WHERE M.receive_id=".$pid);
		for($i=0,$iLen=count($res);$i<$iLen;$i++){
			$qgin=_this()->query->row("SELECT qty AS qty_gin  FROM inv_gin WHERE gin_id=".$res[$i]->gin_id);
			if(($qgin->qty_gin-$res[$i]->qty_terima)<0){
				_this()->query->back();
				_error_message("Barang '".$res[$i]->item_name."' Sudah Terpakai, Tidak Bisa di Unposting.")->end();
			}
			_this()->query->set("UPDATE inv_gin SET qty=".($qgin->qty_gin-$res[$i]->qty_terima)." WHERE gin_id=".$res[$i]->gin_id);
		}
		$res= _this()->query->result("SELECT M.item_id,(M.qty*M.fraction) AS qty,M1.unit_id,M2.item_name FROM inv_receive_detail M 
			INNER JOIN inv_receive M1 ON M1.receive_id=M.receive_id 
			INNER JOIN inv_item M2 ON M2.item_id=M.item_id WHERE M.receive_id=".$pid);
		for($i=0,$iLen=count($res);$i<$iLen;$i++){
			$stok= _this()->query->row("SELECT stock,stock_id FROM inv_stock WHERE tenant_id=".$tenant_id." AND item_id=".$res[$i]->item_id." AND unit_id=".$res[$i]->unit_id);
			if($stok){
				if(($stok->stock-$res[$i]->qty)<0){
					_this()->query->back();
					_error_message("Barang '".$res[$i]->item_name."' Kurang Dari 0.")->end();
				}else{
					$par=array();
					$par['stock']=$stok->stock-$res[$i]->qty;
					_this()->db->where('stock_id',$stok->stock_id);
					_this()->db->update('inv_stock',$par);
				}
			}else{
				_this()->query->back();
				_error_message("Barang '".$res[$i]->item_name."' Tidak Ada.")->end();
			}
		}
		_this()->query->end();
		_message("Berhasil diUnPosting.");
	}catch(Exception $e){
		_this()->query->back();
		_error_message("Tidak Dapat dihapus.")->end();
	}
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT receive_number,posted,order_flag FROM inv_receive WHERE receive_id=".$pid);
	if ($res) {
		if($res->posted==0){
			if($res->order_flag==0){
				 _this()->query->set("DELETE FROM inv_receive WHERE receive_id=".$pid);
				_message_delete('No. Terima', $res->receive_number);
			}else{
				_error_message("No. Permintaan '".$res->receive_number."' tidak bisa dihapus.");
			}
		}else{
			_error_message("No. Terima '".$res->receive_number."' sudah Posting, tidak bisa dihapus.");
		}
	}else
		_not_found();
}