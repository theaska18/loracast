<?php
function initUpdate(){
	$pid=_get('i');
	$me=_this();
	$ori=_this()->query->row("SELECT template_code AS f1,template_name AS f2,active_flag AS f3,description AS f4,
		text f5
		FROM app_template
		WHERE template_id=".$pid);
	if($ori){
		_load('lib/lib_html');
		$data=array();
		$data['o']=$ori;
		//echo $ori->f3;
		$data['o']->f5=$me->lib_html->show($ori->f5);
		_data($data);
	}else
		_not_found();
}
function delete(){
	$pid= _post('i');
	$me=_this();
	$o=$me->query->row("SELECT P.text,P.template_code FROM app_template P 
		WHERE P.template_id=".$pid);
	if($o){
		$me->query->start();
		$me->query->set("DELETE FROM app_template WHERE template_id=".$pid);
		$me->query->end();
		_load('lib/lib_html');
		$text=$me->lib_html->convert('',$me->lib_html->show($o->text));
		_message_delete('Template', $o->template_code );
	}else{
		_not_found();
	}
}
function save(){
	$p= _post('p');
	$pid= _post('i');
	$code= _post('f1');
	$name= _post('f2');
	$flag= _post('f3');
	$desc= _post('f4');
	$text= _post('f5');
	_load('lib/lib_html');
	$me=_this();
	$ses=_session();
	if($p=='ADD'){
		$me->query->start();
		$allow=true;
		if($code==''){
			$sequenceCode=getSetting('TEMPLATE','SEQUENCE_CODE');
			$a=false;
			_load('lib/lib_sequence');
			$seq=$me->lib_sequence;
			while($a==false){
				$codenya=$seq->getById($sequenceCode,array());
				$codenya=$codenya['val'];
				$res= $me->query->row("SELECT template_id AS total FROM app_template WHERE template_code='".$codenya."' AND tenant_id=".$ses->tenant_id);
				if(!$res){
					$code=$codenya;
					$a=true;
				}
			}
		}else{
			$res= $me->query->row("SELECT template_id AS total FROM app_template WHERE template_code='".$code."' AND tenant_id=".$ses->tenant_id);
			if ($res){
				$allow=false;
			}
		}
		$text=$me->lib_html->convert($text);
		$textSave=$me->lib_html->save($text);
		if($allow){
			$pid=_getTableSequence('app_template');
			$data=array(
				'template_id'=>$pid,
				'template_code'=>$code,
				'tenant_id'=>$ses->tenant_id,
				'template_name'=>$name,
				'description'=>$desc,
				'active_flag'=>$flag,
				'text'=>$textSave,
				'create_on'=>_format(),
				'update_on'=>_format(),
				'create_by'=>$ses->employee_id,
				'update_by'=>$ses->employee_id
			);
			$me->db->insert('app_template',$data);
			$me->query->end();
			_data(array('id'=>$pid,'text'=>$text,'code'=>$code));
			_message_save('Template',$code);
		}else{
			$me->query->back();
			$text=$me->lib_html->convert('',$text);
			_message_exist ('Template', $code );
		}
	}else{
		$o=$me->query->row("SELECT P.text FROM app_template P 
			WHERE P.template_id=".$pid);
		if($o){
			$me->query->start();
			$text=$me->lib_html->convert($text,$me->lib_html->show($o->text));
			$textSave=$me->lib_html->save($text);
			$data=array(
				'template_name'=>$name,
				'description'=>$desc,
				'active_flag'=>$flag,
				'text'=>$textSave,
				'update_on'=>_format(),
				'update_by'=>$ses->employee_id
			);
			$me->db->where('template_id',$pid);
			$me->db->update('app_template',$data);
			_data(array('id'=>$pid,'text'=>$text,'code'=>$code));
			$me->query->end();
			_message_update('Template',$code);
		}else{
			_not_found();
		}
	}
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	$direction=_get('d',false);
	$sorting=_get('s',false);
	$code=_get('f1',false);
	$name=_get('f2',false);
	$desc=_get('f3',false);
	$flag=_get('f4',false);
	$entity='app_template';
	$criteria='WHERE M.tenant_id='._session()->tenant_id.' ';
	$inner='
	';
	if($code != null && $code !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.template_code) like upper('%".$code."%')";
	}
	if($name != null && $name !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.template_name) like upper('%".$name."%')";
	}
	if($desc != null && $desc !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.description) like upper('%".$desc."%')";
	}
	if($flag != null && $flag !=''){
		if($active=='Y')
			$criteria.=' AND active_flag=true ';
		else
			$criteria.=' AND active_flag=false ';
	}
	$orderBy=' ORDER BY ';
	if($direction == null)
		$direction='ASC';
	switch ($sorting){
		case "f2": 
			$orderBy.='M.template_name '.$direction;
			break;
		case "f3":
			$orderBy.='M.description '.$direction;
			break;
		default:
			$orderBy.='M.template_code '.$direction;
			break;
	}
	$me=_this();
	$total=$me->query->row('SELECT count(template_id) AS total FROM '.$entity.' M '.$inner.' '.$criteria,false);
	$res=$me->query->result("SELECT template_id AS i,template_code AS f1,template_name  AS f2,description AS f3,active_flag AS f4
		FROM ".$entity.' M '.$inner.' '.$criteria.' '.$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}