<?php
function initRun(){
	$res1=_this()->query->result("SELECT * FROM(
		SELECT CONCAT(MONTH(M.trans_on),'/',YEAR(M.trans_on)) AS f1,COUNT(M.trans_id) AS f2 FROM inv_trans_partners M
		WHERE M.posted=1
		GROUP BY CONCAT(MONTH(M.trans_on),'/',YEAR(M.trans_on)) ORDER BY M.trans_on ASC)X LIMIT 12");
	_data(array('l1'=>$res1));
}
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
	$unit_id=getSetting('INV_STOK_INFO','UNIT_ID');
	$partners_id=_get('partners_id');
	$now=new DateTime();
	if($partners_id!==''){
		$entity=' inv_gin';
		$criteria=" WHERE";
		$inner='	INNER JOIN inv_item ITEM ON ITEM.item_id=M.item_id
					INNER JOIN inv_item_measurement IM ON IM.item_id=ITEM.item_id AND IM.sell_flag=1
					LEFT JOIN inv_receive_detail RECD ON RECD.gin_id=M.gin_id
					LEFT JOIN inv_receive REC ON REC.receive_id=RECD.receive_id
					LEFT JOIN inv_measurement SAT_S ON SAT_S.measurement_id=ITEM.measurement_sell
					LEFT JOIN inv_partners_price P ON P.unit_id='.$unit_id.' AND P.partners_id='.$partners_id.' AND P.item_id=ITEM.item_id 
						AND P.tenant_id=ITEM.tenant_id AND P.measurement_id=ITEM.measurement_sell
					LEFT JOIN inv_stock S ON S.item_id=ITEM.item_id AND S.tenant_id=ITEM.tenant_id AND S.unit_id='.$unit_id.'
					LEFT JOIN inv_stock_price_measurement SPM ON SPM.stock_id=S.stock_id AND SPM.measurement_id=ITEM.measurement_sell
				';
		$criteria.="  M.tenant_id="._session()->tenant_id;
		$criteria.=" AND M.qty>0 AND M.unit_id=".$unit_id." ";
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
		$res=_this()->query->result("SELECT ITEM.item_id AS i,M.gin_id AS gin_id,CONCAT(ITEM.item_name,' - ',ITEM.item_code) as name,
			(M.qty-M.qty_out)/IM.fraction AS stock,IM.fraction AS frac,
			IFNULL(P.price,IFNULL((SELECT PRC.price FROM inv_stock_price PRC WHERE PRC.item_id=ITEM.item_id AND PRC.unit_id=".$unit_id." AND 
				PRC.tenant_id=ITEM.tenant_id AND PRC.start_on<='".$now->format('Y-m-d')."' AND PRC.end_on>='".$now->format('Y-m-d')."' LIMIT 1),IFNULL(SPM.price,0))) AS harga
			,ITEM.active_flag AS a,SAT_S.measurement_name AS sat_s,
			M.in_date AS tgl,M.gin_code AS gin,CASE WHEN M.in_date IS NOT NULL THEN REC.receive_number ELSE '(REAL)' END AS terima,
			CASE WHEN M.expire_flag=1 THEN M.expire_date ELSE '' END AS expire
					FROM ".$entity." M ".$inner." ".$criteria." GROUP BY M.gin_code  ".$orderBy.' LIMIT '.$size.' OFFSET '.$first.' ');
		_data($res)->setTotal($total->total);
	}else{
		_message('Rekana Belum dipilih.');
	}
}
function kwitansi(){
	$pid=_post('i');
	$id=_post('pid');
	$file=_post('file');
	$show=_post('show');
	$row=_this()->query->row("SELECT M.sp_number,M.sp_date,M.due_date,M.trans_code,M.trans_on,
		CONCAT(P.partners_name) AS partners_name FROM inv_trans_partners M 
	INNER JOIN inv_partners P ON P.partners_id=M.partners_id
	WHERE M.payment_id=".$id);
	$det=_this()->query->row("SELECT M.create_on,M.kredit FROM payment_detail M 
	WHERE M.payment_detail_id=".$pid);
	$create_on=new DateTime($det->create_on);
	$dateFaktur=new DateTime($row->trans_on);
	$tenant=_this()->query->row("SELECT M.tenant_name,tenant_desc,address FROM app_tenant M 
		WHERE M.tenant_id="._session()->tenant_id);
	_load('printer');	
	$printer=_this()->printer;
	$printer->add($create_on->format('d M Y'));
	$printer->add($row->partners_name);
	$printer->add($det->kredit);
	$printer->add("Sesuai Faktur No. ".$row->trans_code);
	$printer->add($tenant->tenant_name);
	$printer->add($tenant->tenant_desc);
	$printer->add($tenant->address);
	$printer->code='KWITANSI';
	$printer->description='Print KWITANSI. \nNo : '.$row->trans_code;
	$printer->report=$file;
	$printer->view=$show;
	_data($printer->send());
}
function faktur(){
	$pid=_post('i');
	$id=_post('pid');
	$file=_post('file');
	$show=_post('show');
	$sj="";
	$row=_this()->query->row("SELECT M.sp_number,M.sp_date,M.due_date,M.trans_code,M.trans_on,
		CONCAT(P.partners_name,'\n',P.address) AS partners_name 
		FROM inv_trans_partners M 
	INNER JOIN inv_partners P ON P.partners_id=M.partners_id
	WHERE M.payment_id=".$id);
	$noSjList=_this()->query->result("SELECT P.dist_code
FROM inv_trans_partners M 
INNER JOIN inv_dist_partners P ON P.dist_id=M.dist_id
WHERE M.payment_id=".$id." OR M.payment_id IN(SELECT payment_id FROM payment_detail WHERE payment_id_transfer=".$id.")");
	for($i=0,$iLen=count($noSjList);$i<$iLen;$i++){
		if($sj!=''){
			$sj.=";";
		}
		$sj.=$noSjList[$i]->dist_code;
	}
	$query=_this()->query->result("SELECT CONCAT(I.item_name,CASE WHEN G.batch IS NULL THEN '' ELSE CONCAT(' Batch ',G.batch) END,CASE WHEN G.expire_flag=0 THEN '' ELSE CONCAT(' Exp. ',G.expire_date) END) AS item_name,SUM((D.qty/D.fraction)) AS qty,
	MEA.measurement_name,D.price, 
IFNULL((SELECT PT.percent FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.item_id=D.item_id AND PAI.payment_id=M.payment_id AND PYT.payment_type_code='DISC'),0)
 AS dicount_percent, 
IFNULL((SELECT SUM(PT.kredit) FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.item_id=D.item_id AND (PAI.payment_id=".$id." OR PAI.payment_id IN(SELECT payment_id FROM payment_detail WHERE payment_id_transfer=".$id.")) AND PYT.payment_type_code='DISC'),0)
  AS dicount_price ,
  IFNULL((SELECT SUM(PT.debit) FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.item_id=D.item_id AND (PAI.payment_id=".$id." OR PAI.payment_id IN(SELECT payment_id FROM payment_detail WHERE payment_id_transfer=".$id.")) AND PYT.payment_type_code='PPN'),0)
  AS ppn 
		FROM inv_trans_partners_detail D
		INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		INNER JOIN inv_trans_partners M ON M.trans_id=D.trans_id
		INNER JOIN inv_item I ON I.item_id=D.item_id
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=D.measurement_id
		WHERE
		M.payment_id=".$id." OR M.payment_id IN(SELECT payment_id FROM payment_detail WHERE payment_id_transfer=".$id.") GROUP BY I.item_name, G.gin_code ORDER BY I.item_name");
	$dateFaktur=new DateTime($row->trans_on);
	$tenant=_this()->query->row("SELECT M.tenant_name,tenant_desc,address FROM app_tenant M 
		WHERE M.tenant_id="._this()->pagesession->get()->tenant_id);
	_load('printer');	
	$printer=_this()->printer;
	$printer->set('0',$tenant->tenant_name);
	$printer->set('1',$tenant->tenant_desc);
	$printer->set('2',$tenant->address);
	$printer->set('3',$row->trans_code."\n".$sj);
	$printer->set('4',$dateFaktur->format('d M Y'));
	$printer->set('5',$row->partners_name);
	$printer->set('6',_session()->user_name);
	$printer->set('7',getSetting('INV_SALES','FAKTUR_TTD_NAMA',true));
	$printer->set('8',getSetting('INV_SALES','FAKTUR_NOTE_FOOT',true));
	$printer->set('9',$row->sp_number);
	if($row->sp_date!=null || $row->sp_date!=''){
		$sp_date=new DateTime($row->sp_date);
		$printer->set('10',$sp_date->format('d M Y'));
	}else{
		$printer->set('10','-');
	}
	$dueDate=new DateTime($row->due_date);
	$printer->set('11',$dueDate->format('d M Y'));
	$printer->PRINT_CODE='FAKTUR';
	$printer->LIST=$query;
	$printer->DESCRIPTION='Print Faktur. \nNo : '.$row->trans_code;
	$printer->TEMPLATE='template/Faktur_Penjualan.jrxml';
	$printer->VIEW=getSetting('INV_SALES','FAKTUR_PREVIEW');
	_data($printer->create());
}
function printSj(){
	$i=_post('i');
	$dist=_this()->query->row("SELECT M.dist_id,D.posted FROM inv_trans_partners M 
	INNER JOIN inv_dist_partners D ON D.dist_id=M.dist_id
	WHERE M.trans_id=".$i);
	if($dist != null && $dist->dist_id !==null && $dist->dist_id!=''){
		if($dist->posted==0){
			_error_message("Surat Jalan Di Distribusi Belum di Posting.")->end();
		}
		$pid=$dist->dist_id;
		$file=getSetting('INV_SALES','SJ_URL_REPORT');
		$show=getSetting('INV_SALES','SJ_PREVIEW');
		$row=_this()->query->row("SELECT M.dist_code,M.dist_on,M.send_by,
			CONCAT(P.partners_name,'\n',P.address) AS partners_name FROM inv_dist_partners M 
		INNER JOIN inv_partners P ON P.partners_id=M.partners_id
		WHERE M.dist_id=".$pid);
		$query=_this()->query->result("SELECT CONCAT(I.item_code,' - ',I.item_name,CASE WHEN G.batch IS NULL THEN '' ELSE CONCAT(' Batch. ',G.batch) END,CASE WHEN G.expire_flag=0 THEN '' ELSE CONCAT(' Exp. ',G.expire_date) END) AS barang,
			D.qty/D2.fraction AS qty,MEA.measurement_name,D2.note
			FROM inv_dist_partners_detail D 
			INNER JOIN inv_trans_partners_detail D2 ON D2.trans_detail_id=D.trans_detail_id
			INNER JOIN inv_item I ON I.item_id=D2.item_id
			INNER JOIN inv_gin G ON G.gin_id=D2.gin_id
			INNER JOIN inv_measurement MEA ON MEA.measurement_id = D2.measurement_id
			WHERE D.dist_id=".$pid);
		$dateFaktur=new DateTime($row->dist_on);
		$tenant=_this()->query->row("SELECT M.tenant_name,tenant_desc,address FROM app_tenant M 
			WHERE M.tenant_id="._this()->pagesession->get()->tenant_id);
		_load('printer');	
		$printer=_this()->printer;
		$printer->add($tenant->tenant_name);
		$printer->add($tenant->tenant_desc);
		$printer->add($tenant->address);
		$printer->add($row->dist_code);
		$printer->add($dateFaktur->format('d M Y'));
		$printer->add($row->partners_name);
		$printer->add(_this()->pagesession->get()->user_name);
		$printer->add($row->send_by);
		$printer->code='SURAT_JALAN';
		$printer->value=$query;
		$printer->description='Print Surat Jalan. \nNo : '.$row->dist_code;
		$printer->report=$file;
		$printer->view=$show;
		_data($printer->send());
	}else{
		_error_message("Surat Jalan Tidak Ada.")->end();
	}
}
function getListPartners(){
	_func('PARTNERS','getListSearch');
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
	$ori= _this()->query->row("SELECT M.payment_id,trans_on,M.posted,M.partners_id,
		CONCAT(DIS.partners_code,' - ',DIS.partners_name) AS partners,description,
		due_date,sp_date,sp_number,D.dist_code AS sj_number
		FROM inv_trans_partners M
		INNER JOIN inv_partners DIS ON DIS.partners_id=M.partners_id
		LEFT JOIN  inv_dist_partners D ON D.dist_id=M.dist_id
		WHERE trans_id=".$pid);

	$oriList= _this()->query->result("SELECT 
		(CASE WHEN (((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 then (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) else 0 end))<=0 THEN 0 ELSE (M.qty_dist/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) END)+IFNULL(CASE WHEN P.dist_id IS NOT NULL THEN (SELECT D.qty/M.fraction FROM inv_dist_partners_detail D WHERE D.trans_detail_id=M.trans_detail_id AND D.dist_id=P.dist_id) ELSE 0 END,0) AS qty_dist,
		M.gin_id,GIN.gin_code,trans_detail_id,ITM.item_id,CONCAT(ITM.item_code,' - ',ITM.item_name) AS item_name,
		SAT.measurement_name,
		SAT.measurement_id,CASE WHEN (((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 then (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) else 0 end))<=0 THEN 0 ELSE (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) END AS qty,(((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 then (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) else 0 end))AS qty_sisa,
		M.price,CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END AS fraction,M.note
		FROM inv_trans_partners_detail M
		INNER JOIN inv_trans_partners P ON P.trans_id=M.trans_id
		INNER JOIN inv_item ITM ON ITM.item_id=M.item_id
		INNER JOIN inv_measurement SAT ON SAT.measurement_id=M.measurement_id
		INNER JOIN inv_gin GIN ON GIN.gin_id=M.gin_id
		WHERE M.trans_id=".$pid." ORDER BY M.create_on ASC");
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
	$namaVendor=_get('f6',false);
	$noSJ=_get('f7',false);
	$posted=_get('f8',false);
	$status=_get('f10',false);
	$lunas=_get('f9',false);
	$kode_barang=_get('f11',false);
	$nama_barang=_get('f12',false);
	$kode_gin=_get('f13',false);
	$keterangan=_get('f14',false);
	$unit_id=_get('unit_id');
	$entity=' inv_trans_partners ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_partners PART ON PART.partners_id=M.partners_id
		LEFT JOIN inv_dist_partners D ON D.dist_id=M.dist_id
		LEFT JOIN payment P ON P.payment_id=M.payment_id
		LEFT JOIN app_parameter_option O ON O.option_code=D.status
		LEFT JOIN inv_trans_partners_detail DET ON DET.trans_id=M.trans_id
		LEFT JOIN inv_item I ON I.item_id=DET.item_id
		LEFT JOIN inv_gin G ON G.gin_id=DET.gin_id
			';
	$criteria.=" ";
	$criteria.=" M.unit_id=".$unit_id." AND M.tenant_id="._this()->pagesession->get()->tenant_id;
	if($posted != null && $posted !=''){
		if($posted=='Y')
			$criteria.=' AND M.posted=true ';
		else
			$criteria.=' AND M.posted=false ';
	}
	if($no_terima != null && $no_terima !='')
		$criteria.=" AND upper(trans_code) like upper('%".$no_terima."%')";
	if($noSJ != null && $noSJ !='')
		$criteria.=" AND upper(M.sj_number) like upper('%".$noSJ."%')";
	if($keterangan != null && $keterangan !='')
		$criteria.=" AND upper(M.description) like upper('%".$keterangan."%')";
	if($tglTerima_awal !== null && $tglTerima_awal !==''){
		$criteria.=" AND trans_on >='". $tglTerima_awal->format('Y-m-d') ."'";
	}
	if($tglTerima_akhir !== null && $tglTerima_akhir !==''){
		$criteria.=" AND trans_on <='". $tglTerima_akhir->format('Y-m-d') ."'";
	}
	if($nama_barang != null && $nama_barang !='')
		$criteria.=" AND upper(I.item_name) like upper('%".$nama_barang."%')";
	if($kode_barang != null && $kode_barang !='')
		$criteria.=" AND I.item_code ='".$kode_barang."'";
	if($kode_gin != null && $kode_gin !='')
		$criteria.=" AND G.gin_code ='".$kode_gin."'";
	if($namaVendor != null && $namaVendor !=''){
		$criteria.=" AND upper(PART.partners_name) like upper('%".$namaVendor."%')";
	}
	if($status != null && $status !=''){
		$criteria.=" AND D.status ='".$status."'";
	}
	if($lunas != null && $lunas !=''){
		if($lunas=='Y'){
			$criteria.=" AND IFNULL(P.paid,0)=1";
		}else{
			$criteria.=" AND IFNULL(P.paid,0)=0 ";
		}
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "f2": 
			$orderBy.='trans_on '.$direction;
			break;
		case "f7": 
			$orderBy.='M.sj_number '.$direction;
			break;
		case "f4":
			$orderBy.='PART.partners_name '.$direction;
			break;
		default:
		   	$orderBy.='trans_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT COUNT(X.trans_id) AS total FROM(SELECT M.trans_id FROM ".$entity." M  ".$inner." ".$criteria. " GROUP BY M.trans_id)X ");
	$res=_this()->query->result("SELECT M.trans_id AS i,trans_code AS f1,trans_on AS f2,M.description AS f3,
		PART.partners_name AS f4,M.posted AS f5, IFNULL(P.paid,0) AS f6,D.dist_code AS f7,O.option_name AS f10
		FROM ".$entity." M ".$inner." ".$criteria." GROUP BY M.trans_id ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_jual=_post('f1');
	$tgl_jual=_post('f2');
	$partners=_post('f3');
	$keterangan=_post('f4');
	$due_date=_post('f5');
	$sp_date=_post('f6');
	$sp_number=_post('f7');
	$sj_number=_post('f8');
	// $status=_post('f9');
	$total=_post('total');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$satuan=_post('sat_kecil_id');
	$qty=_post('qty');
	$fraction=_post('fraction');
	$qty_dist=_post('qty_dist');
	$gin=_post('gin_id');
	$note=_post('note');
	$harga=_post('harga');
	$jumlah=_post('jumlah');

	$now=new DateTime();
	$add=false;
	$par=array();
	$tenant_id=_session()->tenant_id;
	$employee_id=_session()->employee_id;
	$sequenceCode=getSetting('INV_SALES','SEQUENCE_CODE',false,'Nomor Penjualan');
	$posting=false;
	if($no_jual==null || $no_jual==''){
		$a=false;
		while($a==false){
			$codenya=_getSequenceById($sequenceCode);
			$res=_this()->query->row("SELECT trans_code FROM inv_trans_partners WHERE trans_code='".$codenya."' AND tenant_id=".$tenant_id);
			if(!$res){
				$no_jual=$codenya;
				$a=true;
			}
		}
		$pid=_getTableSequence('inv_trans_partners');
		$add=true;
		
		$par['trans_id']=$pid;
		$par['tenant_id']=$tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['trans_code']=$no_jual;
		$par['posted']=0;
	} 
	// if($sj_number==null || $sj_number==''){
		// $codenya=_this()->lib_sequence->get('NO_SJ');
		// $sj_number=$codenya['val'];
		// $par['sj_number']=$sj_number;
	// }
	$par['partners_id']=$partners;
	$par['trans_on']=$tgl_jual->format('Y-m-d H:i:s');
	$par['due_date']=$due_date->format('Y-m-d H:i:s');
	$par['sp_date']=$sp_date->format('Y-m-d H:i:s');
	$par['sp_number']=$sp_number;
	// $par['status']=$status;
	$par['description']=$keterangan;
	$par['tot']=$total;
	if($add==true){
		$par['create_by']=$employee_id;
		setNotification('Penerimaan','Terdapat Penjualan Baru, No. Penjualan : '.$no_jual,'INV_SALES');
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_trans_partners',$par);
	}else{
		$par['update_by']=$employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		$post= _this()->query->row("SELECT posted FROM inv_trans_partners WHERE trans_id=".$pid);
		if($post->posted==1){
			$posting=true;
		}
		_this()->db->where('trans_id',$pid);
		_this()->db->update('inv_trans_partners',$par);
	}
	$res= _this()->query->result("SELECT trans_detail_id FROM inv_trans_partners_detail WHERE trans_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->trans_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					if($posting==false){
						$par['item_id']=$barang[$j];
						$par['measurement_id']=$satuan[$j];
						$par['qty']=$qty[$j]*$fraction[$j];
						$par['price']=$harga[$j];
						$par['fraction']=$fraction[$j];
						$par['tot']=$jumlah[$j];
						$par['gin_id']=$gin[$j];
						$par['qty_dist']=$qty_dist[$j]*$fraction[$j];
						$par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
					}
					$par['note']=$note[$j];
					$par['update_by']=$employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('trans_detail_id',$detail_id[$j]);
					_this()->db->update('inv_trans_partners_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_trans_partners_detail WHERE trans_detail_id=".$res[$i]->trans_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			$par['trans_detail_id']=_getTableSequence('inv_trans_partners_detail');
			$arrId[]=$par['trans_detail_id'];
			$par['trans_id']=$pid;
			$par['item_id']=$barang[$j];
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j]*$fraction[$j];
			$par['price']=$harga[$j];
			$par['fraction']=$fraction[$j];
			$par['tot']=$jumlah[$j];
			$par['note']=$note[$j];
			$par['gin_id']=$gin[$j];
			$par['qty_dist']=$qty_dist[$j]*$fraction[$j];
			$par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
			$par['create_by']=$employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_trans_partners_detail',$par);
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual,'sj'=>$sj_number));
	_message_save('Nomor Jual', $no_jual );
}
function posting(){
	_this()->query->start();
	$pid=_post('i');
	$no_jual=_post('f1');
	$tgl_jual=_post('f2');
	$partners=_post('f3');
	$keterangan=_post('f4');
	$due_date=_post('f5');
	$sp_date=_post('f6');
	$sp_number=_post('f7');
	$sj_number=_post('f8');
	// $status=_post('f9');
	$total=_post('total');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$fraction=_post('fraction');
	$satuan=_post('sat_kecil_id');
	$qty=_post('qty');
	$qty_dist=_post('qty_dist');
	$gin=_post('gin_id');
	$harga=_post('harga');
	$jumlah=_post('jumlah');
	$note=_post('note');

	$now=new DateTime();
	$add=false;
	$par=array();
	$tenant_id=_session()->tenant_id;
	$employee_id=_session()->employee_id;
	$sequenceCode=getSetting('INV_SALES','SEQUENCE_CODE',false,'Nomor Penjualan');
	$sequenceCodeDist=getSetting('INV_SALES','SEQUENCE_CODE_DIST',false,'Nomor Distribusi');
	//<INSERT DISTRIBUSI
	$adaDist=false;
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($qty_dist[$j]>0){
			$adaDist=true;
			break;
		}
	}
	if($adaDist===true){
		$par=array();
		$a=false;
		while($a==false){
			$codenya=_getSequenceById($sequenceCodeDist);
			$res=_this()->query->row("SELECT dist_code FROM inv_dist_partners WHERE dist_code='".$codenya."' AND tenant_id=".$tenant_id);
			if(!$res){
				$sj_number=$codenya;
				$a=true;
			}
		}
		$i_dist=_getTableSequence('inv_dist_partners');
		$par['dist_id']=$i_dist;
		$par['tenant_id']=$tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['dist_code']=$sj_number;
		$par['posted']=1;
		$par['partners_id']=$partners;
		$par['dist_on']=$tgl_jual->format('Y-m-d H:i:s');
		$par['create_by']=$employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		$par['status']=getSetting('INV_SALES','DEFAULT_STATUS');
		$par['send_by']=getSetting('INV_SALES','DEFAULT_SEND_BY',true);
		_this()->db->insert('inv_dist_partners',$par);
	}
	//>
	$par=array();
	if($no_jual==null || $no_jual==''){
		$a=false;
		while($a==false){
			$codenya=_getSequenceById($sequenceCode);
			$res=_this()->query->row("SELECT trans_code FROM inv_trans_partners WHERE trans_code='".$codenya."' AND tenant_id=".$tenant_id);
			if(!$res){
				$no_jual=$codenya;
				$a=true;
			}
		}
		$pid=_getTableSequence('inv_trans_partners');
		$add=true;
		$par['trans_id']=$pid;
		$par['tenant_id']=$tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['trans_code']=$no_jual;
	} 
	$par['posted']=1;
	$par['partners_id']=$partners;
	if($adaDist===true){
		$par['dist_id']=$i_dist;
	}else{
		$par['dist_id']=null;
	}
	$par['trans_on']=$tgl_jual->format('Y-m-d H:i:s');
	$par['due_date']=$due_date->format('Y-m-d H:i:s');
	$par['sp_date']=$sp_date->format('Y-m-d H:i:s');
	$par['sp_number']=$sp_number;
	// $par['status']=$status;
	$par['description']=$keterangan;
	$par['tot']=$total;
	if($add==true){
		$par['create_by']=$employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_trans_partners',$par);
	}else{
		$par['update_by']=$employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('trans_id',$pid);
		_this()->db->update('inv_trans_partners',$par);
	}
	$res= _this()->query->result("SELECT trans_detail_id FROM inv_trans_partners_detail WHERE trans_id=".$pid);
	
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->trans_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					$par['item_id']=$barang[$j];
					$par['measurement_id']=$satuan[$j];
					$par['qty']=$qty[$j]*$fraction[$j];
					$par['price']=$harga[$j];
					$par['fraction']=$fraction[$j];
					$par['tot']=$jumlah[$j];
					$par['gin_id']=$gin[$j];
					$par['note']=$note[$j];
					$par['qty_dist']=0;
					$par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
					
					$par['update_by']=$employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('trans_detail_id',$detail_id[$j]);
					_this()->db->update('inv_trans_partners_detail',$par);
					//INSERT DETAIL DIST
					if($qty_dist[$j]>0){
						$dist=array();
						$dist['dist_detail_id']=_getTableSequence('inv_dist_partners_detail');
						$dist['dist_id']=$i_dist;
						$dist['trans_detail_id']=$detail_id[$j];
						$dist['qty']=$qty_dist[$j]*$fraction[$j];
						$dist['create_by']=$employee_id;
						$dist['create_on']=$now->format('Y-m-d H:i:s');
						_this()->db->insert('inv_dist_partners_detail',$dist);
					}
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_trans_partners_detail WHERE trans_detail_id=".$res[$i]->trans_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			_load('lib/lib_table_sequence');
			$par['trans_detail_id']=_getTableSequence('inv_trans_partners_detail');
			$arrId[]=$par['trans_detail_id'];
			$par['trans_id']=$pid;
			$par['item_id']=$barang[$j];
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j]*$fraction[$j];
			$par['price']=$harga[$j];
			$par['fraction']=$fraction[$j];
			$par['note']=$note[$j];
			$par['tot']=$jumlah[$j];
			$par['gin_id']=$gin[$j];
			$par['qty_dist']=0;
			$par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
			$par['create_by']=$employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_trans_partners_detail',$par);
			//INSERT DETAIL DIST
			if($qty_dist[$j]>0){
				$dist=array();
				$dist['dist_detail_id']=_getTableSequence('inv_dist_partners_detail');
				$dist['dist_id']=$i_dist;
				$dist['trans_detail_id']=$par['trans_detail_id'];
				$dist['qty']=$qty_dist[$j]*$fraction[$j];
				$dist['create_by']=$employee_id;
				$dist['create_on']=$now->format('Y-m-d H:i:s');
				_this()->db->insert('inv_dist_partners_detail',$dist);
			}
		}
	}
	$res= _this()->query->result("SELECT M.gin_id,M.qty,M.item_id,P.unit_id,ITM.item_name FROM inv_trans_partners_detail M 
		INNER JOIN inv_trans_partners P ON P.trans_id=M.trans_id 
		INNER JOIN inv_item ITM ON ITM.item_id=M.item_id WHERE M.trans_id=".$pid);
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
	$res= _this()->query->row("SELECT M.payment_id,P.partners_name,P.address FROM inv_trans_partners M
		INNER JOIN inv_partners P ON P.partners_id=M.partners_id
		WHERE M.trans_id=".$pid);
	$pay=array();
	$pay['debit']=(double)$total;
	$pay['nama']=$res->partners_name.' '.$res->address;
	if($res->payment_id==null || $res->payment_id==''){		
		$payment_id=_getTableSequence('payment');
		$pay['payment_id']=$payment_id;
		$pay['payment_code']=$no_jual;
		$pay['tenant_id']=$tenant_id;
		$pay['description']='Penjualan No. Faktur : '.$no_jual.', Tanggal/Jam: '.$now->format('Y-m-d H:i:s');
		$pay['paid']=0;
		$pay['create_by']=$employee_id;
		$pay['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('payment',$pay);
		$par=array();
		$par['payment_id']=$payment_id;
		_this()->db->where('trans_id',$pid);
		_this()->db->update('inv_trans_partners',$par);
	}else{
		$payment_id=$res->payment_id;
		_this()->db->where('payment_id',$payment_id);
		_this()->db->update('payment',$pay);
	}
	$payDetail=array();
	$payment_detail_id=_getTableSequence('payment_detail');
	$payDetail['payment_detail_id']=$payment_detail_id;
	$payDetail['payment_id']=$payment_id;
	$payDetail['description']='Penjualan No. Faktur : '.$no_jual.', Tanggal/Jam: '.$now->format('Y-m-d H:i:s');
	$payDetail['debit']=(double)$total;
	$payDetail['create_by']=$employee_id;
	$payDetail['create_on']=$now->format('Y-m-d H:i:s');
	_this()->db->insert('payment_detail',$payDetail);
	
	$res= _this()->query->result("SELECT M.item_id,SUM((M.qty/fraction)) AS qty,M.measurement_id,M.price,
		SUM(((M.qty/fraction)*M.price)) AS jumlah
		FROM inv_trans_partners_detail M
		WHERE M.trans_id=".$pid." GROUP BY M.item_id");
	for($j=0,$jLen=count($res); $j<$jLen;$j++){
		$rInd=$res[$j];
		$payItem=array();
		$payment_item_id=_getTableSequence('payment_item');
		$payItem['payment_item_id']=(double)$payment_item_id;
		$payItem['payment_id']=(double)$payment_id;
		$payItem['item_id']=(double)$rInd->item_id;
		$payItem['qty']=(double)$rInd->qty;
		$payItem['measurement_id']=(double)$rInd->measurement_id;
		$payItem['price']=(double)$rInd->price;
		$payItem['debit']=(double)$rInd->jumlah;
		$payItem['create_by']=(double)$employee_id;
		$payItem['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('payment_item',$payItem);
		
		$payTag=array();
		$payTag['payment_tag_id']=(double)_getTableSequence('payment_tag');
		$payTag['payment_detail_id']=(double)$payment_detail_id;
		$payTag['payment_item_id']=(double)$payment_item_id;
		$payTag['debit']=(double)$rInd->jumlah;
		_this()->db->insert('payment_tag',$payTag);
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual,'payment_id'=>$payment_id,'sj'=>$sj_number));
	_message("No. Jual '".$no_jual."' Berhasil diPosting.");
}
function unposting(){
	_this()->query->start();
	$pid=_post('i');
	$now=new DateTime();
	$add=false;
	$tenant_id=_session()->tenant_id;
	$employee_id=_session()->employee_id;
	
	$row=_this()->query->row("SELECT M.posted,M.payment_id,dist_id FROM inv_trans_partners M WHERE M.trans_id=".$pid);
	if($row){
		if($row->posted==0){
			_this()->query->back();
			_error_message('Data Sudah Un Posting.')->end();
		}
	}else{
		_this()->query->back();
		_error_message('Data Tidak Ada.')->end();
	}
	if($row->payment_id!=null){
		$pay=_this()->query->row("SELECT count(payment_detail_id) AS jum FROM payment_detail WHERE payment_id=".$row->payment_id." OR payment_id_transfer=".$row->payment_id);
		if($pay->jum>1){
			_this()->query->back();
			_error_message('Sudah ada detail pembayaran, harap hapus pembayaran terlebih dahulu.')->end();
		}else{
			_this()->query->set("DELETE FROM payment_item WHERE payment_id=".$row->payment_id);
			_this()->query->set("DELETE FROM payment_detail WHERE payment_id=".$row->payment_id);
		}
	}
	if($row->dist_id!=null && $row->dist_id !=''){
		$lDist=_this()->query->result("SELECT M.trans_detail_id,M.qty AS qty_dist,(D.qty_sisa+M.qty) AS qty_sisa FROM inv_dist_partners_detail M
			INNER JOIN inv_trans_partners_detail D ON D.trans_detail_id=M.trans_detail_id
			WHERE M.dist_id=".$row->dist_id);
		for($i=0,$iLen=count($lDist); $i<$iLen;$i++){
			$par=array();
			$par['qty_dist']=(double)$lDist[$i]->qty_dist;
			$par['qty_sisa']=(double)$lDist[$i]->qty_sisa;
			_this()->db->where('trans_detail_id',$lDist[$i]->trans_detail_id);
			_this()->db->update('inv_trans_partners_detail',$par);
		}
		_this()->query->set("DELETE FROM inv_dist_partners WHERE dist_id=".$row->dist_id);
	}
	$par=array();
	$par['posted']=0;
	$par['update_by']=$employee_id;
	$par['update_on']=$now->format('Y-m-d H:i:s');
	_this()->db->where('trans_id',$pid);
	_this()->db->update('inv_trans_partners',$par);
	$res= _this()->query->result("SELECT M.gin_id,M1.qty AS qty_gin,M2.item_name,M.qty,M.qty_sisa,M.qty_dist FROM inv_trans_partners_detail M 
		INNER JOIN inv_gin M1 ON M1.gin_id=M.gin_id 
		INNER JOIN inv_item M2 ON M.item_id=M2.item_id WHERE M.trans_id=".$pid);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		if($res[$i]->qty_sisa< ($res[$i]->qty-$res[$i]->qty_dist)){
			_this()->query->back();
			_error_message("Barang '".$res[$i]->item_name."' Sudah Terdistribusi Sebagian, Tidak Bisa di Unposting.")->end();
		}
		$arr['qty']=$res[$i]->qty_gin+$res[$i]->qty;
		_this()->db->where('gin_id',$res[$i]->gin_id);
		_this()->db->update('inv_gin',$arr);
	}
	
	$res= _this()->query->result("SELECT M.item_id,M.qty,M1.unit_id,M2.item_name FROM inv_trans_partners_detail M 
		INNER JOIN inv_trans_partners M1 ON M1.trans_id=M.trans_id 
		INNER JOIN inv_item M2 ON M2.item_id=M.item_id WHERE M.trans_id=".$pid);
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
	$res=  _this()->query->row("SELECT trans_code,posted FROM inv_trans_partners WHERE trans_id=".$pid);
	if ($res) {
		if($res->posted==0){
			 _this()->query->set("DELETE FROM inv_trans_partners WHERE trans_id=".$pid);
			_message_delete('No. Jual', $res->trans_code);
		}else{
			_error_message("No. Jual '".$res->trans_code."' sudah Posting, tidak bisa dihapus.");
		}
	}else
		_not_found();
}