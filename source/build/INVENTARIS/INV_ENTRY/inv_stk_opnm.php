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
	$unit_id=_get('unit_id');
	// $partners_id=_get('partners_id');
	$now=new DateTime();
	// if($partners_id!==''){
		$entity=' inv_gin';
		$criteria=" WHERE";
		$inner='	INNER JOIN inv_item ITEM ON ITEM.item_id=M.item_id
					INNER JOIN inv_item_measurement IM ON IM.item_id=ITEM.item_id AND IM.small_flag=1
					INNER JOIN inv_receive_detail RECD ON RECD.gin_id=M.gin_id
					INNER JOIN inv_receive REC ON REC.receive_id=RECD.receive_id
					INNER JOIN inv_measurement SAT_S ON SAT_S.measurement_id=ITEM.measurement_small
					LEFT JOIN inv_stock S ON S.item_id=ITEM.item_id AND S.tenant_id=ITEM.tenant_id AND S.unit_id='.$unit_id.'
				';
		$criteria.=" REC.unit_id=".$unit_id." AND M.tenant_id="._this()->pagesession->get()->tenant_id;
		$criteria.=" AND M.qty>0";
		if($code != null && $code !='')
			$criteria.=" AND upper(ITEM.item_code) like upper('%".$code."%')";
		if($name != null && $name !='')
			$criteria.=" AND upper(ITEM.item_name) like upper('%".$name."%')";
		if($desc != null && $desc !='')
			$criteria.=" AND upper(ITEM.description) like upper('%".$desc."%')";
		if($type != null && $type !='')
			$criteria.=" AND ITEM.item_type='".$type."'";
		if($active != null && $active !=''){
			if($active=='Y')
				$criteria.=' AND ITEM.active_flag=true ';
			else
				$criteria.=' AND ITEM.active_flag=false ';
		}
		$orderBy=' ORDER BY ITEM.item_code ASC,CASE WHEN M.in_date IS NULL THEN 1 ELSE 0 END DESC, M.expire_date ASC,M.in_date DESC, RECD.create_on DESC';
		$total=_this()->query->row("SELECT count(ITEM.item_code) AS total FROM ".$entity." M  ".$inner." ".$criteria." GROUP BY M.gin_code");
		$res=_this()->query->result("SELECT ITEM.item_id AS i,M.gin_id AS gin_id,CONCAT(ITEM.item_code,' - ',ITEM.item_name) as name,
			(M.qty-M.qty_out) AS stock
			,ITEM.active_flag AS a,SAT_S.measurement_name AS sat_s,
			M.in_date AS tgl,M.gin_code AS gin,CASE WHEN M.in_date IS NOT NULL THEN REC.receive_number ELSE '(REAL)' END AS terima,
			CASE WHEN M.expire_flag=1 THEN M.expire_date ELSE '' END AS expire
					FROM ".$entity." M ".$inner." ".$criteria." GROUP BY M.gin_code  ".$orderBy.' LIMIT '.$size.' OFFSET '.$first.' ');
		_data($res)->setTotal($total->total);
	// }else{
		// _message('Rekana Belum dipilih.');
	// }
}
// function kwitansi(){
	// $pid=_post('i');
	// $id=_post('pid');
	// $file=_post('file');
	// $show=_post('show');
	// $row=_this()->query->row("SELECT M.sp_number,M.sp_date,M.due_date,M.trans_code,M.trans_on,
		// CONCAT(P.partners_name,' ',P.address) AS partners_name FROM inv_trans_partners M 
	// INNER JOIN inv_partners P ON P.partners_id=M.partners_id
	// WHERE M.payment_id=".$id);
	// $det=_this()->query->row("SELECT M.create_on,M.kredit FROM payment_detail M 
	// WHERE M.payment_detail_id=".$pid);
	// $create_on=new DateTime($det->create_on);
	// $dateFaktur=new DateTime($row->trans_on);
	// $tenant=_this()->query->row("SELECT M.tenant_name,tenant_desc,address FROM app_tenant M 
		// WHERE M.tenant_id="._this()->pagesession->get()->tenant_id);
	// _load('printer');	
	// $printer=_this()->printer;
	// $printer->add($create_on->format('d M Y'));
	// $printer->add($row->partners_name);
	// $printer->add($det->kredit);
	// $printer->add("Sesuai Faktur No. ".$row->trans_code);
	// $printer->code='KWITANSI';
	// $printer->description='Print KWITANSI. \nNo : '.$row->trans_code;
	// $printer->report=$file;
	// $printer->view=$show;
	// $printer->send();
