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
function getListPartners(){
	_func('PARTNERS','getListSearch');
}
function toExcel(){
	$start=_get('f1',false);
	$end=_get('f2',false);
	$partners=_get('f3',false);
	$barang=_get('barang');
	//ini_set('memory_limit','512M');
	$sql="SELECT M.trans_on,M.trans_code,P.partners_name,M.due_date,I.item_code,I.item_name,
CONCAT(D.qty/D.fraction,' ',MEA.measurement_name)AS qty ,D.price,(D.qty/D.fraction) AS qty_real,MEA.measurement_name AS measurement_real,
IFNULL((SELECT SUM(PT.debit) FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.payment_id=M.payment_id AND PYT.payment_type_code='PPN'  AND PAI.item_id=D.item_id),0)
  AS ppn , 
IFNULL((SELECT PT.kredit FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.item_id=D.item_id AND PAI.payment_id=M.payment_id AND PYT.payment_type_code='DISC'),0)
  AS discount ,
  IFNULL((SELECT SUM(PT.kredit) FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.payment_id=M.payment_id AND PYT.payment_type_code='DISC' AND PAI.item_id=D.item_id),0)
  AS tot_discount ,
  IFNULL((SELECT PT.percent FROM payment_item PAI 
	INNER JOIN payment_tag PT ON PT.payment_item_id=PAI.payment_item_id
	INNER JOIN payment_detail PD ON PD.payment_detail_id=PT.payment_detail_id
	INNER JOIN payment_type PYT ON PYT.payment_type_id=PD.payment_type_id 
	WHERE PAI.item_id=D.item_id AND PAI.payment_id=M.payment_id AND PYT.payment_type_code='DISC'),0)
 AS dicount_percent, (D.price*(D.qty/D.fraction)) AS tot
FROM inv_trans_partners_detail D
	INNER JOIN inv_trans_partners M ON M.trans_id=D.trans_id
	INNER JOIN inv_partners P ON P.partners_id=M.partners_id
	INNER JOIN inv_item I ON I.item_id=D.item_id
	INNER JOIN inv_measurement MEA ON MEA.measurement_id=D.measurement_id
		WHERE M.unit_id=".getSetting('INV_REPORT_A_6','UNIT_ID')."
		AND M.trans_on>='".$start->format('Y-m-d')."' AND M.trans_on<='".$end->format('Y-m-d')."' ";
	if($partners != null && $partners !=''){
		$sql.=" AND M.partners_id=".$partners." ";
	}
	if($barang != null && $barang !=''){
		$sql.=" AND D.item_id=".$barang." ";
	}
	$sql.=" ORDER BY I.item_code DESC";
	$res=_this()->query->result($sql);
	$html='
			<table>
				<tr>
					<td class="center"><b>Laporan Penjualan Detail Per Barang</b></td>
				</tr>
				<tr>
					<td class="center">Periode : '.$start->format('d M Y').' s/d '.$end->format('d M Y').'</td>
				</tr>
			</table>
			<table border="0" width="100%" >
			<thead>
				<tr>
					<th width="30" class="border-top">No.</th>
					<th class="left border-top" colspan="2" width="170">Tgl. Inv Customer</th>
					<th class="left border-top" width="80">No. Invoice</th>
					<th colspan="2" width="110" class="center border-top">&nbsp;</th>
					<th width="50" class="border-top">Tgl. FP</th>
					<th width="60" class="border-top">&nbsp;</th>
					<th class="right border-top" colspan="2" width="100">Total Harga</th>
					<th class="right border-top" width="50">Discount</th>
					<th class="right border-top" width="50">PPN</th>
					<th class="right border-top" width="50">Biaya</th>
					<th class="right border-top" width="70">Total Tagihan</th>
				</tr>
				<tr>
					<th width="30" class="border-bottom">&nbsp;</th>
					<th class="left border-bottom" width="70">Kode Barang</th>
					<th width="180" class="left border-bottom" >Nama Barang</th>
					<th class="right border-bottom" width="70">Kuantitas</th>
					<th class="border-bottom" width="40">&nbsp;</th>
					<th class="border-bottom" width="50">&nbsp;</th>
					<th class="right border-bottom" width="60">HS. Jual</th>
					<th class="right border-bottom" width="40">Disc(%)</th>
					<th class="border-bottom" width="60">&nbsp;</th>
					<th class="border-bottom" width="50">&nbsp;</th>
					<th class="border-bottom" width="50">&nbsp;</th>
					<th class="border-bottom" width="50">&nbsp;</th>
					<th class="border-bottom" width="70">&nbsp;</th>
				</tr></thead><tbody>';
	$group="";
	$no=1;
	$grand_harga=0;
	$grand_disc=0;;
	$grand_ppn=0;
	$totQty=0;
	$totTagihan=0;
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$d=$res[$i];
		if($group!==$d->item_code){
			$group=$d->item_code;
			if($i!==0){
				$html.='<tr>
					<td  width="280" class="right" colspan="4"><b>Sub Total</b></td>
					<td colspan="2" class="center" width="110"><b>'.$totQty.' '.$d->measurement_real.'</b></td>
					<td width="50">&nbsp;</td>
					<td width="60">&nbsp;</td>
					<td width="40">&nbsp;</td>
					<td class="right" width="60"></td>
					<td class="right" width="50"></td>
					<td class="right" width="50"></td>
					<td class="right" width="50"></td>
					<td class="right" width="70"><b>'.number_format($totTagihan,0,",",".").'</b></td>
				</tr>';
				$totQty=0;
				$totTagihan=0;
			}
			$html.='<tr>
					<td  width="30" class="right">'.$no.'.</td>
					<td class="left" colspan="2" width="170">'.$d->item_code.' '.$d->item_name.' </td>
					<td class="left" width="80">&nbsp;</td>
					<td colspan="2" width="110">&nbsp;</td>
					<td class="right" width="50">&nbsp;</td>
					
					<td width="60">&nbsp;</td>
					<td width="40">&nbsp;</td>
					<td class="right" width="60"></td>
					<td class="right" width="50"></td>
					<td class="right" width="50"></td>
					<td class="right" width="50"></td>
					<td class="right" width="70"></td>
				</tr>';
			$no++;
		}
		$disc="";
		$grand_harga+=$d->tot;
		$grand_disc+=$d->tot_discount;
		$grand_ppn+=$d->ppn;
		$totQty+=$d->qty_real;
		$totTagihan+=($d->tot-$d->tot_discount+$d->ppn);
		if($d->dicount_percent>0){
			$disc=$d->dicount_percent;
		}
		$html.='<tr>
			<td width="30">&nbsp;</td>
			<td width="70" class="left">'.$d->trans_on.'</td>
			<td class="left" width="100">'.$d->partners_name.'</td>
			<td class="left" width="80">'.$d->trans_code.'</td>
			<td colspan="2" class="center" width="110">'.$d->qty.'</td>
			<td width="50">&nbsp;</td>
			<td class="right" width="60">'.number_format($d->price,0,",",".").'</td>
			<td class="right" width="40">'.$disc.'</td>
			
			<td class="right" width="60">'.number_format($d->tot,0,",",".").'</td>
			<td class="right" width="50">'.number_format($d->tot_discount,0,",",".").'</td>
			<td class="right" width="50">'.number_format($d->ppn,0,",",".").'</td>
			<td class="right" width="50">0</td>
			<td class="right" width="70">'.number_format(($d->tot-$d->tot_discount+$d->ppn),0,",",".").'</td>
		</tr>';
	}
	if(count($res)>0){
		$html.='<tr>
			<td  width="280" class="right" colspan="4"><b>Sub Total</b></td>
			<td colspan="2" class="center" width="110"><b>'.$totQty.' '.$d->measurement_real.'</b></td>
			<td width="50">&nbsp;</td>
			<td width="60">&nbsp;</td>
			<td width="40">&nbsp;</td>
			<td class="right" width="60"></td>
			<td class="right" width="50"></td>
			<td class="right" width="50"></td>
			<td class="right" width="50"></td>
			<td class="right" width="70"><b>'.number_format($totTagihan,0,",",".").'</b></td>
		</tr>';
		$totQty=0;
	}
	$html.='<tr>
			<th class="left border-top border-bottom" colspan="9">Grand Total</th>
			<th class="right border-top border-bottom">'.number_format($grand_harga,0,",",".").'</th>
			<th class="right border-top border-bottom">'.number_format($grand_disc,0,",",".").'</th>
			<th class="right border-top border-bottom">'.number_format($grand_ppn,0,",",".").'</th>
			<th class="right border-top border-bottom">0</th>
			<th class="right border-top border-bottom">'.number_format($grand_harga+$grand_ppn-$grand_disc,0,",",".").'</th>
		</tr></tbody>';
	$html.="		</table>
	";
	
	//echo $html;
	pdf(array('html'=>$html,'type'=>'landscape','margin-left'=>3,'title'=>'Laporan Penjualan','name'=>'PENJUALAN.pdf'));
	return false;
	// 
	// _this()->load->library('PHPExcel');
	// $objPHPExcel    = new PHPExcel();
	// //setting Width
	// $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(7);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(36);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(38);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(17);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(31);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(22);
	// $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(33);
	
	
	
	
	
	// // echo json_encode($res);
	// _this()->load->library('PHPExcel');
	// $objReader = PHPExcel_IOFactory::createReader('Excel2007');
	// $objPHPExcel = $objReader->load("./source/templates/inventaris/Template Data Distribusi Masuk.xlsx");
	// $ex = $objPHPExcel->setActiveSheetIndex(0);
	// $no=1;
	// $firstNo=7;
	// for($i=0,$iLen=count($res);$i<$iLen;$i++){
		// $obj=$res[$i];
		// $ex->setCellValue('B'.($i+$firstNo), $obj->id_produk);
		// $ex->setCellValue('C'.($i+$firstNo), $obj->item_name);
		// $ex->setCellValue('D'.($i+$firstNo), $obj->permission_number);
		// $ex->setCellValue('E'.($i+$firstNo), $obj->description);
		// $ex->setCellValue('F'.($i+$firstNo), $obj->batch);
		// $ex->setCellValue('G'.($i+$firstNo), $obj->kode_produk);
		// $ex->setCellValue('H'.($i+$firstNo), $obj->qty);
		// $receive=new DateTime($obj->receive_on);
		// $ex->setCellValue('I'.($i+$firstNo), $receive->format('Y-m-d'));
		// if($obj->expire_flag==1){
			// $expire=new DateTime($obj->expire_date);
			// $ex->setCellValue('J'.($i+$firstNo), $expire->format('Y-m-d'));
		// }else{
			// $ex->setCellValue('J'.($i+$firstNo), 'N/A');
		// }
		// $ex->setCellValue('K'.($i+$firstNo), $obj->id_distributor);
		// $ex->setCellValue('L'.($i+$firstNo), $obj->distributor_name);
	// }
	// $objPHPExcel->getProperties()->setCreator(_this()->pagesession->get()->user_code)
		// ->setLastModifiedBy(_this()->pagesession->get()->user_code)
		// ->setTitle("Export Distribusi Masuk")
		// ->setSubject("Export Distribusi Masuk")
		// ->setDescription("Export Distribusi Masuk")
		// ->setKeywords("Export Distribusi Masuk")
		// ->setCategory("Export Distribusi Masuk");
	// $objPHPExcel->getActiveSheet()->setTitle('Export Distribusi Masuk');
	// $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	// ob_end_clean();
	// header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
	// header('Chace-Control: no-store, no-cache, must-revalation');
	// header('Chace-Control: post-check=0, pre-check=0', FALSE);
	// header('Pragma: public');
	// header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	// header('Content-Disposition: attachment;filename="Export Distribusi Masuk'. date('Ymd') .'.xlsx"');
	// ob_end_clean();
	// $objWriter->save('php://output');
	// return false;
}