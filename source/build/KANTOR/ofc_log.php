<?php
function initAdd(){
	$arr=array();
	if(getSetting('OFC_LOG','DEFAULT_PARTNERS') != null && getSetting('OFC_LOG','DEFAULT_PARTNERS') !=''){
		$dat=_this()->query->row("SELECT partners_id,CONCAT(partners_code,' - ',partners_name) AS partners FROM inv_partners WHERE partners_id=".getSetting('OFC_LOG','DEFAULT_PARTNERS'));
		if($dat){
			$arr['partners_id']=$dat->partners_id;
			$arr['partners_name']=$dat->partners;
		}
	}
	_data($arr);
}
function getListPartners(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$type=_get('f3',false);
	$pic=_get('f4',false);
	$email=_get('f5',false);
	$alamat=_get('f6',false);
	$negara=_get('f7',false);
	$prov=_get('f8',false);
	$kota=_get('f9',false);
	$kec=_get('f10',false);
	$kel=_get('f11',false);
	$izin=_get('f12',false);
	$active=_get('f13',false);
	$pak=_get('f14',false);
	$telepon=_get('f15',false);
	$fax=_get('f16',false);
	$entity=' inv_partners ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_partners_type A ON M.partners_type=A.partners_type_id
			';
	$criteria.=" M.tenant_id="._this()->pagesession->get()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(partners_code) like upper('%".$code."%')";
	if($name != null && $name !='')
		$criteria.=" AND upper(partners_name) like upper('%".$name."%')";
	if($type != null && $type !='')
		$criteria.=" AND M.partners_type=".$type;
	if($pak != null && $pak !='')
		$criteria.=" AND upper(no_pak) like upper('%".$pak."%')";
	if($pic != null && $pic !='')
		$criteria.=" AND upper(pic) like upper('%".$pic."%')";
	if($email != null && $email !='')
		$criteria.=" AND upper(email) like upper('%".$email."%')";
	if($telepon != null && $telepon !='')
		$criteria.=" AND upper(telepon) like upper('%".$telepon."%')";
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
	if($kec != null && $kec !='')
		$criteria.=" AND upper(districts) like upper('%".$kec."%')";
	if($kel != null && $kel !='')
		$criteria.=" AND upper(keluarahan) like upper('%".$kel."%')";
	if($izin != null && $izin !=''){
		if($izin=='Y')
			$criteria.=' AND M.permission_flag=true ';
		else
			$criteria.=' AND M.permission_flag=false ';
	}
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
			$orderBy.='partners_name '.$direction;
			break;
		case "f3": 
			$orderBy.='A.partners_type_name '.$direction;
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
		   	$orderBy.='partners_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT count(partners_code) AS total FROM ".$entity." M  ".$inner." ".$criteria);
	$res=_this()->query->result("SELECT partners_id AS i,CONCAT(partners_code,' - ',partners_name) as name,A.partners_type_name AS type,
		M.email,M.address,M.active_flag AS a
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function initUpdate(){
	$pid=_get('i');
	$ori= _this()->query->row("SELECT bobot,description,CONCAT(P.partners_code,' - ',P.partners_name) AS partners,
		P.partners_id,M.status
		FROM ofc_log M LEFT JOIN inv_partners P ON M.partners_id=P.partners_id WHERE M.log_id=".$pid);
	$list= _this()->query->result("SELECT 
		M.employee_id,CONCAT(CASE WHEN E.first_name IS NULL THEN '' ELSE E.first_name END,' ',CASE WHEN E.last_name IS null THEN '' ELSE E.last_name END) AS employee
		FROM ofc_log_pic M INNER JOIN app_employee E ON E.employee_id=M.employee_id WHERE M.log_id=".$pid." ");
	$list2= _this()->query->result("SELECT M.log_detail_id,percentage,work_on,
		M.employee_id,CONCAT(CASE WHEN E.first_name IS NULL THEN '' ELSE E.first_name END,' ',CASE WHEN E.last_name IS null THEN '' ELSE E.last_name END) AS employee
		FROM ofc_log_detail M INNER JOIN app_employee E ON E.employee_id=M.employee_id WHERE M.log_id=".$pid." ");
	if($ori){
		$data=array();
		$data['o']=$ori;
		$data['l']=$list;
		$data['l2']=$list2;
		_data($data);
	}else
		_not_found();
}
function toExcel(){
	$code=_get('f1',false);
	$desc=_get('f2',false);
	$employee_id=_get('f3',false);
	$start=_get('f4',false);;
	$end=_get('f5',false);;
	$status=_get('f6',false);
	$partners=_get('f7',false);
	
	$entity=' ofc_log_detail';
	$criteria=" WHERE";
	$inner='	INNER JOIN ofc_log D ON D.log_id=M.log_id
				INNER JOIN app_employee E ON E.employee_id=M.employee_id
				LEFT JOIN inv_partners P ON P.partners_id=D.partners_id
			';
	$criteria.=" D.tenant_id="._this()->pagesession->get()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(D.log_code) like upper('%".$code."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(D.description) like upper('%".$desc."%')";
	if($employee_id != null && $employee_id !='')
		$criteria.=" AND M.employee_id=".$employee_id." ";
	if($start !== null && $start !==''){
		$criteria.=" AND M.work_on >='". $start->format('Y-m-d') ."'";
	}
	if($end !== null && $end !==''){
		$criteria.=" AND M.work_on <='". $end->format('Y-m-d') ."'";
	}
	if($partners != null && $partners !='')
		$criteria.=" AND D.partners_id=".$partners." ";
	if($status != null && $status !=''){
		$criteria.=" AND D.status='".$status."' ";
	}
	$orderBy=' ORDER BY ';
	$direction='ASC';
	$orderBy.='M.employee_id,M.work_on '.$direction;
	
	$res=_this()->query->result("SELECT CONCAT(CASE WHEN E.first_name IS NULL THEN '' ELSE E.first_name END,' ',CASE WHEN E.last_name IS null THEN '' ELSE E.last_name END) AS name,
		WEEK(work_on) AS grup,CONCAT(D.description,' ',IFNULL(P.partners_name,''))AS description,
		SUM(CASE WHEN DAYNAME(work_on)='Monday' THEN M.percentage ELSE 0 END) AS senin,
		SUM(CASE WHEN DAYNAME(work_on)='Tuesday' THEN M.percentage ELSE 0 END) AS selasa,
		SUM(CASE WHEN DAYNAME(work_on)='Wednesday' THEN M.percentage ELSE 0 END) AS rabu,
		SUM(CASE WHEN DAYNAME(work_on)='Thursday' THEN M.percentage ELSE 0 END) AS kamis, 
		SUM(CASE WHEN DAYNAME(work_on)='Friday' THEN M.percentage ELSE 0 END) AS jumat, 
		SUM(CASE WHEN DAYNAME(work_on)='Saturday' THEN M.percentage ELSE 0 END) AS sabtu, 
		SUM(CASE WHEN DAYNAME(work_on)='Sunday' THEN M.percentage ELSE 0 END) AS minggu  
				FROM ".$entity." M ".$inner." ".$criteria." GROUP BY E.employee_id,WEEK(work_on),D.description ".$orderBy);
	
	_this()->load->library('PHPExcel');
	$objPHPExcel    = new PHPExcel();
	//setting Width
	$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(7);
	$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(60);
	$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(10);
	$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(10);
	$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(10);
	$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(10);
	$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(10);
	$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(10);
	$objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(10);
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
		),
		'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        )
	);
	// $objPHPExcel->getActiveSheet()->getStyle('A1:J1')->applyFromArray($styleArrayHeader);
	
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
	// $objPHPExcel->getActiveSheet()->getStyle("A1:K1")->applyFromArray($styleArray);
	
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
	$group='NONE';
	$names='';
	$name='NAME';
	$line=2;
	$no=1;
	$senin=0;
	$selasa=0;
	$rabu=0;
	$kamis=0;
	$jumat=0;
	$sabtu=0;
	$minggu=0;
	$ex = $objPHPExcel->setActiveSheetIndex(0);
	for($i=0,$iLen=count($res);$i<$iLen;$i++){
		$obj=$res[$i];
		$named=false;
		if($name!==$obj->name ){
			$named=true;
			if($names!==''){
				$names.=', ';
			}
			$names.=$obj->name;
			$name=$obj->name;
			$ex->mergeCells("B".$line.":M".$line);
			$ex->setCellValue('B'.$line, 'Nama : '.$obj->name);
			$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArray);
			$line++;
		}
		if($group!==$obj->grup|| $named==true){
			$senin=0;
			if($i>0){
				// $line++;
				$ex->getStyle('D'.$line.':M'.$line)
					->getNumberFormat()->applyFromArray( 
						array( 
							'code' => PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00
						)
					);
				$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArray);
				$line++;
			}
			$selasa=0;
			$rabu=0;
			$kamis=0;
			$jumat=0;
			$sabtu=0;
			$minggu=0;
			$group=$obj->grup;
			$ex->mergeCells("B".$line.":L".$line);
			$ex->setCellValue('B'.$line, 'Minggu Ke-'.$obj->grup);
			$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArrayHeader);
			$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArray);
			$line++;
			$no=1;
			$ex
				->setCellValue('B'.$line, 'No.')
				->setCellValue('C'.$line, 'Deskripsi')
				->setCellValue('D'.$line, 'Target')
				->setCellValue('E'.$line, 'Realisasi')
				->setCellValue('F'.$line, '%')
				->setCellValue('G'.$line, 'Senin')
				->setCellValue('H'.$line, 'Selasa')
				->setCellValue('I'.$line, 'Rabu')
				->setCellValue('J'.$line, 'Kamis')
				->setCellValue('K'.$line, 'Jumat')
				->setCellValue('L'.$line, 'Sabtu')
				->setCellValue('M'.$line, 'Minggu');
			$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArrayHeader);
			$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArray);
			$line++;
		}
		
		$ex
			->setCellValue('B'.$line, $no)
			->setCellValue('C'.$line, $obj->description)
			->setCellValue('D'.$line, '.'.($obj->senin+$obj->selasa+$obj->rabu+$obj->kamis+$obj->jumat+$obj->sabtu+$obj->minggu))
			->setCellValue('E'.$line, '.'.($obj->senin+$obj->selasa+$obj->rabu+$obj->kamis+$obj->jumat+$obj->sabtu+$obj->minggu))
			->setCellValue('F'.$line, '.100')
			->setCellValue('G'.$line, '.'.$obj->senin)
			->setCellValue('H'.$line, '.'.$obj->selasa)
			->setCellValue('I'.$line, '.'.$obj->rabu)
			->setCellValue('J'.$line, '.'.$obj->kamis)
			->setCellValue('K'.$line, '.'.$obj->jumat)
			->setCellValue('L'.$line, '.'.$obj->sabtu)
			->setCellValue('M'.$line, '.'.$obj->minggu);
		$senin+=$obj->senin;
		$selasa+=$obj->selasa;
		$rabu+=$obj->rabu;
		$kamis+=$obj->kamis;
		$jumat+=$obj->jumat;
		$sabtu+=$obj->sabtu;
		$minggu+=$obj->minggu;
		$ex->getStyle('D'.$line.':M'.$line)
			->getNumberFormat()->applyFromArray( 
				array( 
					'code' => PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00
				)
			);	
		$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArray);
		$ex
			->setCellValue('G'.($line+1), '.'.$senin)
			->setCellValue('H'.($line+1), '.'.$selasa)
			->setCellValue('I'.($line+1), '.'.$rabu)
			->setCellValue('J'.($line+1), '.'.$kamis)
			->setCellValue('K'.($line+1), '.'.$jumat)
			->setCellValue('L'.($line+1), '.'.$sabtu)
			->setCellValue('M'.($line+1), '.'.$minggu);
		$no++;
		$line++;
		if(($iLen-1)==$i){
			$ex->getStyle('D'.$line.':M'.$line)
				->getNumberFormat()->applyFromArray( 
					array( 
						'code' => PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00
					)
				);
			$objPHPExcel->getActiveSheet()->getStyle("B".$line.":M".$line)->applyFromArray($styleArray);
		}
	}
		$objPHPExcel->getProperties()->setCreator(_this()->pagesession->get()->user_code)
            ->setLastModifiedBy(_this()->pagesession->get()->user_code)
            ->setTitle("Log Book")
            ->setSubject("Log Book")
            ->setDescription("Log Book")
            ->setKeywords("Log Book")
            ->setCategory("Log Book");
        $objPHPExcel->getActiveSheet()->setTitle('Log Book '.$names);
        
        $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
       // $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'OpenDocument');
        header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
        header('Chace-Control: no-store, no-cache, must-revalation');
        header('Chace-Control: post-check=0, pre-check=0', FALSE);
        header('Pragma: public');
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // header('Content-Type: application/vnd.oasis.opendocument.spreadsheet');
        header('Content-Disposition: attachment;filename="Log Book '.$names.'.xlsx"');
		
		
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
	$desc=_get('f2',false);
	$employee_id=_get('f3',false);
	$start=_get('f4',false);;
	$end=_get('f5',false);;
	$status=_get('f6',false);
	$partners=_get('f7',false);
	$entity=' ofc_log';
	$criteria=" WHERE";
	$inner='	
		INNER JOIN app_parameter_option M1 ON M1.option_code=M.status
		LEFT JOIN inv_partners P ON P.partners_id=M.partners_id
		LEFT JOIN ofc_log_pic O ON O.log_id=M.log_id
			';
	$criteria.=" M.tenant_id="._this()->pagesession->get()->tenant_id;
	if($code != null && $code !='')
		$criteria.=" AND upper(log_code) like upper('%".$code."%')";
	if($desc != null && $desc !='')
		$criteria.=" AND upper(description) like upper('%".$desc."%')";
	if($employee_id != null && $employee_id !='')
		$criteria.=" AND O.employee_id=".$employee_id." ";
	if($partners != null && $partners !='')
		$criteria.=" AND M.partners_id=".$partners." ";
	if($status != null && $status !=''){
		$criteria.=" AND M.status='".$status."' ";
	}
	if($start !== null && $start !==''){
		$criteria.=" AND log_on >='". $start->format('Y-m-d') ."'";
	}
	if($end !== null && $end !==''){
		$criteria.=" AND log_on <='". $end->format('Y-m-d') ."'";
	}
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='DESC';
	switch ($sorting){
		case "f2": 
			$orderBy.='M.log_on '.$direction;
			break;
		case "f3":
			$orderBy.='P.partners_name '.$direction;
			break;
		case "f4":
			$orderBy.='M.description '.$direction;
			break;
		case "f5":
			$orderBy.='M1.option_code '.$direction;
			break;
		case "f6":
			$orderBy.='M.percentage '.$direction;
			break;
		default:
		   	$orderBy.='M.log_code '.$direction;
			break;
	}
	$total=_this()->query->row("SELECT COUNT(X.log_id) AS total FROM(SELECT M.log_id FROM ".$entity." M  ".$inner." ".$criteria." GROUP BY M.log_code)X");
	$res=_this()->query->result("SELECT M.log_id AS i,M.log_code AS f1,M.log_on AS f2,P.partners_name AS f3, 
		M.description AS f4, M1.option_name AS f5,M.bobot AS f6,
		(SELECT GROUP_CONCAT(CONCAT(CASE WHEN E.first_name IS NULL THEN '' ELSE E.first_name END,' ',CASE WHEN E.last_name IS null THEN '' ELSE E.last_name END) SEPARATOR ', ') 
			FROM ofc_log_pic PIC INNER JOIN app_employee E ON E.employee_id=PIC.employee_id WHERE PIC.log_id =M.log_id)AS f7
				FROM ".$entity." M ".$inner." ".$criteria."  GROUP BY M.log_code ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function save(){
	_this()->query->start();
	$pageType=_post('p');
	$pid=_post('i');
	$code=_post('f1');
	$desc=_post('f2');
	$status=_post('f4');
	$bobot=_post('f5');
	$partners=_post('f6');
	
	$pic=_post('pic');
	$det_id=_post('det_id',false);
	$work_date=_post('work_date',false);
	$percentage=_post('percentage',false);
	$pic2=_post('pic2',false);
	
	$tenant_id=_this()->pagesession->get()->tenant_id;
	$employee_id=_this()->pagesession->get()->employee_id;
	$now=new DateTime();
	_load('lib/lib_table_sequence');
	$arr=array();
	$arr['bobot']=(double)$bobot;
	$arr['description']=$desc;
	$arr['percentage']=0;
	if($partners != null && $partners !=''){
		$arr['partners_id']=(double)$partners;
	}else{
		$arr['partners_id']=null;
	}
	$arr['status']=$status;
	if($pageType=='ADD'){
		$allow=true;
		if($code==''){
			$a=false;
			$sequenceCode=getSetting('OFC_LOG','SEQUENCE_CODE');
			while($a==false){
				$codenya=_getSequenceById($sequenceCode);
				$res=_this()->query->row("SELECT log_id FROM ofc_log WHERE log_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$code=$codenya;
					$a=true;
				}
			}
		}else{
			$res=_this()->query->row("SELECT log_id FROM ofc_log WHERE log_code='".$code."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow){
			$pid=_this()->lib_table_sequence->get('ofc_log');
			$arr['log_id']=$pid;
			$arr['tenant_id']=$tenant_id;
			$arr['log_code']=$code;
			$arr['create_by']=$employee_id;
			$arr['create_on']=$now->format('Y-m-d H:i:s');
			$arr['log_on']=$now->format('Y-m-d');
			_this()->db->insert('ofc_log',$arr);
		}else{
			_message_exist('Log Code',$code);
		}
	}else{
		$arr['update_by']=$employee_id;
		$arr['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('log_id',$pid);
		_this()->db->update('ofc_log',$arr);
	}
	$list=_this()->query->result("SELECT employee_id,log_pic_id FROM ofc_log_pic WHERE log_id=".$pid);
	for($i=0,$iLen=count($list);$i<$iLen;$i++){
		$ada=false;
		for($j=0,$jLen=count($pic);$j<$jLen;$j++){
			if((double)$pic[$j]==(double)$list[$i]->employee_id){
				$ada=true;
				break;
			}
		}
		if($ada==false){
			_this()->query->set("DELETE FROM ofc_log_pic WHERE log_pic_id=".$list[$i]->log_pic_id);
		}
	}
	for($j=0,$jLen=count($pic);$j<$jLen;$j++){
		$ada=false;
		for($i=0,$iLen=count($list);$i<$iLen;$i++){
			if((double)$pic[$j]==(double)$list[$i]->employee_id){
				$ada=true;
				break;
			}
		}
		if($ada==false){
			$arr=array();
			$id=_this()->lib_table_sequence->get('ofc_log_pic');
			$arr['log_pic_id']=$id;
			$arr['employee_id']=$pic[$j];
			$arr['log_id']=$pid;
			_this()->db->insert('ofc_log_pic',$arr);
			if((double)$employee_id!==(double)$pic[$j]){
				setNotification('Log Book','Terdapat Pekerjaan Baru, No. Log : '.$code,'OFC_LOG',(double)$pic[$j]);
			}
		}
	}
	if($pic2 != null && $pic2!==''){ 
		$list=_this()->query->result("SELECT employee_id,log_detail_id FROM ofc_log_detail WHERE log_id=".$pid);
		for($i=0,$iLen=count($list);$i<$iLen;$i++){
			$ada=false;
			for($j=0,$jLen=count($pic2);$j<$jLen;$j++){
				if($det_id[$j] !==null && $det_id[$j] !==''){
					if((double)$det_id[$j]==$list[$i]->log_detail_id){
						$ada=true;
						$arr=array();
						$arr['percentage']=$percentage[$j];
						$arr['work_on']=$work_date[$j];
						_this()->db->where('log_detail_id',(double)$det_id[$j]);
						_this()->db->update('ofc_log_detail',$arr);
						break;
					}
				}
			}
			if($ada==false){
				_this()->query->set("DELETE FROM ofc_log_detail WHERE log_detail_id=".$list[$i]->log_detail_id);
			}
		}
		for($j=0,$jLen=count($pic2);$j<$jLen;$j++){
			$ada=false;
			if($det_id[$j] ==null || $det_id[$j] ==''){
				$arr=array();
				$id=_this()->lib_table_sequence->get('ofc_log_detail');
				$arr['log_detail_id']=$id;
				$arr['employee_id']=$pic2[$j];
				$arr['percentage']=$percentage[$j];
				$arr['work_on']=$work_date[$j];
				$arr['log_id']=$pid;
				_this()->db->insert('ofc_log_detail',$arr);
			}	
		}
	}else{
		_this()->query->set("DELETE FROM ofc_log_detail WHERE log_id=".$pid);
	}
	_this()->query->end();
	_message_save('Kode Log', $code );
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT log_code FROM ofc_log WHERE log_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM ofc_log WHERE log_id=".$pid);
		_message_delete('Kode Log', $res->log_code );
	}else
		_not_found();
}