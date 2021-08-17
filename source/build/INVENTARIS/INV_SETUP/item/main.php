<?php
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT description AS f3,item_type as f4,active_flag AS f5,
			expire_alert AS f10, expire_date AS f11, item_form AS f12,factory_id AS f13, category_id AS f14,
			permission_number AS f15,min_stok AS f16,photo AS f17,stok_alert AS f18,barcode AS f19,id_produk AS f20,kode_produk AS f21,measurement_type AS f22,dimension AS f23,multi_gin_flag AS f24
		FROM inv_item WHERE item_id=".$pid);
	$list= _this()->query->result("SELECT measurement_id AS f1,small_flag as f2,buy_flag AS f3,
		storage_flag AS f4, sell_flag AS f5, fraction AS f6 FROM inv_item_measurement WHERE item_id=".$pid." ORDER BY create_on ASC ");
	if($ori){
		$data=array();
		$data['o']=$ori;
		$data['l']=$list;
		_data($data);
	}else
		_not_found();
}
function toExcel(){
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$type=_get('f4',false);
	$active=_get('f5',false);
	$barcode=_get('f6',false);
	$id_produk=_get('f7',false);
	$kode_produk=_get('f8',false);
	
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
	if($barcode != null && $barcode !='')
		$criteria.=" AND barcode='".$barcode."'";
	if($id_produk != null && $id_produk !='')
		$criteria.=" AND id_produk='".$id_produk."'";
	if($kode_produk != null && $kode_produk !='')
		$criteria.=" AND kode_produk='".$kode_produk."'";
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
		
		
		
		$objPHPExcel->getProperties()->setCreator(_session()->user_code)
            ->setLastModifiedBy(_session()->user_code)
            ->setTitle("Export Item")
            ->setSubject("Export Item")
            ->setDescription("Export Item")
            ->setKeywords("Export Item")
            ->setCategory("Export Item");
        $objPHPExcel->getActiveSheet()->setTitle('Export Item');
        
        $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        ob_end_clean();
        header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
        header('Chace-Control: no-store, no-cache, must-revalation');
        header('Chace-Control: post-check=0, pre-check=0', FALSE);
        header('Pragma: public');
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //header('Content-Type: application/vnd.oasis.opendocument.spreadsheet');
        header('Content-Disposition: attachment;filename="ExportDataItem'. date('Ymd') .'.xlsx"');
		ob_end_clean();
		
		 // $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'OpenDocument');
		// header('Content-Type: application/vnd.oasis.opendocument.spreadsheet');
		// header('Content-Disposition: attachment;filename="ExportDataItem'. date('Ymd') .'.ods"');
		// header('Cache-Control: max-age=0');
		// // If you're serving to IE 9, then the following may be needed
		// header('Cache-Control: max-age=1');
		// // If you're serving to IE over SSL, then the following may be needed
		// header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
		// header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
		// header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
		// header ('Pragma: public'); // HTTP/1.0
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
	$desc=_get('f3',false);
	$type=_get('f4',false);
	$active=_get('f5',false);
	$barcode=_get('f6',false);
	$id_produk=_get('f7',false);
	$kode_produk=_get('f8',false);
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
	if($barcode != null && $barcode !='')
		$criteria.=" AND barcode='".$barcode."'";
	if($id_produk != null && $id_produk !='')
		$criteria.=" AND id_produk='".$id_produk."'";
	if($kode_produk != null && $kode_produk !='')
		$criteria.=" AND kode_produk='".$kode_produk."'";
	if($active != null && $active !=''){
		if($active=='Y')
			$criteria.=' AND M.active_flag=true ';
		else
			$criteria.=' AND M.active_flag=false ';
	}
	
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
	$res=_this()->query->result("SELECT item_id AS i,item_code AS f1,item_name AS f2,description AS f3, M1.option_name AS f4,M.active_flag AS f5
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pageType=_post('p');
	$pid=_post('i');
	$code=_post('f1');
	$name=_post('f2');
	$description=_post('f3');
	$type=_post('f4');
	$active=_post('f5');
	$expired=_post('f10');
	$expDay=_post('f11');
	$form=_post('f12');
	$factory=_post('f13');
	$category=_post('f14');
	$noIjin=_post('f15');
	$minStok=_post('f16');
	$image=_post('f17');
	$stokAlert=_post('f18');
	$barcode=_post('f19');
	$id_produk=_post('f20');
	$kode_produk=_post('f21');
	$masurement_type=_post('f22');
	$dimension=_post('f23');
	$multiGin=_post('f24');
	
	$measurements=_post('measurement');
	$small_flags=_post('small_flag');
	$buy_flags=_post('buy_flag');
	$storage_flags=_post('storage_flag');
	$sell_flags=_post('sell_flag');
	$fraction=_post('fraction');
	
	$small=null;
	$buy=null;
	$storage=null;
	$sell=null;
	for($i=0,$iLen=count($measurements); $i<$iLen ;$i++){
		if($small_flags[$i]=='true'){
			$small=$measurements[$i];
		}
		if($buy_flags[$i]=='true'){
			$buy=$measurements[$i];
		}
		if($storage_flags[$i]=='true'){
			$storage=$measurements[$i];
		}
		if($sell_flags[$i]=='true'){
			$sell=$measurements[$i];
		}
	}
	if($pageType=='ADD'){
		$allow=true;
		if($code==''){
			$a=false;
			$sequenceCode=getSetting('ITEM','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT item_id FROM inv_item WHERE item_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$code=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT item_id FROM inv_item WHERE item_code='".$code."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$pid=_getTableSequence('inv_item');
			_load('lib/lib_image');
			$sqlPhoto='';
			$sqlPhoto2='';
			if($image == null || $image !==true){
				$file=_this()->lib_image->upload($image,'jpg');
				$sqlPhoto=',photo';
				$sqlPhot2=",'".$file."'";
			}
			$queryBarang='';
			$queryBarang2='';
			if($type=='ITEMTYPE_BARANG'){
				$queryBarang=",expire_alert,expire_date,item_form".$sqlPhoto.",category_id,
					factory_id,permission_number,min_stok,stok_alert,barcode,id_produk,kode_produk,multi_gin_flag";
				if($expDay==''){
					$expDay=0;
				}
				$queryBarang2=",".$expired.",".$expDay.",'".$form."','".$file."'".$sqlPhoto2.",".$category.",".$factory.",
					'".$noIjin."',".$minStok.",".$stokAlert.",'".$barcode."','".$id_produk."','".$kode_produk."',".$multiGin."";	
			}
			
			 _this()->query->set("INSERT INTO inv_item(measurement_small,measurement_buy,measurement_storage,measurement_sell,item_id,item_code,item_type,description,item_name,measurement_type,dimension".$queryBarang."
				,active_flag,create_on,create_by,tenant_id)VALUES
					(".$small.",".$buy.",".$storage.",".$sell.",".$pid.",'".$code."','".$type."','".$description."','".$name."','".$masurement_type."','".$dimension."'".$queryBarang2.",
					".$active.",'"._format()."',"._session()->employee_id.","._session()->tenant_id.")");
			for($i=0,$iLen=count($measurements); $i<$iLen ;$i++){
				$dpid=_getTableSequence('inv_item_measurement');
				_this()->query->set("INSERT INTO inv_item_measurement(item_measurement_id,item_id,measurement_id,fraction,small_flag,buy_flag,storage_flag,sell_flag,create_on,create_by)VALUES
					(".$dpid.",".$pid.",".$measurements[$i].",".$fraction[$i].",".$small_flags[$i].",".$buy_flags[$i].",".$storage_flags[$i].",".$sell_flags[$i].",'"._format()."',"._session()->employee_id.")");
			}
			_this()->query->end();
			_message_save('Kode Barang', $code );
		}else{
			_message_exist('Kode Barang',$code);
		}
	}else if($pageType=='UPDATE'){
		
		$sql="measurement_type='".$masurement_type."',dimension='".$dimension."',item_type='".$type."',item_name='".$name."',description='".$description."',active_flag=".$active.",measurement_small=".$small.",measurement_buy=".$buy.",measurement_storage=".$storage.",measurement_sell=".$sell;
		if($type=='ITEMTYPE_BARANG'){
			if($expDay==''){
				$expDay=0;
			}
			$foto=_this()->query->row("SELECT photo FROM inv_item WHERE item_id=".$pid);
			$sql.=",kode_produk='".$kode_produk."',id_produk='".$id_produk."',barcode='".$barcode."',expire_alert=".$expired.",expire_date=".$expDay.",stok_alert=".$stokAlert.",
			item_form='".$form."',factory_id=".$factory.",category_id=".$category.",permission_number='".$noIjin."',min_stok=".$minStok.",multi_gin_flag=".$multiGin;
			
			_load('lib/lib_image');
			if($image == null || $image !==true){
				$file=_this()->lib_image->upload($image,'jpg',$foto->photo);
				$sql.=",photo='".$file."'";
			}
		}
		 _this()->query->set("UPDATE inv_item SET ".$sql.",update_on='"._format()."',update_by="._session()->employee_id."
				WHERE item_id=".$pid);
				
		$listMeasurement=_this()->query->result("SELECT measurement_id FROM inv_item_measurement WHERE item_id=".$pid);
			
		for($i=0,$iLen=count($listMeasurement); $i<$iLen ;$i++){
			$adaData=false;
			for($j=0, $jLen=count($measurements); $j<$jLen; $j++){
				if($measurements[$j]==$listMeasurement[$i]->measurement_id){
					$adaData=true;
					_this()->query->set("UPDATE inv_item_measurement SET small_flag=".$small_flags[$j].",buy_flag=".$buy_flags[$j].",storage_flag=".$storage_flags[$j].",
						sell_flag=".$sell_flags[$j].",fraction=".$fraction[$j]." WHERE item_id=".$pid." AND measurement_id=".$measurements[$j]);
				}
			}
			if($adaData==false){
				_this()->query->set("DELETE FROM inv_item_measurement WHERE item_id=".$pid." AND measurement_id=".$listMeasurement[$i]->measurement_id);
			}
		}
		for($i=0,$iLen=count($measurements); $i<$iLen ;$i++){
			$adaData=false;
			for($j=0, $jLen=count($listMeasurement); $j<$jLen; $j++){
				if($measurements[$i]==$listMeasurement[$j]->measurement_id){
					$adaData=true;
				}
			}
			if($adaData==false){
				$dpid=_getTableSequence('inv_item_measurement');
				_this()->query->set("INSERT INTO inv_item_measurement(item_measurement_id,item_id,measurement_id,fraction,small_flag,buy_flag,storage_flag,sell_flag,create_on,create_by)VALUES
				(".$dpid.",".$pid.",".$measurements[$i].",".$fraction[$i].",".$small_flags[$i].",".$buy_flags[$i].",".$storage_flags[$i].",".$sell_flags[$i].",'"._format()."',"._session()->employee_id.")");
			}
		}
		_this()->query->end();
		_message_update ('Kode Barang', $code );
	}
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT item_code,photo FROM inv_item WHERE item_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_item WHERE item_id=".$pid);
		 _load('lib/lib_image');
		_this()->lib_image->upload(null,'jpg',$res->photo);
		_message_delete('Kode Barang', $res->item_code );
	}else
		_not_found();
}