// }
// function faktur(){
	// $pid=_post('i');
	// $id=_post('pid');
	// $file=_post('file');
	// $show=_post('show');
	// $row=_this()->query->row("SELECT M.sp_number,M.sp_date,M.due_date,M.trans_code,M.trans_on,
		// CONCAT(P.partners_name,'\n',P.address) AS partners_name FROM inv_trans_partners M 
	// INNER JOIN inv_partners P ON P.partners_id=M.partners_id
	// WHERE M.payment_id=".$id);
	// $query=_this()->query->result("SELECT I.item_name,SUM((D.qty/D.fraction)) AS qty,MEA.measurement_name,D.price, 
// (SELECT PT.percent FROM payment_item PAI 
	// INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	// INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	// INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	// WHERE PAI.item_id=D.item_id AND PAI.payment_id=M.payment_id AND PYT.payment_type_code='DISC')
 // AS dicount_percent, 
// (SELECT PT.kredit FROM payment_item PAI 
	// INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	// INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	// INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	// WHERE PAI.item_id=D.item_id AND PAI.payment_id=M.payment_id AND PYT.payment_type_code='DISC') 
  // AS dicount_price 
		// FROM inv_trans_partners_detail D
		// INNER JOIN inv_trans_partners M ON M.trans_id=D.trans_id
		// INNER JOIN inv_item I ON I.item_id=D.item_id
		// INNER JOIN inv_measurement MEA ON MEA.measurement_id=D.measurement_id
		// WHERE
		// M.payment_id=".$id." GROUP BY I.item_name");
	// $dateFaktur=new DateTime($row->trans_on);
	// $tenant=_this()->query->row("SELECT M.tenant_name,tenant_desc,address FROM app_tenant M 
		// WHERE M.tenant_id="._this()->pagesession->get()->tenant_id);
	// _load('printer');	
	// $printer=_this()->printer;
	// $printer->add($tenant->tenant_name);
	// $printer->add($tenant->tenant_desc);
	// $printer->add($tenant->address);
	// $printer->add($row->trans_code);
	// $printer->add($dateFaktur->format('d M Y'));
	// $printer->add($row->partners_name);
	// $printer->add(_this()->pagesession->get()->user_name);
	// $printer->add(getSetting('INV_SALES','FAKTUR_TTD_NAMA'));
	// $printer->add(getSetting('INV_SALES','FAKTUR_NOTE_FOOT'));
	// $printer->add($row->sp_number);
	// $sp_date=new DateTime($row->sp_date);
	// $printer->add($sp_date->format('d M Y'));
	// $dueDate=new DateTime($row->due_date);
	// $printer->add($dueDate->format('d M Y'));
	// $printer->code='FAKTUR';
	// $printer->value=$query;
	// $printer->description='Print Faktur. \nNo : '.$row->trans_code;
	// $printer->report=$file;
	// $printer->view=$show;
	// $printer->send();
