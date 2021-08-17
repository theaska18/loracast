<?php
function pay(){
	$karyawan=_post('f1');
	
	$measurement_id=_post('measurement_id');
	$fraction=_post('fraction');
	$barang=_post('barang');
	$qty=_post('jumlah');
	$price=_post('harga');
	_this()->query->start();
	_load('lib/lib_table_sequence');
	_load('lib/lib_sequence');
	$session=_this()->pagesession->get();
	$tenant_id=$session->tenant_id;
	$now=new DateTime();
	$employee_id=$session->employee_id;
	$unit_id=getSetting('KOPERASI_SELL','UNIT_ID');
	if($unit_id==null || $unit_id==''){
		_this()->query->back();
		_message("Konfigurasi Unit Tidak Benar.")->error()->end();
	}
	$codenya=_this()->lib_sequence->get('NO_FAKTUR');
	$auto_posting=getSetting('KOPERASI_SELL','AUTO_POSTING');
	if($auto_posting==null || $auto_posting==''){
		_this()->query->back();
		_message("Konfigurasi Auto Posting Tidak Benar.")->error()->end();
	}
	$auto_payment=getSetting('KOPERASI_SELL','AUTO_PAYMENT');
	if($auto_payment==null || $auto_payment==''){
		_this()->query->back();
		_message("Konfigurasi Auto Payment Tidak Benar.")->error()->end();
	}
	$default_payment=getSetting('KOPERASI_SELL','DEFAULT_PAYMENT');
	if($default_payment==null || $default_payment==''){
		_this()->query->back();
		_message("Konfigurasi Default Payment Tidak Benar.")->error()->end();
	}
	$no_jual=$codenya['val'];
	$pid=_this()->lib_table_sequence->get('inv_sell_emp');
	$sell=array();
	$sell['sell_emp_id']=(double)$pid;
	$sell['sell_emp_code']=$no_jual;
	$sell['tenant_id']=(double)$tenant_id;
	$sell['unit_id']=(double)$unit_id;
	$sell['sell_date']=$now->format('Y-m-d H:i:s');
	$sell['posted']=0;
	$sell['employee_id']=(double)$karyawan;
	$sell['total']=0;
	$sell['note']='';
	$sell['create_by']=(double)$employee_id;
	$sell['create_on']=$now->format('Y-m-d H:i:s');
	_this()->db->insert('inv_sell_emp',$sell);
	if($auto_posting=='Y'){
		$payment=array();
		$payment_id=_this()->lib_table_sequence->get('payment');
		$payment['payment_id']=$payment_id;
		$payment['tenant_id']=(double)$tenant_id;
		$payment['payment_code']=$no_jual;
		$payment['description']="Penjualan No. Faktur : ".$no_jual." , Tanggal/Jam: ".$now->format('Y-m-d H:i:s');
		$payment['paid']=0;
		$payment['nama']=getEmployeeNameById((double)$karyawan);
		$payment['create_by']=(double)$employee_id;
		$payment['create_on']=$now->format('Y-m-d H:i:s');
		_this()->db->insert('payment',$payment);
		if($auto_payment=='Y'){
			$payDetail=array();
			$payment_detail_first_id=_this()->lib_table_sequence->get('payment_detail');
			$payDetail['payment_detail_id']=$payment_detail_first_id;
			$payDetail['payment_id']=$payment_id;
			$payDetail['description']='Penjualan No. Faktur : '.$no_jual.', Tanggal/Jam: '.$now->format('Y-m-d H:i:s');
			// $payDetail['debit']=(double)$total;
			$payDetail['create_by']=$employee_id;
			$payDetail['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('payment_detail',$payDetail);
			
			$payment_det=array();
			$payment_detail_id=_this()->lib_table_sequence->get('payment_detail');
			$payment_det['payment_detail_id']=$payment_detail_id;
			$payment_det['payment_id']=(double)$payment_id;
			$payment_det['payment_type_id']=(double)$default_payment;
			$payment_det['description']=$payment['description'];
			$pay_code=_this()->lib_sequence->get('NO_KWITANSI');
			$payment_det['pay_code']=$pay_code['val'];
			$payment_det['create_by']=(double)$employee_id;
			$payment_det['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('payment_detail',$payment_det);
		}
	}
	$tot=0;
	$tagTot=0;
	$percentage=(double)getPercentPaymentTypeById($default_payment);
	for($i=0,$iLen=count($measurement_id); $i<$iLen;$i++){
		$jum=$qty[$i]*$fraction[$i];
		$res=_this()->query->result("SELECT gin_id,qty FROM inv_gin 
			WHERE tenant_id=".$tenant_id." AND item_id=".$barang[$i]." AND unit_id=".$unit_id." AND qty>0 ORDER BY in_date ASC,gin_id DESC ");
		if($auto_posting=='Y'){
			$payment_det=array();
			$payment_item_id=_this()->lib_table_sequence->get('payment_item');
			$payment_det['payment_item_id']=$payment_item_id;
			$payment_det['payment_id']=(double)$payment_id;
			$payment_det['item_id']=$barang[$i];
			$payment_det['qty']=(double)$qty[$i];
			$payment_det['measurement_id']=(double)$measurement_id[$i];
			$payment_det['price']=(double)$price[$i];
			$payment_det['debit']=(double)$price[$i]*$qty[$i];
			$payment_det['create_by']=(double)$employee_id;
			$payment_det['create_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('payment_item',$payment_det);
			if($auto_payment=='Y'){
				$payment_tag=array();
				$payment_tag['payment_tag_id']=_this()->lib_table_sequence->get('payment_tag');
				$payment_tag['payment_detail_id']=(double)$payment_detail_first_id;
				$payment_tag['payment_item_id']=(double)$payment_item_id;
				// $tagTot+=(double)(($qty[$i]*$price[$i])/100)*$percentage;
				$payment_tag['debit']=(double)(($qty[$i]*$price[$i])/100)*$percentage;
				$payment_tag['percent']=(double)$percentage;
				_this()->db->insert('payment_tag',$payment_tag);
				
				$payment_tag=array();
				$payment_tag['payment_tag_id']=_this()->lib_table_sequence->get('payment_tag');
				$payment_tag['payment_detail_id']=(double)$payment_detail_id;
				$payment_tag['payment_item_id']=(double)$payment_item_id;
				$tagTot+=(double)(($qty[$i]*$price[$i])/100)*$percentage;
				$payment_tag['kredit']=(double)(($qty[$i]*$price[$i])/100)*$percentage;
				$payment_tag['percent']=(double)$percentage;
				_this()->db->insert('payment_tag',$payment_tag);
			}
		}
		for($j=0,$jLen=count($res); $j<$jLen;$j++){
			$o=$res[$j];
			if($jum>$o->qty){
				$jum=$jum-$o->qty;
				$sell_det=array();
				$sell_det['sell_emp_detail_id']=_this()->lib_table_sequence->get('inv_sell_emp_detail');
				$sell_det['sell_emp_id']=$pid;
				$sell_det['gin_id']=$o->gin_id;
				$sell_det['price']=(double)$price[$i];
				$sell_det['qty']=(double)$o->qty;
				$tot+=(double)($o->qty/$fraction[$i])*$price[$i];
				$sell_det['tot_price']=(double)($o->qty/$fraction[$i])*$price[$i];
				$sell_det['measurement_id']=(double)$measurement_id[$i];
				$sell_det['fraction']=(double)$fraction[$i];
				$sell_det['create_by']=$employee_id;
				$sell_det['create_on']=$now->format('Y-m-d H:i:s');
				_this()->db->insert('inv_sell_emp_detail',$sell_det);
				if($auto_posting=='Y'){
					$gin=array();
					$gin['qty']=0;
					_this()->db->where('gin_id',$o->gin_id);
					_this()->db->update('inv_gin',$gin);
					$stok=_this()->query->row("SELECT stock_id,stock FROM inv_stock 
						WHERE tenant_id=".$tenant_id." AND item_id=".$barang[$i]." AND unit_id=".$unit_id."");
					$arrStock=array();
					$arrStock['stock']=$stok->stock-$o->qty;
					_this()->db->where('stock_id',$stok->stock_id);
					_this()->db->update('inv_stock',$arrStock);
				}
			}else{
				$sell_det=array();
				$sell_det['sell_emp_detail_id']=_this()->lib_table_sequence->get('inv_sell_emp_detail');
				$sell_det['sell_emp_id']=$pid;
				$sell_det['gin_id']=$o->gin_id;
				$sell_det['price']=(double)$price[$i];
				$sell_det['qty']=(double)$jum;
				$tot+=(double)($jum/$fraction[$i])*$price[$i];
				$sell_det['tot_price']=(double)($jum/$fraction[$i])*$price[$i];
				$sell_det['measurement_id']=(double)$measurement_id[$i];
				$sell_det['fraction']=(double)$fraction[$i];
				$sell_det['create_by']=$employee_id;
				$sell_det['create_on']=$now->format('Y-m-d H:i:s');
				_this()->db->insert('inv_sell_emp_detail',$sell_det);
				if($auto_posting=='Y'){
					$gin=array();
					$gin['qty']=$o->qty-$jum;
					_this()->db->where('gin_id',$o->gin_id);
					_this()->db->update('inv_gin',$gin);
					$stok=_this()->query->row("SELECT stock_id,stock FROM inv_stock 
						WHERE tenant_id=".$tenant_id." AND item_id=".$barang[$i]." AND unit_id=".$unit_id."");
					$arrStock=array();
					$arrStock['stock']=$stok->stock-$jum;
					_this()->db->where('stock_id',$stok->stock_id);
					_this()->db->update('inv_stock',$arrStock);
				}
				break;
			}
		}
	}
	$sell=array();
	$sell['total']=$tot;
	if($auto_posting=='Y'){
		$sell['posted']=1;
		$sell['payment_id']=$payment_id;
		$payment=array();
		$payment['debit']=$tot;
		if($auto_payment=='Y'){
			$payment_det=array();
			$payment_det['debit']=$tagTot;
			_this()->db->where('payment_detail_id',$payment_detail_first_id);
			_this()->db->update('payment_detail',$payment_det);
			
			$payment_det=array();
			$payment_det['kredit']=$tagTot;
			_this()->db->where('payment_detail_id',$payment_detail_id);
			_this()->db->update('payment_detail',$payment_det);
			$payment['kredit']=$tot;
			if($tot==$tagTot){
				$payment['paid']=1;
			}
		}
		_this()->db->where('payment_id',$payment_id);
		_this()->db->update('payment',$payment);
	}
	_this()->db->where('sell_emp_id',$pid);
	_this()->db->update('inv_sell_emp',$sell);
	
	
	_this()->query->end();
	_message_save('Nomor Jual', $no_jual );
}
function getEmployeeNameById($id){
	$row=_this()->query->row("SELECT CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name 
		FROM app_employee WHERE employee_id=".$id);
	if($row){
		return $row->name;
	}else{
		return '';
	}	
}
function getPercentPaymentTypeById($id){
	$row=_this()->query->row("SELECT percentage
		FROM payment_type WHERE payment_type_id=".$id);
	if($row){
		return $row->percentage;
	}else{
		return 100;
	}
}
// function pay(){
	// //Import the PhpJasperLibrary
	// _load('PHPJasperXML');
	// _load('tcpdf/tcpdf');
	// //database connection details
	// $server="192.168.0.11";
	// $db="lcs_ims";
	// $user="web";
	// $pass="abc123@#";
	// $version="0.8b";
	// $pgport=5432;
	// $pchartfolder="./class/pchart2";
	// //display errors should be off in the php.ini file
	// ini_set('display_errors', 0);
	// //setting the path to the created jrxml file

	// $xml=  simplexml_load_file("test.jrxml");

	// $PHPJasperXML= new PHPJasperXML();
	// //$PHPJasperXML->debugsql=true;
	// $PHPJasperXML->arrayParameter=array("Parameter1"=>'awdwd');
	// $PHPJasperXML->xml_dismantle($xml);
	// // $PHPJasperXML->arraybackground=array();
	// $PHPJasperXML->arraysqltable=array(
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd'),
		// array('satu'=>'dawd','dua'=>'awd')
	// );
	// // $PHPJasperXML->transferDBtoArray($server,$user,$pass,$db);
	// $PHPJasperXML->outpage("I"); 
	// //page output method I:standard output  D:Download file
// }
function getEmployeeByNumber(){
	$i=_get('i');
	$res=_this()->query->row("SELECT employee_id AS i,
		CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS text
		FROM app_employee WHERE id_number='".$i."'
	");
	if($res){
		_data($res);
	}else{
		_data(null);
	}
}
function getItemByBarcode(){
	$i=_get('i');
	$now=new DateTime();
	$res=_this()->query->row("SELECT ITEM.barcode,ITEM.item_id AS i,CONCAT(ITEM.item_code,' - ',ITEM.item_name) AS NAME, 
		SUM((M.qty-M.qty_out)/IM.fraction) AS stock,IM.fraction AS frac, IFNULL((SELECT PRC.price FROM inv_stock_price PRC 
		WHERE PRC.item_id=ITEM.item_id AND PRC.unit_id=".getSetting('KOPERASI_SELL','UNIT_ID')." AND PRC.tenant_id=ITEM.tenant_id AND PRC.start_on<='".$now->format('Y-m-d')."' AND PRC.end_on>='".$now->format('Y-m-d')."' LIMIT 1),
		IFNULL(S.price,0)) AS harga ,
		ITEM.active_flag AS a,
		SAT_S.measurement_name AS sat_s,
		SAT_S.measurement_id AS sat_id 
		FROM inv_gin M 
		INNER JOIN inv_item ITEM ON ITEM.item_id=M.item_id 
		INNER JOIN inv_item_measurement IM ON IM.item_id=ITEM.item_id AND IM.sell_flag=1 
		LEFT JOIN inv_measurement SAT_S ON SAT_S.measurement_id=ITEM.measurement_sell 
		LEFT JOIN inv_stock S ON S.item_id=ITEM.item_id AND S.tenant_id=ITEM.tenant_id AND S.unit_id=".getSetting('KOPERASI_SELL','UNIT_ID')." 
		WHERE M.tenant_id="._this()->pagesession->get()->tenant_id." AND M.qty>0 AND M.unit_id=2 AND ITEM.active_flag=1 AND ITEM.barcode='".$i."'
		GROUP BY ITEM.barcode
	");
	if($res){
		_data($res);
	}else{
		_data(null);
	}
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
	$unit_id=getSetting('KOPERASI_SELL','UNIT_ID');
	$now=new DateTime();
	$entity=' inv_gin';
	$criteria=" WHERE";
	$inner='	INNER JOIN inv_item ITEM ON ITEM.item_id=M.item_id
				INNER JOIN inv_item_measurement IM ON IM.item_id=ITEM.item_id AND IM.sell_flag=1
				LEFT JOIN inv_measurement SAT_S ON SAT_S.measurement_id=ITEM.measurement_sell
				LEFT JOIN inv_stock S ON S.item_id=ITEM.item_id AND S.tenant_id=ITEM.tenant_id AND S.unit_id='.$unit_id.'
			';
	$criteria.="  M.tenant_id="._this()->pagesession->get()->tenant_id;
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
	
	$orderBy=' ORDER BY ITEM.item_code ASC';
	$total=_this()->query->row("SELECT COUNT(X.item_code) AS total FROM(SELECT ITEM.item_code FROM ".$entity." M  ".$inner." ".$criteria." GROUP BY M.gin_code)X");
	$res=_this()->query->result("SELECT ITEM.barcode,ITEM.item_id AS i,CONCAT(ITEM.item_code,' - ',ITEM.item_name) as name,
		sum((M.qty-M.qty_out)/IM.fraction) AS stock,IM.fraction AS frac,
		IFNULL((SELECT PRC.price FROM inv_stock_price PRC WHERE PRC.item_id=ITEM.item_id AND PRC.unit_id=".$unit_id." AND 
			PRC.tenant_id=ITEM.tenant_id AND PRC.start_on<='".$now->format('Y-m-d')."' AND PRC.end_on>='".$now->format('Y-m-d')."' LIMIT 1),IFNULL(S.price,0)) AS harga
		,ITEM.active_flag AS a,SAT_S.measurement_name AS sat_s,SAT_S.measurement_id AS sat_id
				FROM ".$entity." M ".$inner." ".$criteria." GROUP BY ITEM.item_code  ".$orderBy.' LIMIT '.$size.' OFFSET '.$first.' ');
	_data($res)->setTotal($total->total);
}