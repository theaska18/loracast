<?php
function initUpdate(){
	$pid=_get('i');
	$me=_this();
	$ori=_this()->query->row("SELECT P.due_date AS f1,A.approval_flow_id AS f2,P.text AS f3 FROM con_plan P 
		INNER JOIN app_approval A ON A.approval_id=P.approval_id
		WHERE P.planning_id=".$pid);
	if($ori){
		_load('lib/lib_html');
		$data=array();
		$data['o']=$ori;
		//echo $ori->f3;
		$data['o']->f3=$me->lib_html->show($ori->f3);
		_data($data);
	}else
		_not_found();
}
function delete(){
	$pid= _post('i');
	$me=_this();
	$o=$me->query->row("SELECT P.text,P.planning_code ,P.approval_id,A.approval_status,O.option_name AS status_text FROM con_plan P 
		INNER JOIN app_approval A ON A.approval_id=P.approval_id
		INNER JOIN app_parameter_option O ON O.option_code=A.approval_status
		WHERE P.planning_id=".$pid);
	if($o){
		if($o->approval_status=='APPROVAL_REVISI' || $o->approval_status=='APPROVAL_PENDING'){
			$me->query->start();
			$me->query->set("DELETE FROM con_plan WHERE planning_id=".$pid);
			$me->query->set("DELETE FROM app_approval WHERE approval_id=".$o->approval_id);
			$me->query->end();
			_load('lib/lib_html');
			$text=$me->lib_html->convert('',$me->lib_html->show($o->text));
			_message_delete('Kode Planning', $o->planning_code );
		}else{
			_result()->setMessage('Data Tidak Bisa Hapus, Status data sudah '.$o->status_text)->error();
		}
	}else{
		_not_found();
	}
}
function save(){
	$p= _post('p');
	$pid= _post('i');
	$code= _post('f1');
	$title= _post('f2');
	$desc= _post('f3');
	$duedate= _post('f5');
	$text= _post('f4');
	$type= _post('f6');
	_load('lib/lib_html');
	$me=_this();
	$ses=_session();
	if($p=='ADD'){
		$me->query->start();
		$approval_name=getSetting('PLAN','APPROVAL_NAME');
		$sequenceCodeApproval=getSetting('PLAN','APPROVAL_SEQUENCE_CODE');
		$text=$me->lib_html->convert($text);
		$textSave=$me->lib_html->save($text);
		//GENERATE APPROVAL CODE <--START
		$approval_id=_getTableSequence('app_approval');
		$approval_code='';
		$a=false;
		_load('lib/lib_sequence');
		$seq=$me->lib_sequence;
		
		while($a==false){
			$codenya=$seq->getById($sequenceCodeApproval,array());
			$codenya=$codenya['val'];
			$res= $me->query->row("SELECT approval_id AS total FROM app_approval WHERE approval_code='".$codenya."' AND tenant_id=".$ses->tenant_id);
			if(!$res){
				$approval_code=$codenya;
				$a=true;
			}
		}
		$flow= $me->query->row("SELECT approval_flow_name FROM app_approval_flow WHERE approval_flow_id=".$type);
		$data_approval=array(
			'approval_id'=>$approval_id,
			'tenant_id'=>$ses->tenant_id,
			'approval_code'=>$approval_code,
			'approval_by'=>$ses->employee_id,
			'approval_name'=>$approval_name.'-'.$flow->approval_flow_name.'-'.$title,
			'approval_status'=>'APPROVAL_PENDING',
			'create_on'=>_format(),
			'due_on'=>$duedate->format('Y-m-d'),
			'approval_flow_id'=>$type,
			'text'=>$textSave,
		);
		$me->db->insert('app_approval',$data_approval);
		$res_flow= $me->query->result("SELECT employee_id,structure_id,flow_type FROM app_approval_flow_detail WHERE approval_flow_id=".$type);
		for($i=0,$iLen=count($res_flow); $i<$iLen;$i++){
			$app_det=$res_flow[$i];
			$approval_detail_id=_getTableSequence('app_approval_detail');
			$data_detail=array(
				'approval_detail_id'=>$approval_detail_id,
				'approval_id'=>$approval_id,
				'employee_id'=>$app_det->employee_id,
				'approval_status'=>'APPROVE_WAIT',
				'structure_id'=>$app_det->structure_id,
				'flow_type'=>$app_det->flow_type
			);
			$me->db->insert('app_approval_detail',$data_detail);
		}
		//END-->
		$allow=true;
		if($code==''){
			$sequenceCode=getSetting('PLAN','SEQUENCE_CODE');
			$a=false;
			_load('lib/lib_sequence');
			$seq=$me->lib_sequence;
			
			while($a==false){
				$codenya=$seq->getById($sequenceCode,array());
				$codenya=$codenya['val'];
				$res= $me->query->row("SELECT planning_id AS total FROM con_plan WHERE planning_code='".$code."' AND tenant_id=".$ses->tenant_id);
				if(!$res){
					$code=$codenya;
					$a=true;
				}
			}
		}else{
			$res= $me->query->row("SELECT planning_id AS total FROM con_plan WHERE planning_code='".$code."' AND tenant_id=".$ses->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		if($allow){
			
			$pid=_getTableSequence('con_plan');
			$data=array(
				'planning_id'=>$pid,
				'planning_code'=>$code,
				'tenant_id'=>_session()->tenant_id,
				'planning_name'=>$title,
				'description'=>$desc,
				'due_date'=>$duedate->format('Y-m-d'),
				'approval_id'=>$approval_id,
				'text'=>$textSave,
				'create_on'=>_format(),
				'update_on'=>_format(),
				'create_by'=>$ses->employee_id
			);
			$me->db->insert('con_plan',$data);
			$me->query->end();
			_data(array('id'=>$pid,'text'=>$text,'approval_id'=>$approval_id));
			_message_save('Plan',$title);
		}else{
			$me->query->back();
			$text=$me->lib_html->convert('',$text);
			_message_exist ('Plan Code', $code );
		}
	}else{
		$o=$me->query->row("SELECT P.text,P.approval_id,A.approval_status,O.option_name AS status_text FROM con_plan P 
			INNER JOIN app_approval A ON A.approval_id=P.approval_id
			INNER JOIN app_parameter_option O ON O.option_code=A.approval_status
			WHERE P.planning_id=".$pid);
		if($o){
			if($o->approval_status=='APPROVAL_REVISI' || $o->approval_status=='APPROVAL_PENDING'){
				$me->query->start();
				$text=$me->lib_html->convert($text,$me->lib_html->show($o->text));
				$me->query->set("UPDATE app_approval_detail SET description_error='',description='',approval_status='APPROVE_WAIT',approve_on=null  WHERE approval_id=".$o->approval_id);
				$textSave=$me->lib_html->save($text);
				$data=array(
					'approval_status'=>'APPROVAL_PENDING',
					'text'=>$textSave
				);
				$me->db->where('approval_id',$o->approval_id);
				$me->db->update('app_approval',$data);
				
				$data=array(
					'planning_code'=>$code,
					'planning_name'=>$title,
					'description'=>$desc,
					'text'=>$textSave,
					'update_on'=>_format()
				);
				$me->db->where('planning_id',$pid);
				$me->db->update('con_plan',$data);
				_data(array('id'=>$pid,'text'=>$text,'approval_id'=>$o->approval_id));
				$me->query->end();
				_message_update('Plan',$title);
			}else{
				_result()->setMessage('Data Tidak Bisa Save, Status data sudah '.$o->status_text)->error();
			}
		}else{
			_not_found();
		}
	}
}
function show_allow(){
	$me=_this();
	// _load('Pdf');
	$pid=_get('i');
	$template_id=getSetting('PLAN','TEMPLATE');
	$html='';
	$title='';
	if($template_id != null && $template_id !=''){
		$tmplt=$me->query->row("SELECT text FROM app_template WHERE template_id=".$template_id);
		if($tmplt){
			$ori=$me->query->row("SELECT P.text,P.planning_code,AF.approval_flow_name,
				CONCAT(E.first_name,' ',E.last_name) AS employee_name,P.planning_name,P.description ,A.approval_code,
				P.create_on,P.due_date
				FROM con_plan P 
				INNER JOIN app_employee E ON E.employee_id=P.create_by
				INNER JOIN app_approval A ON A.approval_id=P.approval_id
				INNER JOIN app_approval_flow AF ON AF.approval_flow_id=A.approval_flow_id
				INNER JOIN app_parameter_option O ON O.option_code=A.approval_status
				WHERE P.planning_id=".$pid);
			_load('lib/lib_html');
			$title=$ori->planning_code;
			$html=$me->lib_html->show($tmplt->text);	
			$isi=$me->lib_html->show($ori->text);	
			$html=str_replace('##PARAMETER9##', $isi, $html);
			$html=str_replace('##PARAMETER2##', $title, $html);
			$html=str_replace('##PARAMETER3##', $ori->approval_code, $html);
			$html=str_replace('##PARAMETER1##', $ori->approval_flow_name, $html);
			$html=str_replace('##PARAMETER4##', $ori->employee_name, $html);
			$html=str_replace('##PARAMETER5##', $ori->planning_name, $html);
			$create=new DateTime($ori->create_on);
			$due=new DateTime($ori->due_date);
			$html=str_replace('##PARAMETER6##', $create->format('d-m-Y'), $html);
			$html=str_replace('##PARAMETER8##', $due->format('d-m-Y'), $html);
			$html=str_replace('##PARAMETER7##', $ori->description, $html);
		}else{
			$title='Error';
			$html="Template Tidak ada atau sudah terhapus";
		}
	}else{
		$title='Error';
		$html="Template Belum Di Setting";
	}
	// $pdf = new Pdf('P', 'mm', 'A4', true, 'UTF-8', false);
    // $pdf->SetTitle($title);
    // // $pdf->SetTopMargin(20);
    // // $pdf->setFooterMargin(20);
	// $pdf->SetPrintHeader(false);
    // $pdf->SetPrintFooter(false);
    // $pdf->SetAutoPageBreak(true);
    // $pdf->SetAuthor('Author');
    // $pdf->SetDisplayMode('real', 'default');
    // $pdf->AddPage();
	
	// $pdf->writeHTML($html, true, false, true, false, '');
    // $pdf->Output($title.'.pdf', 'I');
	_load('m_pdf');
		$me->m_pdf->pdf->SetMargins(0, 0, 0);
		$me->m_pdf->pdf->useOnlyCoreFonts = true;
     // false is default
     $me->m_pdf->pdf->SetWatermarkText("NUANSA CERAH INFORMASI");
     $me->m_pdf->pdf->showWatermarkText = true;
     $me->m_pdf->pdf->watermark_font = 'DejaVuSansCondensed';
     $me->m_pdf->pdf->watermarkTextAlpha = 0.1;
	if(strpos($html,"<header>HEADER</header>")>=0){
		$splitHeader=explode("<header>HEADER</header>",$html);
		$header=$splitHeader[0];
		$me->m_pdf->pdf->setAutoTopMargin='stretch';
		$me->m_pdf->pdf->SetHTMLHeader($header);
		$html=$splitHeader[1];
	}
	if(strpos($html,"<footer>FOOTER</footer>")>=0){
		$splitHeader=explode("<footer>FOOTER</footer>",$html);
		$footer=$splitHeader[1];
		$html=$splitHeader[0];
		$me->m_pdf->pdf->setAutoBottomMargin='stretch';
		$me->m_pdf->pdf->SetHTMLFooter($footer);
	}
        
       //generate the PDF from the given html
		$split=explode("<!-- pagebreak -->",$html);
		$me->m_pdf->pdf->AddPage('P', // L - landscape, P - portrait
            '', '', '', '',
            0, // margin_left
            0, // margin right
            0, // margin top
            0, // margin bottom
            0, // margin header
            0); // margin footer
		for($i=0,$iLen=count($split); $i<$iLen;$i++){
			if($i>0){
				$me->m_pdf->pdf->AddPage();
			}
			$me->m_pdf->pdf->WriteHTML($split[$i]);
		}
        
        
		// $me->m_pdf->pdf->SetDisplayMode('default');
        //download it.
        $me->m_pdf->pdf->Output($title.'.pdf', "I");       
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$plan=_get('f1',false);
	$desc=_get('f2',false);
	$start=_get('f3',false);
	$end=_get('f4',false);
	$penulis=_get('f5',false);
	$status=_get('f6',false);
	$jenis=_get('f7',false);
	$code=_get('f8',false);
	$entity='con_plan';
	$criteria='WHERE M.tenant_id='._session()->tenant_id.' ';
	$inner='
		INNER JOIN app_employee M1 ON M1.employee_id=M.create_by
		INNER JOIN app_approval M2 ON M2.approval_id=M.approval_id
		INNER JOIN app_parameter_option M3 ON M3.option_code=M2.approval_status
	';
	if($code != null && $code !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.planning_code) like upper('%".$code."%')";
	}
	if($plan != null && $plan !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.planning_name) like upper('%".$plan."%')";
	}
	if($desc != null && $desc !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.description) like upper('%".$desc."%')";
	}
	if($start != null && $start !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" DATE(M.due_date)>='".$start->format('Y-m-d')."'";
	}
	if($end != null && $end !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" DATE(M.due_date)<='".$end->format('Y-m-d')."'";
	}
	if($penulis != null && $penulis !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" M1.employee_id=".$penulis." ";
	}
	if($jenis != null && $jenis !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" M2.approval_id=".$jenis." ";
	}
	if($status != null && $status !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" M2.approval_status=".$status." ";
	}
	
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='M1.first_name '.$direction;
			break;
		case "f3":
			$orderBy.='M.create_on '.$direction;
			break;
		default:
			$orderBy.='M.create_on DESC';
			break;
	}
	$me=_this();
	$total=$me->query->row('SELECT count(planning_id) AS total FROM '.$entity.' M '.$inner.' '.$criteria,false);
	$res=$me->query->result("SELECT planning_id AS i,planning_code AS f1,planning_name  AS f2,description AS f3,CONCAT(M1.first_name,' ',M1.last_name)  AS f4,M3.option_name AS f5,M.due_date AS f6,M2.approval_status AS f7,M.approval_id AS f8
		FROM ".$entity.' M '.$inner.' '.$criteria.' '.$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}