// }
// function getListPartners(){
	// $first=_get('page');
	// $size=_get('pageSize');
	// $direction=_get('d',false);
	// $sorting=_get('s',false);
	// $code=_get('f1',false);
	// $name=_get('f2',false);
	// $type=_get('f3',false);
	// $pic=_get('f4',false);
	// $email=_get('f5',false);
	// $alamat=_get('f6',false);
	// $negara=_get('f7',false);
	// $prov=_get('f8',false);
	// $kota=_get('f9',false);
	// $kec=_get('f10',false);
	// $kel=_get('f11',false);
	// $izin=_get('f12',false);
	// $active=_get('f13',false);
	// $pak=_get('f14',false);
	// $telepon=_get('f15',false);
	// $fax=_get('f16',false);
	// $entity=' inv_partners ';
	// $criteria=" WHERE";
	// $inner='
		// INNER JOIN inv_partners_type A ON M.partners_type=A.partners_type_id
			// ';
	// $criteria.=" M.tenant_id="._this()->pagesession->get()->tenant_id;
	// if($code != null && $code !='')
		// $criteria.=" AND upper(partners_code) like upper('%".$code."%')";
	// if($name != null && $name !='')
		// $criteria.=" AND upper(partners_name) like upper('%".$name."%')";
	// if($type != null && $type !='')
		// $criteria.=" AND M.partners_type=".$type;
	// if($pak != null && $pak !='')
		// $criteria.=" AND upper(no_pak) like upper('%".$pak."%')";
	// if($pic != null && $pic !='')
		// $criteria.=" AND upper(pic) like upper('%".$pic."%')";
	// if($email != null && $email !='')
		// $criteria.=" AND upper(email) like upper('%".$email."%')";
	// if($telepon != null && $telepon !='')
		// $criteria.=" AND upper(telepon) like upper('%".$telepon."%')";
	// if($fax != null && $fax !='')
		// $criteria.=" AND upper(fax) like upper('%".$fax."%')";
	// if($alamat != null && $alamat !='')
		// $criteria.=" AND upper(address) like upper('%".$alamat."%')";
	// if($negara != null && $negara !='')
		// $criteria.=" AND upper(country) like upper('%".$negara."%')";
	// if($prov != null && $prov !='')
		// $criteria.=" AND upper(province) like upper('%".$prov."%')";
	// if($kota != null && $kota !='')
		// $criteria.=" AND upper(city) like upper('%".$kota."%')";
	// if($kec != null && $kec !='')
		// $criteria.=" AND upper(districts) like upper('%".$kec."%')";
	// if($kel != null && $kel !='')
		// $criteria.=" AND upper(keluarahan) like upper('%".$kel."%')";
	// if($izin != null && $izin !=''){
		// if($izin=='Y')
			// $criteria.=' AND M.permission_flag=true ';
		// else
			// $criteria.=' AND M.permission_flag=false ';
	// }
	// if($active != null && $active !=''){
		// if($active=='Y')
			// $criteria.=' AND M.active_flag=true ';
		// else
			// $criteria.=' AND M.active_flag=false ';
	// }
	// $orderBy=' ORDER BY ';
	// if($direction == null)
		// $direction='ASC';
	// switch ($sorting){
		// case "f2": 
			// $orderBy.='partners_name '.$direction;
			// break;
		// case "f3": 
			// $orderBy.='A.partners_type_name '.$direction;
			// break;
		// case "f4": 
			// $orderBy.='M.pic '.$direction;
			// break;
		// case "f5": 
			// $orderBy.='M.email '.$direction;
			// break;
		// case "f6": 
			// $orderBy.='M.address '.$direction;
			// break;
		// case "f7": 
			// $orderBy.='M.country '.$direction;
			// break;
		// case "f8": 
			// $orderBy.='M.province '.$direction;
			// break;
		// case "f9": 
			// $orderBy.='M.city '.$direction;
			// break;
		// case "f10": 
			// $orderBy.='M.districts '.$direction;
			// break;
		// case "f11": 
			// $orderBy.='M.keluarahan '.$direction;
			// break;
		// case "f14": 
			// $orderBy.='M.no_pak '.$direction;
			// break;
		// default:
		   	// $orderBy.='partners_code '.$direction;
			// break;
	// }
	// $total=_this()->query->row("SELECT count(partners_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	// $res=_this()->query->result("SELECT partners_id AS i,CONCAT(partners_code,' - ',partners_name) as name,A.partners_type_name AS type,
		// M.email,M.address,M.active_flag AS a
				// FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	// _data($res)->setTotal($total->total);
// }

