<?php
function toExcel(){
	$start=_get('f1',false);
	$end=_get('f2',false);
	
	$entity=' inv_trans_partners_detail';
	$criteria=" WHERE";
	$inner='	
		INNER JOIN inv_trans_partners R ON R.trans_id=M.trans_id
		INNER JOIN inv_partners D ON D.partners_id=R.partners_id
		INNER JOIN inv_item I ON I.item_id=M.item_id
		INNER JOIN inv_measurement MEA ON MEA.measurement_id=M.measurement_id
		INNER JOIN inv_gin G ON G.gin_id=M.gin_id
	';
	$criteria.=" R.tenant_id="._this()->pagesession->get()->tenant_id." AND R.unit_id=".getSetting('INV_REPORT_C_3','UNIT_ID');
	if($start != null && $start !='')
		$criteria.=" AND trans_on >='".$start->format('Y-m-d')."' ";
	if($end != null && $end !='')
		$criteria.=" AND trans_on <='".$end->format('Y-m-d')."' ";
	
	$orderBy=' ORDER BY ';
	$direction='ASC';
	$orderBy.='trans_on '.$direction;
	
	$res=_this()->query->result("SELECT I.id_produk,I.item_name,I.permission_number,REPLACE(I.description,'\n',' '),G.batch,I.kode_produk,
		M.qty AS qty,R.trans_on,G.expire_flag,G.expire_date,D.id_partners,D.partners_name
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy);
	
	_this()->load->library('PHPExcel');
	$objReader = PHPExcel_IOFactory::createReader('Excel2007');
	$objPHPExcel = $objReader->load("./source/templates/inventaris/Template Data Distribusi Masuk.xlsx");
	$ex = $objPHPExcel->setActiveSheetIndex(0);
	$no=1;
	$firstNo=7;
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$obj=$res[$i];
		$ex->setCellValue('B'.($i+$firstNo), $obj->id_produk);
		$ex->setCellValue('C'.($i+$firstNo), $obj->item_name);
		$ex->setCellValue('D'.($i+$firstNo), $obj->permission_number);
		$ex->setCellValue('E'.($i+$firstNo), $obj->description);
		$ex->setCellValue('F'.($i+$firstNo), $obj->batch);
		$ex->setCellValue('G'.($i+$firstNo), $obj->kode_produk);
		$ex->setCellValue('H'.($i+$firstNo), $obj->qty);
		$receive=new DateTime($obj->trans_on);
		$ex->setCellValue('I'.($i+$firstNo), $receive->format('Y-m-d'));
		if($obj->expire_flag==1){
			$expire=new DateTime($obj->expire_date);
			$ex->setCellValue('J'.($i+$firstNo), $expire->format('Y-m-d'));
		}else{
			$ex->setCellValue('J'.($i+$firstNo), 'N/A');
		}
		$ex->setCellValue('K'.($i+$firstNo), $obj->id_partners);
		$ex->setCellValue('L'.($i+$firstNo), $obj->partners_name);
	}
	$objPHPExcel->getProperties()->setCreator(_this()->pagesession->get()->user_code)
		->setLastModifiedBy(_this()->pagesession->get()->user_code)
		->setTitle("Export Distribusi Keluar")
		->setSubject("Export Distribusi Keluar")
		->setDescription("Export Distribusi Keluar")
		->setKeywords("Export Distribusi Keluar")
		->setCategory("Export Distribusi Keluar");
	$objPHPExcel->getActiveSheet()->setTitle('Export Distribusi Keluar');
	$objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    ob_end_clean();
	header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
	header('Chace-Control: no-store, no-cache, must-revalation');
	header('Chace-Control: post-check=0, pre-check=0', FALSE);
	header('Pragma: public');
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="Export Distribusi Keluar'. date('Ymd') .'.xlsx"');
	ob_end_clean();
	$objWriter->save('php://output');
	return false;
}