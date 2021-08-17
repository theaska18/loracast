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
	$entity=' inv_item';
	$criteria=" WHERE";
	$inner='	INNER JOIN app_parameter_option TYPE ON TYPE.option_code=M.item_type 
				INNER JOIN inv_measurement SAT_B ON SAT_B.measurement_id=M.measurement_buy
				INNER JOIN inv_measurement SAT_K ON SAT_K.measurement_id=M.measurement_small
			';
	$criteria.=" M.tenant_id="._this()->pagesession->get()->tenant_id;
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
	$res=_this()->query->result("SELECT item_id AS i,CONCAT(item_code,' - ',item_name) as name,TYPE.option_name AS type,
		SAT_B.measurement_name AS mou,description AS description,
		M.active_flag AS a,SAT_K.measurement_name AS sat_k
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function toExcel(){
	$start=_get('f1');
	$start=$start->format('Y-m-d');
	$end=_get('f2');
	$end=$end->format('Y-m-d');
	$barang=_get('barang');
	$unit=getSetting('INV_REPORT_B_2','UNIT_ID');
	$tenant=_this()->pagesession->get()->tenant_id;
	$queryItem="SELECT M.item_name,MEA.measurement_name FROM inv_item M 
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_small WHERE M.item_id=".$barang;
	$obj=_this()->query->row($queryItem);
	$query="SELECT * FROM(SELECT 0 AS tag,''AS tanggal,'SALDO' AS description,CASE WHEN SUM(X.qty) > 0 THEN SUM(X.qty) ELSE 0 END AS qty_in,CASE WHEN SUM(X.qty) < 0 THEN SUM(X.qty) ELSE 0 END AS qty_out,0 AS price FROM(
SELECT qty FROM inv_mutasi WHERE unit_id=".$unit." AND item_id=".$barang." AND years=YEAR('".$start."') AND MONTH=MONTH('".$start."') AND tenant_id=".$tenant." 
UNION ALL
SELECT qty*fraction AS qty FROM inv_receive_detail D INNER JOIN inv_receive M ON M.receive_id=D.receive_id 
	WHERE M.posted=1 AND M.unit_id=".$unit." AND D.item_id=".$barang." AND receive_on>=CONCAT(YEAR('".$start."'),'-',MONTH('".$start."'),'-01') AND receive_on<'".$start."'
UNION ALL 
SELECT (D.qty)*-1 AS qty FROM inv_dist_partners_detail D INNER JOIN inv_dist_partners M ON M.dist_id=D.dist_id 
	INNER JOIN inv_trans_partners_detail D2 ON D2.trans_detail_id=D.trans_detail_id
	WHERE M.posted=1 AND M.unit_id=".$unit." AND D2.item_id=".$barang." AND dist_on>=CONCAT(YEAR('".$start."'),'-',MONTH('".$start."'),'-01') AND dist_on<'".$start."'
UNION ALL 
SELECT (D.qty*D.fraction)*-1 AS qty FROM inv_sell_emp_detail D INNER JOIN inv_sell_emp M ON M.sell_emp_id=D.sell_emp_id 
	INNER JOIN inv_gin G ON G.gin_id=D.gin_id
	WHERE M.posted=1 AND M.unit_id=".$unit." AND G.item_id=".$barang." AND sell_date>=CONCAT(YEAR('".$start."'),'-',MONTH('".$start."'),'-01') AND sell_date<'".$start."'
UNION ALL
SELECT CASE WHEN D.qty>0 THEN (D.qty) ELSE (D.qty)*-1 END AS qty FROM inv_adjusment_detail D INNER JOIN inv_adjusment M ON M.adjusment_id=D.adjusment_id 
	INNER JOIN inv_gin G ON G.gin_id=D.gin_id
	WHERE M.unit_id=".$unit." AND G.item_id=".$barang." AND create_on>=CONCAT(YEAR('".$start."'),'-',MONTH('".$start."'),'-01') AND create_on<'".$start."'
)X


UNION ALL
SELECT 1 AS tag,CONCAT(receive_on,' ',TIME(M.create_on)) AS tanggal,CONCAT('Penerimaan : ',receive_number,' - ',DIS.distributor_name) AS description,qty*fraction AS qty_in,0 AS qty_out,D.general_price AS price FROM inv_receive_detail D INNER JOIN inv_receive M ON M.receive_id=D.receive_id 
	INNER JOIN inv_distributor DIS ON DIS.distributor_id=M.distributor_id
	WHERE M.posted=1 AND M.unit_id=".$unit." AND D.item_id=".$barang." AND receive_on>='".$start."' AND receive_on<='".$end."'
UNION ALL 
SELECT 1 AS tag,CONCAT(dist_on,' ',TIME(M.create_on)) AS tanggal, CONCAT('Distribusi : ',dist_code,' - ',PART.partners_name) AS description,0 AS qty_in,(D.qty) AS qty_out,price/fraction AS price 
	FROM inv_dist_partners_detail D INNER JOIN inv_dist_partners M ON M.dist_id=D.dist_id 
	INNER JOIN inv_trans_partners_detail D2 ON D2.trans_detail_id=D.trans_detail_id
	INNER JOIN inv_partners PART ON PART.partners_id=M.partners_id
	WHERE M.posted=1 AND M.unit_id=".$unit." AND D2.item_id=".$barang." AND dist_on>='".$start."' AND dist_on<='".$end."'
UNION ALL 
SELECT 1 AS tag,CONCAT(sell_date,' ',TIME(M.create_on)) AS tanggal, CONCAT('Penjualan : ',sell_emp_code) AS description,0 AS qty_in,(D.qty*D.fraction)AS qty_out,price/fraction AS price FROM inv_sell_emp_detail D INNER JOIN inv_sell_emp M ON M.sell_emp_id=D.sell_emp_id 
	INNER JOIN inv_gin G ON G.gin_id=D.gin_id
	WHERE M.posted=1 AND M.unit_id=".$unit." AND G.item_id=".$barang." AND sell_date>='".$start."'AND sell_date<='".$end."'
UNION ALL
SELECT 1 AS tag,create_on AS tanggal, CONCAT('Adjustment : ',M.adjusment_code) AS description,CASE WHEN D.qty>0 THEN D.qty ELSE 0 END AS qty_in,CASE WHEN D.qty<0 THEN (D.qty*-1) ELSE 0 END AS qty_out,G.general_price AS price FROM inv_adjusment_detail D INNER JOIN inv_adjusment M ON M.adjusment_id=D.adjusment_id 	
	INNER JOIN inv_gin G ON G.gin_id=D.gin_id
	WHERE M.unit_id=".$unit." AND G.item_id=".$barang." AND create_on>='".$start." 00:00:00' AND create_on<='".$end." 24:00:00'
)Y
ORDER BY Y.tag,Y.tanggal";
	
	$res=_this()->query->result($query);
	// echo json_encode($res);
	_this()->load->library('PHPExcel');
	$objReader = PHPExcel_IOFactory::createReader('Excel2007');
	$objPHPExcel    = new PHPExcel();
	$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(7);
	$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
	$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(40);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
	$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
	$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
	$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
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
	$objPHPExcel->getActiveSheet()->getStyle('A4:F4')->applyFromArray($styleArrayHeader);
	
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
	$objPHPExcel->getActiveSheet()->getStyle("A4:F4")->applyFromArray($styleArray);
	
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
	// $objPHPExcel->getActiveSheet()->getStyle("A2:K".(count($res)+1))->applyFromArray($styleArrayDetail);
	
	$objPHPExcel->setActiveSheetIndex(0)
		->setCellValue('A4', 'No.')
		->setCellValue('B4', 'Tanggal/Waktu')
		->setCellValue('C4', 'Deskripsi')
		// ->setCellValue('D4', 'Harga')
		->setCellValue('D4', 'Masuk')
		->setCellValue('E4', 'Keluar')
		// ->setCellValue('F4', 'Total')
		->setCellValue('F4', 'Saldo');
	
	$ex = $objPHPExcel->setActiveSheetIndex(0);
		$no=1;
		$saldo=0;
		$ex->setCellValue('B1','Nama Barang :');
		$ex->setCellValue('C1',$obj->item_name);
		$ex->setCellValue('B2','Periode :');
		$ex->setCellValue('C2',$start.' - '.$end);
		$ex->setCellValue('B3','Satuan :');
		$ex->setCellValue('C3',$obj->measurement_name);
		for($i=0,$iLen=count($res);$i<$iLen;$i++){
			$obj=$res[$i];
			$ex->setCellValue('A'.($i+5), $no++);
			$ex->setCellValue('B'.($i+5), $obj->tanggal);
			$ex->setCellValue('C'.($i+5), $obj->description);
			// $ex->setCellValue('D'.($i+5), $obj->price);
			$saldo+=$obj->qty_in;
			$saldo-=$obj->qty_out;
			if($obj->tag!==0){
				$ex->setCellValue('D'.($i+5), $obj->qty_in);
				$ex->setCellValue('E'.($i+5), $obj->qty_out);
			}else{
				$ex->setCellValue('D'.($i+5), 0);
				$ex->setCellValue('E'.($i+5), 0);
			}
			// $jum=$obj->qty_in*$obj->price;
			// if($obj->qty_in==0){
				// $jum=$obj->qty_out*$obj->price;
			// }
			// $ex->setCellValue('F'.($i+5), $jum);
			$ex->setCellValue('F'.($i+5), $saldo);
			$objPHPExcel->getActiveSheet()->getStyle("A".($i+5).":F".($i+5))->applyFromArray($styleArrayDetail);
		}
	$objPHPExcel->getProperties()->setCreator(_this()->pagesession->get()->user_code)
		->setLastModifiedBy(_this()->pagesession->get()->user_code)
		->setTitle("Kartu Stok ".$obj->item_name)
		->setSubject("Kartu Stok ".$obj->item_name)
		->setDescription("Kartu Stok ".$obj->item_name)
		->setKeywords("Kartu Stok ".$obj->item_name)
		->setCategory("Kartu Stok ".$obj->item_name);
	$objPHPExcel->getActiveSheet()->setTitle('Kartu Stok');
	$objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	ob_end_clean();
	header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
	header('Chace-Control: no-store, no-cache, must-revalation');
	header('Chace-Control: post-check=0, pre-check=0', FALSE);
	header('Pragma: public');
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="Kartu Stok '.$obj->item_name.' '. date('Ymd') .'.xlsx"');
	ob_end_clean();
	$objWriter->save('php://output');
	return false;
}