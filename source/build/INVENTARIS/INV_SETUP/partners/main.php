<?php
function getListSearch(){
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
	$id_partners=_get('f17',false);
	$entity=' inv_partners ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_partners_type A ON M.partners_type=A.partners_type_id
			';
	$criteria.=" M.tenant_id="._session()->tenant_id;
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
	if($id_partners != null && $id_partners !='')
		$criteria.=" AND upper(id_partners) like upper('%".$id_partners."%')";
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
	$ori= _this()->query->row("SELECT partners_name AS f2,M.partners_type AS f3,
		M.pic AS f4, M.email AS f5,M.address AS f6, M.country AS f7,M.no_pak AS f14, M.province AS f8,M.city AS f9, M.districts AS f10, 
		M.kelurahan AS f11, M.active_flag AS f13,M.telepon AS f15, M.fax AS f16,M.id_partners AS f17 FROM inv_partners M WHERE partners_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function getList(){
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
	$active=_get('f13',false);
	$pak=_get('f14',false);
	$telepon=_get('f15',false);
	$fax=_get('f16',false);
	$id_partners=_get('f17',false);
	$entity=' inv_partners ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_partners_type A ON M.partners_type=A.partners_type_id
			';
	$criteria.=" M.tenant_id="._session()->tenant_id;
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
	if($id_partners != null && $id_partners !='')
		$criteria.=" AND upper(id_partners) like upper('%".$id_partners."%')";
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
	$res=_this()->query->result("SELECT partners_id AS i,partners_code AS f1,partners_name AS f2,A.partners_type_name AS f3,
		M.email AS f5,M.address AS f6,M.active_flag AS f13
				FROM ".$entity." M ".$inner." ".$criteria." ".$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}
function toExcel(){
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
	$id_partners=_get('f17',false);
	$entity=' inv_partners ';
	$criteria=" WHERE";
	$inner='
		INNER JOIN inv_partners_type A ON M.partners_type=A.partners_type_id
			';
	$criteria.=" M.tenant_id="._session()->tenant_id;
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
	if($id_partners != null && $id_partners !='')
		$criteria.=" AND upper(id_partners) like upper('%".$id_partners."%')";
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
	}else{
		$criteria.=' AND M.active_flag=true ';
	}
	$orderBy=' ORDER BY ';
	$direction='ASC';
	$orderBy.='partners_name '.$direction;
	$res=_this()->query->result("SELECT partners_name,A.partners_type_name,M.no_pak,M.pic,
		M.email,M.address,M.country,M.city,M.telepon,M.fax
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
	$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(14);
	$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(14);
	$objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(14);
	$objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(14);
	
	
	
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
		->setCellValue('B1', 'Jenis Penyaluran')
		->setCellValue('C1', 'Nama Perusahaan/Institusi/Perorangan (Sarana Penyalur)')
		->setCellValue('D1', 'Nomor PAK')
		->setCellValue('E1', 'PIC/Nama Penanggung Jawab (Sarana Penyalur)')
		->setCellValue('F1', 'Email (Sarana Penyalur)')
		->setCellValue('G1', 'Alamat (Alamat Sarana Penyalur)')
		->setCellValue('H1', 'Negara')
		->setCellValue('I1', 'Kabupaten/Kota')
		->setCellValue('J1', 'Telepon')
		->setCellValue('K1', 'Fax');
        
        $ex = $objPHPExcel->setActiveSheetIndex(0);
		$no=1;
		for($i=0,$iLen=count($res);$i<$iLen;$i++){
			$obj=$res[$i];
			$ex->setCellValue('A'.($i+2), $no++);
			$ex->setCellValue('B'.($i+2), $obj->partners_type_name);
			$ex->setCellValue('C'.($i+2), $obj->partners_name);
			$ex->setCellValue('D'.($i+2), $obj->no_pak);
			$ex->setCellValue('E'.($i+2), $obj->pic);
			$ex->setCellValue('F'.($i+2), $obj->email);
			$ex->setCellValue('G'.($i+2), $obj->address);
			$ex->setCellValue('H'.($i+2), $obj->country);
			$ex->setCellValue('I'.($i+2), $obj->city);
			$ex->setCellValue('J'.($i+2), $obj->telepon);
			$ex->setCellValue('K'.($i+2), $obj->fax);
		}
		
		
		
		$objPHPExcel->getProperties()->setCreator(_this()->pagesession->get()->user_code)
            ->setLastModifiedBy(_this()->pagesession->get()->user_code)
            ->setTitle("Export Partner")
            ->setSubject("Export Partner")
            ->setDescription("Export Partner")
            ->setKeywords("Export Partner")
            ->setCategory("Export Partner");
        $objPHPExcel->getActiveSheet()->setTitle('Export Partner');
        
        $objWriter  = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        header('Last-Modified:'. gmdate("D, d M Y H:i:s").'GMT');
        header('Chace-Control: no-store, no-cache, must-revalation');
        header('Chace-Control: post-check=0, pre-check=0', FALSE);
        header('Pragma: no-cache');
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="ExportDataPartner'. date('Ymd') .'.xlsx"');
        
        $objWriter->save('php://output');
	return false;
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$partners_code=_post('f1');
	$partners_name=_post('f2');
	$type=_post('f3');
	$pic=_post('f4');
	$email=_post('f5');
	$telepon=_post('f15');
	$fax=_post('f16');
	$address=_post('f6');
	$id_partners=_post('f17');
	_this()->query->start();
	_load('lib/lib_dynamic_option');
	$country=_post('f7');
	_this()->lib_dynamic_option->set($country,'DYNAMIC_COUNTRY');
	$province=_post('f8');
	_this()->lib_dynamic_option->set($province,'DYNAMIC_PROV',$country);
	$city=_post('f9');
	_this()->lib_dynamic_option->set($city,'DYNAMIC_CITY',$province);
	$district=_post('f10');
	_this()->lib_dynamic_option->set($district,'DYNAMIC_KEC',$city);
	$districts=_post('f11');
	_this()->lib_dynamic_option->set($districts,'DYNAMIC_KEL',$district);
	// $permission_flag=_post('f12');
	$activeFlag=_post('f13');
	$pak=_post('f14');
	$id='';
	
	if($pageType=='ADD'){
		$allow=true;
		if($partners_code==''){
			$a=false;
			_load('lib/lib_sequence');
			$seq=_this()->lib_sequence;
			$sequenceCode=getSetting('PARTNERS','SEQUENCE_CODE');
			while($a==false){
				$codenya=$seq->getById($sequenceCode,array());
				$codenya=$codenya['val'];
				$res= _this()->query->row("SELECT partners_id AS total FROM inv_partners WHERE partners_code='".$codenya."' AND tenant_id="._session()->tenant_id);
				if(!$res){
					$partners_code=$codenya;
					$a=true;
				}
			}
		}else{
			$res= _this()->query->row("SELECT partners_id AS total FROM inv_partners WHERE partners_code='".$partners_code."' AND tenant_id="._session()->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if ($allow) {
			$id=_getTableSequence('inv_partners');
			 _this()->query->set("INSERT INTO inv_partners(partners_id,partners_code,partners_name,
				partners_type,no_pak,pic,email,address,country,province,city,districts,kelurahan,
				active_flag,create_on,create_by,tenant_id,telepon,fax,id_partners)VALUES
				(".$id.",'".$partners_code."','".$partners_name."',".$type.",'".$pak."','".$pic."','".$email."','".$address."','".$country."','".$province."','".$city."','".$district."','".$districts."',
				".$activeFlag.",'"._format()."',"._session()->employee_id.","._session()->tenant_id.",'".$telepon."','".$fax."','".$id_partners."')");
			_data(array('i'=>$id,'f1'=>$partners_code));
			_this()->query->end();
			_message_save('Kode Rekan', $partners_code );
		}else{
			_this()->query->back();
			_message_exist ('Kode Rekan', $partners_code );
		}
	}else if($pageType=='UPDATE'){
		 _this()->query->set("UPDATE inv_partners SET 
			partners_name='".$partners_name."',
			partners_type=$type,
			pic='".$pic."',
			no_pak='".$pak."',
			email='".$email."',
			address='".$address."',
			telepon='".$telepon."',
			fax='".$fax."',
			country='".$country."',
			province='".$province."',
			city='".$city."',
			districts='".$district."',
			id_partners='".$id_partners."',
			kelurahan='".$districts."',
			active_flag=".$activeFlag.",
			update_on='"._format()."',
			update_by="._session()->employee_id."
				WHERE partners_id=".$pid);
		_data(array('i'=>$id,'f1'=>$partners_code));
		_this()->query->end();
		_message_update ('Kode Rekan', $partners_code );
	}
	
}
function delete(){
	$pid= _post('i');
	$res=  _this()->query->row("SELECT partners_code FROM inv_partners WHERE partners_id=".$pid);
	if ($res) {
		 _this()->query->set("DELETE FROM inv_partners WHERE partners_id=".$pid);
		_message_delete('Kode Rekan', $pid );
	}else
		_not_found();
}