function getInitItem(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT MEA.measurement_id AS f1,MEA.measurement_name AS f2 FROM inv_item M 
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_small
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
	$ori= _this()->query->row("SELECT M.payment_id,trans_on,posted,M.partners_id,
		CONCAT(DIS.partners_code,' - ',DIS.partners_name) AS partners,description,
		due_date,sp_date,sp_number
		FROM inv_trans_partners M
		INNER JOIN inv_partners DIS ON DIS.partners_id=M.partners_id
		WHERE trans_id=".$pid);

	$oriList= _this()->query->result("SELECT CASE WHEN (((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 then (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) else 0 end))<=0 THEN 0 ELSE (M.qty_dist/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) END AS qty_dist,M.gin_id,GIN.gin_code,trans_detail_id,ITM.item_id,CONCAT(ITM.item_code,' - ',ITM.item_name) AS item_name,
		SAT.measurement_name,
		SAT.measurement_id,CASE WHEN (((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 then (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) else 0 end))<=0 THEN 0 ELSE (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) END AS qty,(((GIN.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END)-(GIN.qty_out/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END))+(CASE WHEN P.posted=1 then (M.qty/CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END) else 0 end))AS qty_sisa,
		M.price,CASE WHEN M.fraction=0 THEN 1 ELSE M.fraction END AS fraction
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
	$posted=_get('f8',false);
	$unit_id=_get('unit_id');
	$entity=' inv_stok_opname ';
	$criteria=" WHERE";
	$inner='
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
		$criteria.=" AND upper(opname_code) like upper('%".$no_terima."%')";
	if($tglTerima_awal !== null && $tglTerima_awal !==''){
		$criteria.=" AND create_on >='". $tglTerima_awal->format('Y-m-d') ."'";
	}
	if($tglTerima_akhir !== null && $tglTerima_akhir !==''){
		$criteria.=" AND create_on <='". $tglTerima_akhir->format('Y-m-d') ."'";
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "f2": 
			$orderBy.='create_on '.$direction;
			break;
		default:
		   	$orderBy.='opname_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(opname_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT opname_id AS i,opname_code AS f1,create_on AS f2,M.description AS f3,
		posted AS f5
		FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_opname=_post('f1');
	$tgl_opname=_post('f2');
	// $partners=_post('f3');
	$keterangan=_post('f4');
	// $due_date=_post('f5');
	// $sp_date=_post('f6');
	// $sp_number=_post('f7');
	// $total=_post('total');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	// $barang=_post('barang');
	$satuan=_post('sat_kecil_id');
	// $qty=_post('qty');
	// $fraction=_post('fraction');
	// $qty_dist=_post('qty_dist');
	$gin=_post('gin_id');
	// $harga=_post('harga');
	$value=_post('value');

	$now=new DateTime();
	$add=false;
	$par=array();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	if($no_opname==null || $no_opname==''){
		$codenya=_this()->lib_sequence->get('INV_STOK_OPNAME');
		$no_opname=$codenya['val'];
		$pid=_this()->lib_table_sequence->get('inv_stok_opname');
		$add=true;
		
		$par['opname_id']=$pid;
		$par['tenant_id']=_this()->pagesession->get()->tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['opname_code']=$no_opname;
		$par['posted']=0;
	} 
	// $par['partners_id']=$partners;
	$par['opname_date']=$tgl_opname->format('Y-m-d H:i:s');
	// $par['due_date']=$due_date->format('Y-m-d H:i:s');
	// $par['sp_date']=$sp_date->format('Y-m-d H:i:s');
	// $par['sp_number']=$sp_number;
	$par['description']=$keterangan;
	// $par['tot']=$total;
	if($add==true){
		$par['create_by']=_this()->pagesession->get()->employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_stok_opname',$par);
	}else{
		$par['update_by']=_this()->pagesession->get()->employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('opname_id',$pid);
		_this()->db->update('inv_stok_opname',$par);
	}
	$res= _this()->query->result("SELECT opname_detail_id FROM inv_stok_opname_detail WHERE opname_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->opname_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					// $par['item_id']=$barang[$j];
					$par['measurement_id']=$satuan[$j];
					$par['qty']=$value[$j];
					// $par['price']=$harga[$j];
					// $par['fraction']=$fraction[$j];
					// $par['tot']=$jumlah[$j];
					$par['gin_id']=$gin[$j];
					// $par['qty_dist']=$qty_dist[$j]*$fraction[$j];
					// $par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
					
					$par['update_by']=_this()->pagesession->get()->employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('opname_detail_id',$detail_id[$j]);
					_this()->db->update('inv_stok_opname_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_stok_opname_detail WHERE opname_detail_id=".$res[$i]->opname_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			_load('lib/lib_table_sequence');
			$par['opname_detail_id']=_this()->lib_table_sequence->get('inv_stok_opname_detail');
			$arrId[]=$par['opname_detail_id'];
			$par['opname_id']=$pid;
			// $par['item_id']=$barang[$j];
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$value[$j];
			// $par['price']=$harga[$j];
			// $par['fraction']=$fraction[$j];
			// $par['tot']=$jumlah[$j];
			$par['gin_id']=$gin[$j];
			// $par['qty_dist']=$qty_dist[$j]*$fraction[$j];
			// $par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
			$par['create_by']=_this()->pagesession->get()->employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_stok_opname_detail',$par);
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_opname));
	_message_save('Nomor Opname', $no_opname );
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

	$now=new DateTime();
	$add=false;
	$par=array();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	if($no_jual==null || $no_jual==''){
		$codenya=_this()->lib_sequence->get('GEN_INV_SELL');
		$no_jual=$codenya['val'];
		$pid=_this()->lib_table_sequence->get('inv_trans_partners');
		$add=true;
		$par['trans_id']=$pid;
		$par['tenant_id']=$tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['trans_code']=$no_jual;
	} 
	$par['posted']=1;
	$par['partners_id']=$partners;
	$par['trans_on']=$tgl_jual->format('Y-m-d H:i:s');
	$par['due_date']=$due_date->format('Y-m-d H:i:s');
	$par['sp_date']=$sp_date->format('Y-m-d H:i:s');
	$par['sp_number']=$sp_number;
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
					$par['qty_dist']=$qty_dist[$j]*$fraction[$j];
					$par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
					
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
			_load('lib/lib_table_sequence');
			$par['trans_detail_id']=_this()->lib_table_sequence->get('inv_trans_partners_detail');
			$arrId[]=$par['trans_detail_id'];
			$par['trans_id']=$pid;
			$par['item_id']=$barang[$j];
			$par['measurement_id']=$satuan[$j];
			$par['qty']=$qty[$j]*$fraction[$j];
			$par['price']=$harga[$j];
			$par['fraction']=$fraction[$j];
			$par['tot']=$jumlah[$j];
			$par['gin_id']=$gin[$j];
			$par['qty_dist']=$qty_dist[$j]*$fraction[$j];
			$par['qty_sisa']=($qty[$j]*$fraction[$j])-($qty_dist[$j]*$fraction[$j]);
			$par['create_by']=$employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_trans_partners_detail',$par);
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
		$payment_id=_this()->lib_table_sequence->get('payment');
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
	$payment_detail_id=_this()->lib_table_sequence->get('payment_detail');
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
		$payment_item_id=_this()->lib_table_sequence->get('payment_item');
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
		$payTag['payment_tag_id']=(double)_this()->lib_table_sequence->get('payment_tag');
		$payTag['payment_detail_id']=(double)$payment_detail_id;
		$payTag['payment_item_id']=(double)$payment_item_id;
		$payTag['debit']=(double)$rInd->jumlah;
		_this()->db->insert('payment_tag',$payTag);
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual,'payment_id'=>$payment_id));
	_message("No. Jual '".$no_jual."' Berhasil diPosting.");
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
	
	$row=_this()->query->row("SELECT M.posted,M.payment_id FROM inv_trans_partners M WHERE M.trans_id=".$pid);
	if($row){
		if($row->posted==0){
			_this()->query->back();
			_error_message('Data Sudah Posting.')->end();
		}
	}else{
		_this()->query->back();
		_error_message('Data Tidak Ada.')->end();
	}
	if($row->payment_id!=null){
		$pay=_this()->query->row("SELECT count(payment_detail_id) AS jum FROM payment_detail WHERE payment_id=".$row->payment_id);
		if($pay->jum>1){
			_this()->query->back();
			_error_message('Sudah ada detail pembayaran, harap hapus pembayaran terlebih dahulu.')->end();
		}else{
			_this()->query->set("DELETE FROM payment_item WHERE payment_id=".$row->payment_id);
			_this()->query->set("DELETE FROM payment_detail WHERE payment_id=".$row->payment_id);
		}
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