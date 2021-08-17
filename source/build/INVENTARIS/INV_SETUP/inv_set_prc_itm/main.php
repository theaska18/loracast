<?php
function toExcel(){
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$type=_get('f4',false);
	$active=_get('f5',false);
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner='	INNER JOIN app_parameter_option M1 ON M1.option_code=M.item_type
			';
	$criteria.=" M.tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(item_name) like upper('%".$name."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(description) like upper('%".$desc."%')";
	if($type != null && $type !='')
		$criteria.=" AND item_type='".$type."'";
	if($active != null && $active !=''){
		if($active=='Y')
			$criteria.=' AND M.active_flag=true ';
		else
			$criteria.=' AND M.active_flag=false ';
	}
	
	$orderBy=' ORDER BY ';
	$direction='ASC';
	$orderBy.='item_code '.$direction;
	
	$res=_this()->query->result("SELECT item_name,permission_number
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy);
	
	_this()->load->library('PHPExcel');
	$objPHPExcel    = new PHPExcel();
	//setting Width
	$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(7);
	$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(36);
	$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(38);
	$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(17);
	$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(31);
	$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(22);
	$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(33);
	
	
	
	//style untuk header
	$styleArrayHeader=array(
		'fill' => array(
            'type' => PHPExcel_Style_Fill::FILL_SOLID,
            'color' => array('rgb' => '2F4F4F')
        ),
		'font' => array(
			'bold' => true,
			'size' => 10,
			'color' => array('rgb' => 'FFFFFF')
		)
	);
	$objPHPExcel->getActiveSheet()->getStyle('A1:K1')->applyFromArray($styleArrayHeader);
	
	//style untuk default
	$styleArrayDefault = array(
		'font' => array(
			'name' => 'Calibri'
		)
	);
	$objPHPExcel->getDefaultStyle()->applyFromArray($styleArrayDefault);
	
	//style border
	$styleArray = array(
		'borders' => array(
			'allborders' => array(
				'style' => PHPExcel_Style_Border::BORDER_THIN
			)
		)
	);
	$objPHPExcel->getActiveSheet()->getStyle("A1:K1")->applyFromArray($styleArray);
	
	//style detail
	$styleArrayDetail = array(
		'borders' => array(
			'allborders' => array(
				'style' => PHPExcel_Style_Border::BORDER_THIN
			)
		),
		'fill' => array(
            'type' => PHPExcel_Style_Fill::FILL_SOLID,
            'color' => array('rgb' => '00FA9A')
        ),
		'font' => array(
			'size' => 11
		)
	);
	$objPHPExcel->getActiveSheet()->getStyle("A2:K".(count($res)+1))->applyFromArray($styleArrayDetail);
	
	$objPHPExcel->setActiveSheetIndex(0)
		->setCellValue('A1', 'No.')
		->setCellValue('B1', 'Nama Dagang/Merk')
		->setCellValue('C1', 'Nomor Izin Edar')
		->setCellValue('D1', 'Tipe')
		->setCellValue('E1', 'Ukuran')
		->setCellValue('F1', 'Kemasan')
		->setCellValue('G1', 'Stok');
        
        $ex = $objPHPExcel->setActiveSheetIndex(0);
		$no=1;
		for($i=0,$iLen=count($res);$i<$iLen;$i++){
			$obj=$res[$i];
			$ex->setCellValue('A'.($i+2), $no++);
			$ex->setCellValue('B'.($i+2), $obj->item_name);
			$ex->setCellValue('C'.($i+2), $obj->permission_number);
			$ex->setCellValue('D'.($i+2), '');
			$ex->setCellValue('E'.($i+2), '');
			$ex->setCellValue('F'.($i+2), '');
			$ex->setCellValue('G'.($i+2), 0);
		}
		
		
		
		$objPHPExcel->getProperties()->setCreator(_this()->pagesession->get()->user_code)
            ->setLastModifiedBy(_this()->pagesession->get()->user_code)
            ->setTitle("Export Item")
            ->setSubject("Export Item")
            ->setDescription("Export Item")
            ->setKeywords("Export Item")
            ->setCategory("Export Item");
        $objPHPExcel->getActiveSheet()->setTitle('Export Item');
        
        $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
        header('Chace-Control: no-store, no-cache, must-revalation');
        header('Chace-Control: post-check=0, pre-check=0', FALSE);
        header('Pragma: no-cache');
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="ExportDataItem'. date('Ymd') .'.xlsx"');
        
        $objWriter->save('php://output');
	return false;
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$unit=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$now=new DateTime();
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner='	
		LEFT JOIN inv_stock S ON S.item_id=M.item_id AND S.tenant_id=M.tenant_id AND S.unit_id='.$unit.'
		INNER JOIN inv_item_measurement IM ON IM.item_id=M.item_id 
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=IM.measurement_id
		LEFT JOIN inv_stock_price_measurement SPM ON SPM.stock_id=S.stock_id AND SPM.measurement_id=MEA.measurement_id
	';
	$criteria.=" M.active_flag=1 AND M.tenant_id="._session()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(item_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(item_name) like upper('%".$name."%')";
	
	$orderBy=' ORDER BY item_name ASC ';
	$total=_this()->query->row("SELECT count(item_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT M.item_id AS i,CONCAT(item_name,' - ',M.item_code) AS f1, 
		CONCAT(MEA.measurement_name,CASE WHEN M.item_type='ITEMTYPE_JASA' THEN '' ELSE CASE WHEN IM.buy_flag=1 AND IM.sell_flag=0 THEN ' (Beli)'  WHEN IM.buy_flag=0 AND IM.sell_flag=1 THEN ' (Jual)' ELSE '' END END) AS f3
		, IFNULL(SPM.price,0) AS f4,
		IFNULL((SELECT PRC.price FROM inv_stock_price PRC WHERE PRC.item_id=M.item_id AND PRC.unit_id=".$unit." AND 
				PRC.tenant_id=M.tenant_id AND PRC.measurement_id=MEA.measurement_id AND PRC.start_on<='".$now->format('Y-m-d')."' AND PRC.end_on>='".$now->format('Y-m-d')."' LIMIT 1),IFNULL(SPM.price,0)) AS f5,
				CASE WHEN M.item_type='ITEMTYPE_JASA' THEN 'Jasa' ELSE
					IFNULL((SELECT S.buy_price/S.fraction FROM inv_receive_detail S
			INNER JOIN inv_receive R ON R.receive_id=S.receive_id
			WHERE R.tenant_id=M.tenant_id AND S.item_id=M.item_id AND R.posted=1 AND R.unit_id=".$unit." ORDER BY R.receive_on DESC, S.create_on DESC limit 1),0)*IM.fraction END AS f2,
			CASE WHEN M.item_type='ITEMTYPE_JASA' THEN 'Jasa' ELSE
			IM.fraction END AS f6,MEA.measurement_id AS f7
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.',IM.fraction LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function getListRekanan(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$pid=_get('pid',false);
	$measurement_id=_get('measurement_id');
	$unit=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$now=new DateTime();
	if($pid !=''){
		$entity=' inv_partners';
		$criteria=" WHERE";
		$inner='	
			LEFT JOIN inv_partners_price P ON P.unit_id='.$unit.' AND P.partners_id=M.partners_id AND P.item_id='.$pid.' AND P.measurement_id='.$measurement_id.'
			INNER JOIN inv_item I ON I.item_id='.$pid.'
			LEFT JOIN inv_stock S ON S.item_id=I.item_id AND S.tenant_id=M.tenant_id AND S.unit_id='.$unit.'
			LEFT JOIN inv_stock_price_measurement SPM ON SPM.stock_id=S.stock_id AND SPM.measurement_id='.$measurement_id.'
			INNER JOIN inv_measurement MEA ON MEA.measurement_id='.$measurement_id.'
		';
		$criteria.=" M.active_flag=1  AND M.tenant_id="._session()->tenant_id;
		if($code != null && $code !='')
			$criteria.=" AND upper(partners_code) like upper('%".$code."%')";
		if($name != null && $name !='')
			$criteria.=" AND upper(partners_name) like upper('%".$name."%')";
		
		$orderBy=' ORDER BY ';
		if($direction == null)
			$direction='ASC';
		switch ($sorting){
			case "f2": 
				$orderBy.='partners_name '.$direction;
				break;
			case "f1": 
				$orderBy.='partners_code '.$direction;
				break;
			default:
				$orderBy.='partners_name '.$direction;
				break;
		}
		$total=_this()->query->row("SELECT count(M.partners_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
		$res=_this()->query->result("SELECT M.partners_id AS i,CONCAT(partners_name,' - ',M.partners_code) AS f1, MEA.measurement_name AS f3, 
			IFNULL(P.price,IFNULL((SELECT PRC.price FROM inv_stock_price PRC WHERE PRC.item_id=I.item_id AND PRC.unit_id=".$unit." AND 
				PRC.tenant_id=I.tenant_id AND PRC.measurement_id=MEA.measurement_id AND PRC.start_on<='".$now->format('Y-m-d')."' AND PRC.end_on>='".$now->format('Y-m-d')."' LIMIT 1),IFNULL(SPM.price,0))) AS f4,
				CASE WHEN P.price is NULL THEN 0 ELSE 1 END AS f5
					FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
		_data($res)->setTotal($total->total);
	}
}
function getListJadwal(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$unit=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$measurement_id=_get('measurement_id');
	$pid=_get('item_id');
	$now=new DateTime();
	$tenant=_session()->tenant_id;
	if($pid !=''){
		$entity=' inv_stock_price';
		$criteria=" WHERE";
		$inner='	
			INNER JOIN inv_item I ON I.item_id=M.item_id
		';
		$criteria.=" M.item_id=".$pid." AND M.unit_id=".$unit."  AND M.end_on>='".$now->format('Y-m-d')."' AND M.measurement_id=".$measurement_id."
			AND M.tenant_id="._session()->tenant_id;
		
		$orderBy=' ORDER BY M.start_on ';
		$direction='ASC';
		$total=_this()->query->row("SELECT count(M.price_id) AS total FROM ".$entity." M  ".$inner." ".$criteria);
		$res=_this()->query->result("SELECT M.price_id AS i,M.start_on AS f1,M.end_on AS f2, M.description AS f3,M.price AS f4
					FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy);
		_data($res)->setTotal($total->total);
	}
}
function initUpdatePricePartners(){
	$partners=_post('partners');
	$price=_post('price');
	$item=_post('item');
	$measurement_id=_post('measurement_id');
	$unit=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$tenant=_session()->tenant_id;
	$jum=_this()->query->row("SELECT price_id FROM inv_partners_price WHERE partners_id=".$partners." AND item_id=".$item." 
		AND unit_id=".$unit." AND measurement_id=".$measurement_id." AND tenant_id=".$tenant);
	$arr=array();
	$arr['price']=(double)$price;
	if($jum){
		_this()->db->where('price_id',$jum->price_id);
		_this()->db->update('inv_partners_price',$arr);
	}else{
		$pid=_getTableSequence('inv_partners_price');
		$arr['price_id']=(double)$pid;
		$arr['partners_id']=(double)$partners;
		$arr['measurement_id']=(double)$measurement_id;
		$arr['item_id']=(double)$item;
		$arr['unit_id']=(double)$unit;
		$arr['tenant_id']=(double)$tenant;
		_this()->db->insert('inv_partners_price',$arr);
	}	
}
function initUpdatePrice(){
	$price=_post('price');
	$item=_post('item');
	$unit=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$measurement_id=_post('measurement_id');
	$tenant=_session()->tenant_id;
	$stock=_this()->query->row("SELECT stock_id FROM inv_stock WHERE item_id=".$item." 
		AND unit_id=".$unit." AND tenant_id=".$tenant);
	if($stock == null){
		$pid=_getTableSequence('inv_stock');
		$arr=array();
		$arr['stock_id']=(double)$pid;
		$arr['item_id']=(double)$item;
		$arr['unit_id']=(double)$unit;
		$arr['tenant_id']=(double)$tenant;
		_this()->db->insert('inv_stock',$arr);
	}else{
		$pid=$stock->stock_id;
	}
	$stock_mea=_this()->query->row("SELECT price_id FROM inv_stock_price_measurement WHERE stock_id=".$pid." 
		AND measurement_id=".$measurement_id);
	$arr=array();
	$arr['price']=(double)$price;
	if($stock_mea){
		_this()->db->where('price_id',$stock_mea->price_id);
		_this()->db->update('inv_stock_price_measurement',$arr);
	}else{
		$pid2=_getTableSequence('inv_stock_price_measurement');
		$arr=array();
		$arr['price_id']=(double)$pid2;
		$arr['stock_id']=(double)$pid;
		$arr['measurement_id']=(double)$measurement_id;
		_this()->db->insert('inv_stock_price_measurement',$arr);
	}
}
function resetHargaPartners(){
	$item=_post('item');
	$measurement_id=_post('measurement_id');
	$unit=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$tenant=_session()->tenant_id;
	_this()->query->set("DELETE FROM inv_partners_price WHERE item_id=".$item." AND measurement_id=".$measurement_id."
		AND unit_id=".$unit." AND tenant_id=".$tenant);
}
function saveJadwal(){
	$unit_id=getSetting('INV_SET_PRC_ITM','UNIT_ID',false);
	$item_id=_post('item_id');
	$measurement_id=_post('measurement_id');
	$start=_post('f1');
	$end=_post('f2');
	if($end==''){
		$end="null";
	}else{
		$end="'".$end->format('Y-m-d')."'";
	}
	$description=_post('f3');
	$harga=_post('f4');
	$tenant=_session()->tenant_id;
	$pid=_getTableSequence('inv_stock_price');
	_this()->query->set("INSERT INTO inv_stock_price(price_id,item_id,unit_id,tenant_id,measurement_id,description,start_on,end_on,price)VALUES
				(".$pid.",".$item_id.",".$unit_id.",".$tenant.",".$measurement_id.",'".$description."','".$start->format('Y-m-d')."',".$end.",".$harga.")");
	_message('Jadwal Ditambahkan.');
}
function deleteJadwal(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT price_id FROM inv_stock_price WHERE price_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_stock_price WHERE price_id=".$pid);
		_message('Jadwal diHapus.');
	}else
		_not_found();
}