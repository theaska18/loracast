<?php
function printSj(){
	$pid=_post('i');
	$file=getSetting('INV_DIST_ITM','SJ_URL_REPORT');
	$show=getSetting('INV_DIST_ITM','SJ_PREVIEW');
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
	$printer->send();
}
function getListItem(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$kd_barang=_get('f1',false);
	$nama_barang=_get('f2',false);
	$vendor=_get('f3');
	$unit_id=_get('f4');
	if($vendor==null || $vendor==''){
		_error_message("Harap Pilih Partner terlebih dahulu.")->end();
	}
	$entity=' inv_trans_partners_detail ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_trans_partners M2 ON M2.trans_id=M.trans_id AND M2.unit_id='.$unit_id.'
		INNER JOIN inv_gin GIN ON GIN.gin_id=M.gin_id
		INNER JOIN inv_item ITM ON ITM.item_id=M.item_id
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_id
			';
	$criteria.=" ";
	$criteria.=" M2.tenant_id="._this()->pagesession->get()->tenant_id." AND M2.posted=1 AND M.qty_sisa>0 AND M2.partners_id=".$vendor;
	
	if($kd_barang != null && $kd_barang !='')
		$criteria.=" AND upper(ITM.item_code) like upper('%".$kd_barang."%')";
	if($nama_barang != null && $nama_barang !='')
		$criteria.=" AND upper(ITM.item_name) like upper('%".$nama_barang."%')";
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "tgl": 
			$orderBy.='trans_on '.$direction;
			break;
		case "gin":
			$orderBy.='GIN.gin_code '.$direction;
			break;
		case "name":
			$orderBy.='ITM.item_name '.$direction;
			break;
		default:
		   	$orderBy.='trans_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(M.trans_detail_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT M.trans_detail_id AS i,GIN.gin_code AS gin,CONCAT(ITM.item_code,' - ',ITM.item_name) as name,M2.trans_on AS tgl,M2.trans_code AS no_jual,
		M.qty_sisa/M.fraction AS qty,MEA.measurement_name AS sat_k
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
				
	_data($res)->setTotal($total->total);
}
function getListPartners(){
	_func('PARTNERS','getListSearch');
}
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT dist_on,posted,M.partners_id,CONCAT(DIS.partners_code,' - ',DIS.partners_name) AS partners,M.status,M.send_by
		FROM inv_dist_partners M
		INNER JOIN inv_partners DIS ON DIS.partners_id=M.partners_id
		WHERE dist_id=".$pid);
	$oriList= _this()->query->result("SELECT IFNULL((M.qty/M1.fraction),0) AS qty_dist,
		CASE WHEN ((M1.qty_sisa/M1.fraction)+(CASE WHEN P.posted=1 then (M.qty/M1.fraction) else 0 end))<=0 THEN 0 ELSE ((M1.qty_sisa/M1.fraction)+(CASE WHEN P.posted=1 then (M.qty/M1.fraction) else 0 end)) END AS qty_sisa,dist_detail_id,M1.trans_detail_id,
		CONCAT(ITM.item_code,' - ',ITM.item_name) AS item_name,M2.trans_code,M2.trans_on
		FROM inv_dist_partners_detail M
		INNER JOIN inv_trans_partners_detail M1 ON M1.trans_detail_id=M.trans_detail_id
		INNER JOIN inv_trans_partners M2 ON M1.trans_id=M2.trans_id
		INNER JOIN inv_dist_partners P ON P.dist_id=M.dist_id
		INNER JOIN inv_item ITM ON ITM.item_id=M1.item_id
		WHERE M.dist_id=".$pid." ORDER BY M.create_on ASC");
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
	$posted=_get('f8',false);
	$status=_get('f9',false);
	$unit_id=_get('unit_id');
	$entity=' inv_dist_partners ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_partners PART ON PART.partners_id=M.partners_id
		LEFT JOIN app_parameter_option O ON O.option_code=M.status
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
		$criteria.=" AND upper(dist_code) like upper('%".$no_terima."%')";
	if($tglTerima_awal !== null && $tglTerima_awal !==''){
		$criteria.=" AND dist_on >='". $tglTerima_awal->format('Y-m-d') ."'";
	}
	if($status != null && $status !=''){
		$criteria.=" AND M.status ='".$status."'";
	}
	if($tglTerima_akhir !== null && $tglTerima_akhir !==''){
		$criteria.=" AND dist_on <='". $tglTerima_akhir->format('Y-m-d') ."'";
	}
	if($namaVendor != null && $namaVendor !='')
		$criteria.=" AND upper(PART.partners_name) like upper('%".$namaVendor."%')";
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "f2": 
			$orderBy.='dist_on '.$direction;
			break;
		case "f4":
			$orderBy.='PART.partners_name '.$direction;
			break;
		default:
		   	$orderBy.='dist_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(dist_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT dist_id AS i,dist_code AS f1,dist_on AS f2,PART.partners_name AS f4,posted AS f5,O.option_name AS f6
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_jual=_post('f1');
	$tgl_jual=_post('f2');
	$partners=_post('f3');
	$status=_post('f4');
	$send_by=_post('f5');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$qty_dist=_post('qty_dist');

	$now=new DateTime();
	$add=false;
	$par=array();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	if($no_jual==null || $no_jual==''){
		$codenya=_this()->lib_sequence->get('GEN_INV_DIST');
		$no_jual=$codenya['val'];
		$pid=_this()->lib_table_sequence->get('inv_dist_partners');
		$add=true;
		
		$par['dist_id']=$pid;
		$par['tenant_id']=_this()->pagesession->get()->tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['dist_code']=$no_jual;
		$par['posted']=0;
	} 
	$par['partners_id']=$partners;
	$par['dist_on']=$tgl_jual->format('Y-m-d H:i:s');
	$par['status']=$status;
	$par['send_by']=$send_by;
	if($add==true){
		$par['create_by']=_this()->pagesession->get()->employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_dist_partners',$par);
	}else{
		$par['update_by']=_this()->pagesession->get()->employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('dist_id',$pid);
		_this()->db->update('inv_dist_partners',$par);
	}
	$res= _this()->query->result("SELECT M.dist_detail_id FROM inv_dist_partners_detail M
		WHERE dist_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->dist_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					$itm= _this()->query->row("SELECT D.fraction
						FROM inv_trans_partners_detail D 
						WHERE trans_detail_id=".$barang[$j]);
					$par['trans_detail_id']=$barang[$j];
					$par['qty']=$qty_dist[$j]*$itm->fraction;
					$par['update_by']=_this()->pagesession->get()->employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('dist_detail_id',$detail_id[$j]);
					_this()->db->update('inv_dist_partners_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_dist_partners_detail WHERE dist_detail_id=".$res[$i]->dist_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			_load('lib/lib_table_sequence');
			$par['dist_detail_id']=_this()->lib_table_sequence->get('inv_dist_partners_detail');
			$arrId[]=$par['dist_detail_id'];
			$par['dist_id']=$pid;
			$par['trans_detail_id']=$barang[$j];
			$itm= _this()->query->row("SELECT D.fraction
				FROM inv_trans_partners_detail D 
				INNER JOIN inv_gin GIN ON GIN.gin_id=D.gin_id
				WHERE trans_detail_id=".$barang[$j]);
			$par['qty']=$qty_dist[$j]*$itm->fraction;
			$par['create_by']=_this()->pagesession->get()->employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_dist_partners_detail',$par);
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual));
	_message_save('Nomor Distribusi', $no_jual );
}
function posting(){
	_this()->query->start();
	$pid=_post('i');
	
	$no_jual=_post('f1');
	$tgl_jual=_post('f2');
	$partners=_post('f3');
	$status=_post('f4');
	$send_by=_post('f5');
	$unit_id=_post('unit_id');
	
	$detail_id=_post('id');
	$barang=_post('barang');
	$qty_dist=_post('qty_dist');

	$now=new DateTime();
	$add=false;
	$par=array();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	if($no_jual==null || $no_jual==''){
		$codenya=_this()->lib_sequence->get('GEN_INV_DIST');
		$no_jual=$codenya['val'];
		$pid=_this()->lib_table_sequence->get('inv_dist_partners');
		$add=true;
		
		$par['dist_id']=$pid;
		$par['tenant_id']=_this()->pagesession->get()->tenant_id;
		$par['unit_id']=(double)$unit_id;
		$par['dist_code']=$no_jual;
		
	} 
	$par['posted']=1;
	$par['partners_id']=$partners;
	$par['dist_on']=$tgl_jual->format('Y-m-d H:i:s');
	$par['status']=$status;
	$par['send_by']=$send_by;
	if($add==true){
		$par['create_by']=_this()->pagesession->get()->employee_id;
		$par['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('inv_dist_partners',$par);
	}else{
		$par['update_by']=_this()->pagesession->get()->employee_id;
		$par['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('dist_id',$pid);
		_this()->db->update('inv_dist_partners',$par);
	}
	$res= _this()->query->result("SELECT dist_detail_id FROM inv_dist_partners_detail WHERE dist_id=".$pid);
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
			if($detail_id[$j] !=null && $detail_id !='' ){
				if((int)$res[$i]->dist_detail_id==(int)$detail_id[$j]){
					$ada=true;
					$par=array();
					$itm= _this()->query->row("SELECT D.fraction
						FROM inv_trans_partners_detail D 
						WHERE trans_detail_id=".$barang[$j]);
					$par['trans_detail_id']=$barang[$j];
					$par['qty']=$qty_dist[$j]*$itm->fraction;
					
					$par['update_by']=_this()->pagesession->get()->employee_id;
					$par['update_on']=$now->format('Y-m-d H:i:s');
					_this()->db->where('dist_detail_id',$detail_id[$j]);
					_this()->db->update('inv_dist_partners_detail',$par);
				}
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM inv_dist_partners_detail WHERE dist_detail_id=".$res[$i]->dist_detail_id);
		}
	}
	$arrId=array();
	for($j=0,$jLen=count($detail_id); $j<$jLen;$j++){
		if($detail_id[$j] ==null || $detail_id =='' ){
			$par=array();
			_load('lib/lib_table_sequence');
			$par['dist_detail_id']=_this()->lib_table_sequence->get('inv_dist_partners_detail');
			$arrId[]=$par['dist_detail_id'];
			$par['dist_id']=$pid;
			$itm= _this()->query->row("SELECT D.fraction
						FROM inv_trans_partners_detail D 
						WHERE trans_detail_id=".$barang[$j]);
			$par['trans_detail_id']=$barang[$j];
			$par['qty']=$qty_dist[$j]*$itm->fraction;
			$par['create_by']=_this()->pagesession->get()->employee_id;
			$par['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_dist_partners_detail',$par);
		}
	}
	
	$res= _this()->query->result("SELECT M2.qty_sisa,M.qty,M.trans_detail_id,ITM.item_name,M3.trans_code,M2.fraction FROM inv_dist_partners_detail M
		INNER JOIN inv_trans_partners_detail M2 ON M2.trans_detail_id=M.trans_detail_id
		INNER JOIN inv_trans_partners M3 ON M3.trans_id=M2.trans_id
		INNER JOIN inv_item ITM ON ITM.item_id=M2.item_id WHERE M.dist_id=".$pid);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$o=$res[$i];
		$arr=array();
		if($o->qty<=$o->qty_sisa){
			$arr['qty_sisa']=($o->qty_sisa)-($o->qty);
			_this()->db->where('trans_detail_id',$o->trans_detail_id);
			_this()->db->update('inv_trans_partners_detail',$arr);
		}else{
			_this()->query->back();
			_error_message("Sisa Barang '".$o->item_name."' dengan nomor Penjualaan '".$o->trans_code."' kurang dari ".$o->qty." tidak dapat di distribusikan, tidak dapat di posting.")->end();
		}
	}
	_this()->query->end();
	_data(array('l'=>$arrId,'id'=>$pid,'code'=>$no_jual));
	_message("No. Distribusi '".$no_jual."' Berhasil diPosting.");
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
	
	$row=_this()->query->row("SELECT posted FROM inv_dist_partners WHERE dist_id=".$pid);
	if($row){
		if($row->posted==0){
			_this()->query->back();
			_error_message('Data Sudah unPosting.')->end();
		}
	}else{
		_this()->query->back();
		_error_message('Data Tidak Ada.')->end();
	}
	$par=array();
	$par['posted']=0;
	$par['update_by']=$employee_id;
	$par['update_on']=$now->format('Y-m-d H:i:s');
	_this()->db->where('dist_id',$pid);
	_this()->db->update('inv_dist_partners',$par);
	$res= _this()->query->result("SELECT M.qty,M3.qty_sisa,M.trans_detail_id FROM inv_dist_partners_detail M 
		INNER JOIN inv_trans_partners_detail M3 ON M3.trans_detail_id=M.trans_detail_id WHERE M.dist_id=".$pid);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$arr['qty_sisa']=$res[$i]->qty_sisa+$res[$i]->qty;
		_this()->db->where('trans_detail_id',$res[$i]->trans_detail_id);
		_this()->db->update('inv_trans_partners_detail',$arr);
	}
	_this()->query->end();
	_message("Berhasil diUnPosting.");
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT dist_code,posted FROM inv_dist_partners WHERE dist_id=".$pid);
	if ($res) {
		if($res->posted==0){
			 _this()->query->set("DELETE FROM inv_dist_partners WHERE dist_id=".$pid);
			_message_delete('No. Distribusi', $res->dist_code);
		}else{
			_error_message("No. Distribusi '".$res->dist_code."' sudah Posting, tidak bisa dihapus.");
		}
	}else
		_not_found();
}