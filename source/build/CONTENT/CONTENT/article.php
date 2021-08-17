<?php
function initUpdate(){
	$pid=_get('i');
	$ori=_this()->query->row("SELECT title AS f1,text AS f2 FROM con_article WHERE article_id=".$pid);
	if($ori){
		$data=array();
		$data['o']=$ori;
		_data($data);
	}else
		_not_found();
}
function initSetting(){
	$pid=_get('i');
	$me=_this();
	$ori=$me->query->row("SELECT title AS f1,post_type AS f2,active_flag AS f3,system_flag AS f4 FROM con_article WHERE article_id=".$pid);
	if($ori){
		$res_tag=$me->query->result("SELECT article_tag_id AS d1,tag_name AS d2 FROM con_article_tag WHERE article_id=".$pid);
		$data=array();
		$data['o']=$ori;
		$data['l']=$res_tag;
		_data($data);
	}else
		_not_found();
}
function delete(){
	$pid= _post('i');
	$me=_this();
	$res= $me->query->row("SELECT text FROM con_article WHERE article_id=".$pid);
	if ($res) {
		$me->query->start();
		$me->query->set("DELETE FROM con_article WHERE article_id=".$pid);
		$me->query->end();
		_load('lib/lib_html');
		$me->lib_html->convert(null,$res->text);
		_message_delete('Property Code', $pid );
	}else
		_not_found();
}
function saveSetting(){
	$pid=_post('i');
	$type=_post('f2');
	$active= _post('f3');
	$system= _post('f4');
	$id= _post('id');
	$tag_name= _post('tag_name');
	$me=_this();
	$o=$me->query->row("SELECT article_id FROM con_article WHERE article_id=".$pid);
	if($o){
		$me->query->start();
		$data=array(
			'active_flag'=>$active,
			'system_flag'=>$system,
			'post_type'=>$type,
			'update_on'=>_format(),
			'update_by'=>_session()->employee_id
		);
		$me->db->where('article_id',$pid);
		$me->db->update('con_article',$data);
		$o=$me->query->result("SELECT article_tag_id FROM con_article_tag WHERE article_id=".$pid);
		for($i=0,$iLen=count($o); $i<$iLen;$i++){
			$ada=false;
			for($j=0,$jLen=count($id); $j<$jLen;$j++){
				if($id[$j] != null && $id[$j] !=''){
					if($id[$j]==$o[$i]->article_tag_id){
						$ada=true;
					}
				}
			}
			if($ada==false){
				$me->query->set("DELETE FROM con_article_tag WHERE article_tag_id=".$o[$i]->article_tag_id);
			}
		}
		_load('lib/lib_dynamic_option');
		for($j=0,$jLen=count($id); $j<$jLen;$j++){
			if($id[$j] == null || $id[$j] ==''){
				$data=array(
					'article_id'=>$pid,
					'tag_name'=>$tag_name[$j],
					'article_tag_id'=>_getTableSequence('con_article_tag')
				);
				$me->lib_dynamic_option->set($tag_name[$j],'DO_TAG');
				$me->db->insert('con_article_tag',$data);
			}
		}
		$me->query->end();
		_message_update('Artikel',_post('f1'));
	}else{
		_not_found();
	}
	
}
function save(){
	$pid= _post('i');
	$title= _post('f1');
	$data= _post('f2');
	_load('lib/lib_html');
	$page_count=count(explode('<!-- pagebreak -->',$data));
	$text='';
	$me=_this();
	if($pid==null || $pid==''){
		$pid=_getTableSequence('con_article');
		$text=$me->lib_html->convert($data);
		preg_match_all('/<img[^>]+>/i',$text, $imageList);
		$imgUrl=null;
		if(count($imageList[0])>0){
			$str = $imageList[0][0];
			$s = explode('src="',$str);
			$t = explode('"',$s[1]);
			$imgUrl=$t[0];
		}
		$data=array(
			'article_id'=>$pid,
			'title'=>$title,
			'post_type'=>'POST_ARTICLE',
			'text'=>$text,
			'view'=>0,
			'page_count'=>$page_count,
			'page_image'=>$imgUrl,
			'tenant_id'=>_session()->tenant_id,
			'create_on'=>_format(),
			'create_by'=>_session()->employee_id
		);
		$me->db->insert('con_article',$data);
		_data(array('id'=>$pid,'text'=>$text));
		_message_save('Artikel',$title);
	}else{
		$o=$me->query->row("SELECT text FROM con_article WHERE article_id=".$pid);
		if($o){
			$text=$me->lib_html->convert($data,$o->text);
			preg_match_all('/<img[^>]+>/i',$text, $imageList);
			$imgUrl=null;
			if(count($imageList[0])>0){
				$str = $imageList[0][0];
				$s = explode('src="',$str);
				$t = explode('"',$s[1]);
				$imgUrl=$t[0];
			}
			$data=array(
				'title'=>$title,
				'text'=>$text,
				'page_count'=>$page_count,
				'page_image'=>$imgUrl,
				'update_on'=>_format(),
				'update_by'=>_session()->employee_id
			);
			$me->db->where('article_id',$pid);
			$me->db->update('con_article',$data);
			_data(array('id'=>$pid,'text'=>$text));
			_message_update('Artikel',$title);
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
	$title=_get('f1',false);
	$penulis=_get('f2',false);
	$start=_get('f3',false);
	$end=_get('f4',false);
	$active=_get('f5',false);
	$system=_get('f6',false);
	$entity='con_article';
	$criteria='';
	$inner='
		INNER JOIN app_employee M1 ON M1.employee_id=M.create_by
	';
	if($title != null && $title !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" upper(M.title) like upper('%".$title."%')";
	}
	if($penulis != null && $penulis !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" (upper(M1.first_name) like upper('%".$penulis."%') OR upper(M1.second_name) like upper('%".$penulis."%') OR upper(M1.last_name) like upper('%".$penulis."%'))";
	}
	if($start != null && $start !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" DATE(M.create_on)>='".$start->format('Y-m-d')."'";
	}
	if($end != null && $end !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" DATE(M.create_on)<='".$end->format('Y-m-d')."'";
	}
	if($active != null && $active !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		if($active=='Y'){
			$criteria.=" M.active_flag=1 ";
		}else{
			$criteria.=" M.active_flag=0 ";
		}
	}else{
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" M.active_flag=1 ";
	}
	if($system != null && $system !=''){
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		if($system=='Y'){
			$criteria.=" M.system_flag=1 ";
		}else{
			$criteria.=" M.system_flag=0 ";
		}
	}else{
		if($criteria=='')
			$criteria.=' WHERE ';
		else
			$criteria.=' AND ';
		$criteria.=" M.system_flag=0 ";
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
	$total=$me->query->row('SELECT count(article_id) AS total FROM '.$entity.' M '.$inner.' '.$criteria,false);
	$res=$me->query->result("SELECT article_id AS i,title AS f1,CONCAT(M1.first_name,' ',M1.last_name)  AS f2,M.create_on AS f3,M.active_flag AS f4,M.system_flag AS f5
		FROM ".$entity.' M '.$inner.' '.$criteria.' '.$orderBy.' LIMIT '.$size.' OFFSET '.$first);
	_data($res)->setTotal($total->total);
}