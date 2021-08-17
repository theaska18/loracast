<?php
function getYears(){
	$now=new DateTime();
	$yearNow=(int)$now->format('Y');
	$lst=array();
	$lst[]=array('id'=>(string)($yearNow));
	for($i=0;$i<30;$i++){
		$lst[]=array('id'=>(string)($yearNow-1));
		$yearNow--;
	}
	_data($lst);
}
function proses(){
	$tahun=_post('tahun');
	$bulan=_post('bulan');
	$unit=_post('unit');
	$unit=getSetting('INV_CLOSE_MONTH','UNIT_ID');
	$tutup=_post('tutup');
	$now=new DateTime();
	$session=_this()->pagesession->get();
	$tenant_id=$session->tenant_id;
	$employee_id=$session->employee_id;
	_this()->query->start();
	$periode=_this()->query->row("SELECT m".$bulan." AS periode FROM inv_periode WHERE tenant_id=".$tenant_id." 
		AND unit_id=".$unit." AND years='".$tahun."'");
	if($periode){
		if($periode->periode==1){
			_message('Proses Bulanan Tidak bisa dilakukan karena sudah Tutup.')->warning()->end();
		}
	}else{
		$arr=array();
		_load('lib/lib_table_sequence');
		$arr['periode_id']=_this()->lib_table_sequence->get('inv_periode');
		$arr['tenant_id']=$tenant_id;
		$arr['unit_id']=$unit;
		$arr['years']=$tahun;
		_this()->db->insert('inv_periode',$arr);
	}
	$res=_this()->query->result("SELECT item_id FROM inv_item WHERE tenant_id=".$tenant_id."
		AND active_flag=1");
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$obj=$res[$i];
		$mutasi=_this()->query->row("SELECT mutasi_id FROM inv_mutasi WHERE
			tenant_id=".$tenant_id." 
			AND unit_id=".$unit." AND years='".$tahun."' AND month='".$bulan."' AND item_id=".$obj->item_id);
		$mutasiId=null;
		if($mutasi == null){
			$arr=array();
			_load('lib/lib_table_sequence');
			$mutasiId=_this()->lib_table_sequence->get('inv_mutasi');
			$arr['mutasi_id']=$mutasiId;
			$arr['tenant_id']=$tenant_id;
			$arr['unit_id']=$unit;
			$arr['years']=$tahun;
			$arr['month']=$bulan;
			$arr['item_id']=$obj->item_id;
			$arr['update_by']=$employee_id;
			$arr['update_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_mutasi',$arr);
		}else{
			$mutasiId=$mutasi->mutasi_id;
			$arr=array();
			$arr['rcv_qty']=0;
			$arr['rcv_cost']=0;
			$arr['sell_qty']=0;
			$arr['sell_cost']=0;
			$arr['out_qty']=0;
			$arr['out_cost']=0;
			$arr['in_qty']=0;
			$arr['in_cost']=0;
			$arr['dist_qty']=0;
			$arr['dist_cost']=0;
			$arr['ret_qty']=0;
			$arr['ret_cost']=0;
			$arr['del_qty']=0;
			$arr['del_cost']=0;
			$arr['back_qty']=0;
			$arr['back_cost']=0;
			$arr['in_tenant_qty']=0;
			$arr['in_tenant_cost']=0;
			$arr['out_tenant_qty']=0;
			$arr['out_tenant_cost']=0;
			$arr['adjust_qty']=0;
			$arr['adjust_cost']=0;
			$arr['last_qty']=0;
			$arr['last_cost']=0;
			$arr['update_by']=$employee_id;
			$arr['update_on']=$now->format('Y-m-d H:i:s');
			_this()->db->where('mutasi_id',$mutasiId);
			_this()->db->update('inv_mutasi',$arr);
		}
	}	
	
	
	//==RECEIVE
	$res=_this()->query->result("SELECT D.item_id,SUM((D.qty*D.fraction)) AS qty,SUM((D.general_price*(D.qty*D.fraction) ))AS cost FROM inv_receive M
		INNER JOIN inv_receive_detail D ON D.receive_id=M.receive_id
		WHERE M.posted=1 AND M.unit_id=".$unit." AND M.tenant_id=".$tenant_id."
		AND YEAR(M.receive_on)='".$tahun."' AND MONTH(M.receive_on)='".$bulan."'
		GROUP BY  D.item_id
	");
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$obj=$res[$i];
		$mutasi=_this()->query->row("SELECT mutasi_id FROM inv_mutasi WHERE
			tenant_id=".$tenant_id." 
			AND unit_id=".$unit." AND years='".$tahun."' AND month='".$bulan."' AND item_id=".$obj->item_id);
		$mutasiId=null;
		if($mutasi == null){
			$arr=array();
			_load('lib/lib_table_sequence');
			$mutasiId=_this()->lib_table_sequence->get('inv_mutasi');
			$arr['mutasi_id']=$mutasiId;
			$arr['tenant_id']=$tenant_id;
			$arr['unit_id']=$unit;
			$arr['years']=$tahun;
			$arr['month']=$bulan;
			$arr['item_id']=$obj->item_id;
			$arr['update_by']=$employee_id;
			$arr['update_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_mutasi',$arr);
		}else{
			$mutasiId=$mutasi->mutasi_id;
		}
		$arr=array();
		$arr['rcv_qty']=$obj->qty;
		$arr['rcv_cost']=$obj->cost;
		$arr['update_by']=$employee_id;
		$arr['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('mutasi_id',$mutasiId);
		_this()->db->update('inv_mutasi',$arr);
	}
	// //==SELL Employee
	// $res=_this()->query->result("SELECT G.item_id,SUM(D.qty) AS qty,SUM(D.price*(D.qty/D.fraction))AS cost 
		// FROM inv_sell_emp M
		// INNER JOIN inv_sell_emp_detail D ON M.sell_emp_id=D.sell_emp_id
		// INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		// WHERE M.posted=1 AND M.unit_id=".$unit." AND M.tenant_id=".$tenant_id."
		// AND YEAR(M.sell_date)='".$tahun."' AND MONTH(M.sell_date)='".$bulan."'
		// GROUP BY  G.item_id
	// ");
	// for($i=0,$iLen=count($res); $i<$iLen;$i++){
		// $obj=$res[$i];
		// $mutasi=_this()->query->row("SELECT mutasi_id FROM inv_mutasi WHERE
			// tenant_id=".$tenant_id." 
			// AND unit_id=".$unit." AND years='".$tahun."' AND month='".$bulan."' AND item_id=".$obj->item_id);
		// $mutasiId=null;
		// if($mutasi == null){
			// $arr=array();
			// _load('lib/lib_table_sequence');
			// $mutasiId=_this()->lib_table_sequence->get('inv_mutasi');
			// $arr['mutasi_id']=$mutasiId;
			// $arr['tenant_id']=$tenant_id;
			// $arr['unit_id']=$unit;
			// $arr['years']=$tahun;
			// $arr['month']=$bulan;
			// $arr['item_id']=$obj->item_id;
			// $arr['update_by']=$employee_id;
			// $arr['update_on']=$now->format('Y-m-d H:i:s');
			// _this()->db->insert('inv_mutasi',$arr);
		// }else{
			// $mutasiId=$mutasi->mutasi_id;
		// }
		// $arr=array();
		// $arr['sell_qty']=$obj->qty;
		// $arr['sell_cost']=$obj->cost;
		// $arr['update_by']=$employee_id;
		// $arr['update_on']=$now->format('Y-m-d H:i:s');
		// _this()->db->where('mutasi_id',$mutasiId);
		// _this()->db->update('inv_mutasi',$arr);
	// }
	//SELL Vendor
	$res=_this()->query->result("SELECT D.item_id,SUM(D.qty) AS qty,SUM(D.price*D.qty)AS cost FROM inv_trans_partners M
		INNER JOIN inv_trans_partners_detail D ON D.trans_id=M.trans_id
		WHERE M.posted=1 AND M.unit_id=".$unit." AND M.tenant_id=".$tenant_id."
		AND YEAR(M.trans_on)='".$tahun."' AND MONTH(M.trans_on)='".$bulan."'
		GROUP BY  D.item_id
	");
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$obj=$res[$i];
		$mutasi=_this()->query->row("SELECT mutasi_id FROM inv_mutasi WHERE
			tenant_id=".$tenant_id." 
			AND unit_id=".$unit." AND years='".$tahun."' AND month='".$bulan."' AND item_id=".$obj->item_id);
		$mutasiId=null;
		if($mutasi == null){
			$arr=array();
			_load('lib/lib_table_sequence');
			$mutasiId=_this()->lib_table_sequence->get('inv_mutasi');
			$arr['mutasi_id']=$mutasiId;
			$arr['tenant_id']=$tenant_id;
			$arr['unit_id']=$unit;
			$arr['years']=$tahun;
			$arr['month']=$bulan;
			$arr['item_id']=$obj->item_id;
			$arr['update_by']=$employee_id;
			$arr['update_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_mutasi',$arr);
		}else{
			$mutasiId=$mutasi->mutasi_id;
		}
		$arr=array();
		$arr['sell_qty']=$obj->qty;
		$arr['sell_cost']=$obj->cost;
		$arr['update_by']=$employee_id;
		$arr['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('mutasi_id',$mutasiId);
		_this()->db->update('inv_mutasi',$arr);
	}
	//==ADJUSTMENT
	$res=_this()->query->result("SELECT G.item_id,SUM(D.qty) AS qty,SUM(G.general_price*D.qty)AS cost FROM inv_adjusment M
		INNER JOIN inv_adjusment_detail D ON D.adjusment_id=M.adjusment_id
		INNER JOIN inv_gin G ON G.gin_id=D.gin_id
		WHERE M.unit_id=".$unit." AND M.tenant_id=".$tenant_id."
		AND YEAR(M.create_on)='".$tahun."' AND MONTH(M.create_on)='".$bulan."'
		GROUP BY  G.item_id
	");
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$obj=$res[$i];
		$mutasi=_this()->query->row("SELECT mutasi_id FROM inv_mutasi WHERE
			tenant_id=".$tenant_id." 
			AND unit_id=".$unit." AND years='".$tahun."' AND month='".$bulan."' AND item_id=".$obj->item_id);
		$mutasiId=null;
		if($mutasi == null){
			$arr=array();
			_load('lib/lib_table_sequence');
			$mutasiId=_this()->lib_table_sequence->get('inv_mutasi');
			$arr['mutasi_id']=$mutasiId;
			$arr['tenant_id']=$tenant_id;
			$arr['unit_id']=$unit;
			$arr['years']=$tahun;
			$arr['month']=$bulan;
			$arr['item_id']=$obj->item_id;
			$arr['update_by']=$employee_id;
			$arr['update_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_mutasi',$arr);
		}else{
			$mutasiId=$mutasi->mutasi_id;
		}
		$arr=array();
		$arr['adjust_qty']=$obj->qty;
		$arr['adjust_cost']=$obj->cost;
		$arr['update_by']=$employee_id;
		$arr['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('mutasi_id',$mutasiId);
		_this()->db->update('inv_mutasi',$arr);
	}
	
	$res=_this()->query->result("SELECT MU.* FROM inv_item M
		INNER JOIN inv_mutasi MU ON MU.item_id=M.item_id AND MU.tenant_id=M.tenant_id 
		AND MU.unit_id=".$unit." AND MU.month='".$bulan."' AND MU.years='".$tahun."'
		WHERE M.tenant_id=".$tenant_id." AND active_flag=1 ");
	$nextBulan=(int)$bulan+1;
	$nextTahun=$tahun;
	if($nextBulan>12){
		$nextBulan='01';
		$nextTahun=(int)$nextTahun+1;
		$nextTahun=(string)$nextTahun;
	}
	if(strlen((string)$nextBulan)==1){
		$nextBulan='0'.(string)$nextBulan;
	}else{
		$nextBulan=(string)$nextBulan;
	}
	for($i=0,$iLen=count($res); $i<$iLen;$i++){
		$obj=$res[$i];
		$totQty=$obj->qty+$obj->rcv_qty-$obj->sell_qty-$obj->out_qty+$obj->in_qty+$obj->ret_qty-$obj->del_qty-$obj->back_qty;
		$totQty+=$obj->in_tenant_qty-$obj->out_tenant_qty;
		$totQty+=$obj->adjust_qty;
		$totCost=$obj->cost+$obj->rcv_cost-$obj->sell_cost-$obj->out_cost+$obj->in_cost+$obj->ret_cost-$obj->del_cost-$obj->back_cost;
		$totCost+=$obj->in_tenant_cost-$obj->out_tenant_cost;
		$totCost+=$obj->adjust_cost;
		$arr=array();
		$arr['last_qty']=$totQty;
		$arr['last_cost']=$totCost;
		$arr['update_by']=$employee_id;
		$arr['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('mutasi_id',$obj->mutasi_id);
		_this()->db->update('inv_mutasi',$arr);
		
		$mutasi=_this()->query->row("SELECT mutasi_id FROM inv_mutasi WHERE
			tenant_id=".$tenant_id." 
			AND unit_id=".$unit." AND years='".$nextTahun."' AND month='".$nextBulan."' AND item_id=".$obj->item_id);
		$mutasiId=null;
		if($mutasi == null){
			$arr=array();
			_load('lib/lib_table_sequence');
			$mutasiId=_this()->lib_table_sequence->get('inv_mutasi');
			$arr['mutasi_id']=$mutasiId;
			$arr['tenant_id']=$tenant_id;
			$arr['unit_id']=$unit;
			$arr['years']=$nextTahun;
			$arr['month']=$nextBulan;
			$arr['item_id']=$obj->item_id;
			$arr['update_by']=$employee_id;
			$arr['update_on']=$now->format('Y-m-d H:i:s');
			_this()->db->insert('inv_mutasi',$arr);
		}else{
			$mutasiId=$mutasi->mutasi_id;
		}
		$arr=array();
		$arr['qty']=$totQty;
		$arr['cost']=$totCost;
		$arr['update_by']=$employee_id;
		$arr['update_on']=$now->format('Y-m-d H:i:s');
		_this()->db->where('mutasi_id',$mutasiId);
		_this()->db->update('inv_mutasi',$arr);
	}
	if($tutup==1){
		$arr=array();
		$arr['m'.$bulan]=1;
		_this()->db->where(array('tenant_id'=>$tenant_id,'unit_id'=>$unit,'years'=>$tahun));
		_this()->db->update('inv_periode',$arr);
	}
	_this()->query->end();
	_message("Periode Sukses.")->end();
}
function getList(){
	$tahun=_get('tahun');
	$c=1;
	$new=_this()->query->row("SELECT count(periode_id) AS jum FROM inv_periode WHERE tenant_id="._this()->pagesession->get()->tenant_id." 
		AND unit_id=1 ");
	if($new->jum>0){
		$c=0;
	}
	$periode=_this()->query->row("SELECT count(periode_id) AS jum FROM inv_periode WHERE tenant_id="._this()->pagesession->get()->tenant_id." 
		AND unit_id=1 AND years='".$tahun."'");
	if($periode->jum==0){
		$obj=array();
		_load('lib/lib_table_sequence');
		$pid=_this()->lib_table_sequence->get('inv_periode');
		$obj['periode_id']=$pid;
		$obj['tenant_id']=_this()->pagesession->get()->tenant_id;
		$obj['unit_id']=1;
		$obj['years']=$tahun;
		_this()->db->insert('inv_periode',$obj);
	}
	$periode=_this()->query->row("SELECT * FROM inv_periode WHERE tenant_id="._this()->pagesession->get()->tenant_id." 
		AND unit_id=1 AND years='".$tahun."'");
	$res=array();
	$close=1;
	$obj=array();
	$obj['d']='01';
	$obj['c']=$c;
	$obj['f1']='Januari';
	$obj['f3']=$periode->m01;
	if($periode->m01==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='02';
	$obj['c']=$c;
	$obj['f1']='Februari';
	$obj['f3']=$periode->m02;
	if($periode->m02==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='03';
	$obj['c']=$c;
	$obj['f1']='Maret';
	$obj['f3']=$periode->m03;
	if($periode->m03==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='04';
	$obj['c']=$c;
	$obj['f1']='April';
	$obj['f3']=$periode->m04;
	if($periode->m04==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='05';
	$obj['c']=$c;
	$obj['f1']='Mei';
	$obj['f3']=$periode->m05;
	if($periode->m05==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='06';
	$obj['c']=$c;
	$obj['f1']='Juni';
	$obj['f3']=$periode->m06;
	if($periode->m06==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='07';
	$obj['c']=$c;
	$obj['f1']='Juli';
	$obj['f3']=$periode->m07;
	if($periode->m07==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='08';
	$obj['c']=$c;
	$obj['f1']='Agustus';
	$obj['f3']=$periode->m08;
	if($periode->m08==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='09';
	$obj['c']=$c;
	$obj['f1']='September';
	$obj['f3']=$periode->m09;
	if($periode->m09==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='10';
	$obj['c']=$c;
	$obj['f1']='Oktober';
	$obj['f3']=$periode->m10;
	if($periode->m10==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='11';
	$obj['c']=$c;
	$obj['f1']='November';
	$obj['f3']=$periode->m11;
	if($periode->m11==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	
	$res[]=$obj;
	$obj=array();
	$obj['d']='12';
	$obj['c']=$c;
	$obj['f1']='Desember';
	$obj['f3']=$periode->m12;
	if($periode->m12==0){
		$close=0;
	}
	$obj['f4']=$close;
	
	$res[]=$obj;
	_data($res)->setTotal(12);
}