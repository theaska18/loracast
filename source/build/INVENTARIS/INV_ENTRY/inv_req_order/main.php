<?php
$menuName='Penerimaan Barang';
function initRun(){
	$res1=_this()->query->result("SELECT * FROM(
		SELECT CONCAT(MONTH(M.receive_on),'/',YEAR(M.receive_on)) AS f1,COUNT(M.receive_id) AS f2 FROM inv_receive M
		WHERE M.posted=1
		GROUP BY CONCAT(MONTH(M.receive_on),'/',YEAR(M.receive_on)) ORDER BY M.receive_on ASC)X LIMIT 12");
	_data(array('l1'=>$res1));
}
function printBarcode(){
	$i=_post('i');
	$dist=_this()->query->row("SELECT G.batch,G.expire_flag,G.expire_date,CONCAT(I.item_name,' - ',I.item_code) AS item FROM inv_gin G 
	INNER JOIN inv_item I ON I.item_id=G.item_id
	WHERE G.gin_code='".$i."'");
	$file=getSetting('INV_REQ_ORDER','LABEL_FILE_NAME',false,'File Label Barcode');
	$show=getSetting('INV_REQ_ORDER','LABEL_PREVIEW',false,'Preview Label');
	$tenant=_this()->query->row("SELECT M.tenant_name FROM app_tenant M 
		WHERE M.tenant_id="._session()->tenant_id);
	// _load('printer');	
	// $printer=_this()->printer;
	// $printer->add('*'.$i.'*');
	// $dua="";
	// if($dist->batch != null && $dist->batch !=''){
		// $dua="Batch. ".$dist->batch;
	// }
	
	// $expire='';
	// if($dist->expire_flag==1){
		// if($dua !=''){
			// $dua.='/';
		// }
		// $exp=new DateTime($dist->expire_date);
		// $dua.="Exp. ".$exp->format('d M Y');
	// }
	// $printer->add($dua);
	// $printer->add($tenant->tenant_name);
	// $printer->add($dist->item);
	// $printer->add($i);
	// $printer->code='BARCODE';
	// $printer->description='Print Label GIN. \nNo : '.$i;
	// $printer->report=$file;
	// $printer->view=$show;
	// $printer->send();
	
	
	
	_load('printer');	
	$printer=_this()->printer;
	$printer->set('0',$i);
	$dua="";
	if($dist->batch != null && $dist->batch !=''){
		$dua="Batch. ".$dist->batch;
	}
	
	$expire='';
	if($dist->expire_flag==1){
		if($dua !=''){
			$dua.='/';
		}
		$exp=new DateTime($dist->expire_date);
		$dua.="Exp. ".$exp->format('d M Y');
	}
	$printer->set('1',$dua);
	$printer->set('2',$tenant->tenant_name);
	$printer->set('3',$dist->item);
	$printer->set('4',$i);;
	$printer->PRINT_CODE='BARCODE_ITEM';
	$printer->LIST=array('a');
	$printer->DESCRIPTION='Print Barcode. No : '.$i;
	$printer->TEMPLATE=$file;
	$printer->VIEW=$show;
	_data($printer->create());
}
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
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner='	INNER JOIN app_parameter_option TYPE ON TYPE.option_code=M.item_type 
				INNER JOIN inv_measurement SAT_B ON SAT_B.measurement_id=M.measurement_buy
				INNER JOIN inv_measurement SAT_K ON SAT_K.measurement_id=M.measurement_small
			';
	$criteria.="  M.active_flag=true AND M.item_type='ITEMTYPE_BARANG' AND M.tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(item_name) like upper('%".$name."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='item_name '.$direction;
			break;
		case "f3":
			$orderBy.='description '.$direction;
			break;
		case "f4":
			$orderBy.='item_type '.$direction;
			break;
		default:
		   	$orderBy.='item_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(item_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT item_id AS i,CONCAT(item_name,' - ',item_code) as name,
		SAT_B.measurement_name AS mou,description AS description,
		(SELECT S.stock FROM inv_stock S WHERE S.tenant_id=M.tenant_id AND S.item_id=M.item_id AND S.unit_id=".getSetting('INV_REQ_ORDER','UNIT_ID',false,'Unit').") AS stock,
		(SELECT S.buy_price FROM inv_receive_detail S
			INNER JOIN inv_receive R ON R.receive_id=S.receive_id
			WHERE R.tenant_id=M.tenant_id AND S.item_id=M.item_id AND R.posted=1 ORDER BY R.receive_on DESC, S.create_on DESC limit 1) AS harga,
		M.active_flag AS a,SAT_K.measurement_name AS sat_k
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function getListVendor(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$type=_get('f3',false);
	$alamat=_get('f6',false);
	$negara=_get('f7',false);
	$prov=_get('f8',false);
	$kota=_get('f9',false);
	$pak=_get('f14',false);
	$fax=_get('f16',false);
	$entity=' inv_distributor ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_distributor_type A ON M.distributor_type=A.distributor_type_id
			';
	$criteria.=" M.active_flag=true AND M.tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(distributor_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(distributor_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND M.distributor_type=".$type;
	if($pak != null && $pak !='')
		$criteria.=" AND upper(no_pak) like upper('%".$pak."%')";
	if($fax != null && $fax !='')
		$criteria.=" AND upper(fax) like upper('%".$fax."%')";
	if($alamat != null && $alamat !='')
		$criteria.=" AND upper(address) like upper('%".$alamat."%')";
	if($negara != null && $negara !='')
		$criteria.=" AND upper(country) like upper('%".$negara."%')";
	if($prov != null && $prov !='')
		$criteria.=" AND upper(province) like upper('%".$prov."%')";
	if($kota != null && $kota !='')
		$criteria.=" AND upper(city) like upper('%".$kota."%')";
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='distributor_name '.$direction;
			break;
		case "f3": 
			$orderBy.='A.distributor_type_name '.$direction;
			break;
		case "f4": 
			$orderBy.='M.pic '.$direction;
			break;
		case "f5": 
			$orderBy.='M.email '.$direction;
			break;
		case "f6": 
			$orderBy.='M.address '.$direction;
			break;
		case "f7": 
			$orderBy.='M.country '.$direction;
			break;
		case "f8": 
			$orderBy.='M.province '.$direction;
			break;
		case "f9": 
			$orderBy.='M.city '.$direction;
			break;
		case "f10": 
			$orderBy.='M.districts '.$direction;
			break;
		case "f11": 
			$orderBy.='M.keluarahan '.$direction;
			break;
		case "f14": 
			$orderBy.='M.no_pak '.$direction;
			break;
		default:
		   	$orderBy.='distributor_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(distributor_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT distributor_id AS i,CONCAT(distributor_name,' - ',distributor_code) as name,A.distributor_type_name AS type,
		M.email,M.address,M.active_flag AS a
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
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
	$criteria.=" M.unit_id=".getSetting('INV_REQ_ORDER','UNIT_ID',false,'Unit')." AND M.order_flag=1 AND M.tenant_id="._session()->tenant_id;
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
	$sequenceCode=getSetting('INV_REQ_ORDER','SEQUENCE_CODE',false,'Nomor Penerimaan');
	$unitId=(double)getSetting('INV_REQ_ORDER','UNIT_ID',false,'Unit');
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
	$par['order_flag']=1;
	$par['materai']=$materai;
	$par['tot_sub']=$all_jumlah;
	$par['tot_discount']=$all_diskon;
	$par['tot_ppn']=$all_ppn;
	$par['tot']=$total;
	if($add==true){
		setNotification('Penerimaan','Terdapat Penerimaan Baru, No. Penerimaan : '.$no_terima,'INV_REQ_ORDER');
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
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT receive_number,posted FROM inv_receive WHERE receive_id=".$pid);
	if ($res) {
		if($res->posted==0){
			 _this()->query->set("DELETE FROM inv_receive WHERE receive_id=".$pid);
			_message_delete('No. Terima', $res->receive_number);
		}else{
			_error_message("No. Terima '".$res->receive_number."' sudah Posting, tidak bisa dihapus.");
		}
	}else
		_not_found();
}