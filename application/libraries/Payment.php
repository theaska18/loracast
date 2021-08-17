<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Payment {
	public function generateNo($keterangan,$kredit=1,$kd_kunjungan=null,$nama=''){
		$ci=&get_instance();
		$common=$ci->common;
		$id=$common->seq('ID_PAYMENT');
		$no=$common->seq('NO_PAYMENT');
		$now=new DateTime();
		if($kd_kunjungan==''){
			$kd_kunjungan=null;
		}
		$arr=array(
			'id_payment'=>$id,
			'no_payment'=>$no,
			'keterangan'=>$keterangan,
			'tgl'=>$now->format('Y-m-d'),
			'jam'=>$now->format('Y-m-d H:i:s'),
			'oleh'=>$ci->pagesession->get()->employee_id,
			'kredit'=>$kredit,
			'nama'=>$nama,
			'kd_kunjungan'=>$kd_kunjungan
		);
		$ci->db->insert('rs_payment',$arr);
		return $id;
	}
	public function bayar($id_payment,$jenis_bayar,$detail,$jumlah,$transfer=null,$payment_detail){
		if($transfer==''){
			$transfer=null;
		}
		$ci=&get_instance();
		$common=$ci->common;
		$common->transStart();
		$type=$common->queryRow("SELECT kredit FROM rs_payment_type WHERE kd_payment_type='".$jenis_bayar."'");
		
		$now=new DateTime();
		$data1=array(
			'id_payment_dtl'=>$common->seq('ID_PAYMENT_DTL'),
			'kd_payment_type'=>$jenis_bayar,
			'id_payment'=>$id_payment,
			'keterangan'=>$detail,
			'tgl'=>$now->format('Y-m-d'),
			'jam'=>$now->format('Y-m-d H:i:s'),
			'oleh'=>$ci->pagesession->get()->employee_id,
			'trans'=>3
		);
		if($type->kredit==1){
			$data1['kredit']=$jumlah;
			$data1['debit']=0;
		}else{
			$data1['debit']=$jumlah;
			$data1['kredit']=0;
		}
		if($jenis_bayar=='TR' || $jenis_bayar=='TRD'){
			if($transfer != null){
				$payment=$common->queryRow("SELECT keterangan FROM rs_payment WHERE id_payment=".$id_payment);
				$data2=array(
					'id_payment_dtl'=>$common->seq('ID_PAYMENT_DTL'),
					'id_payment'=>$transfer,
					'tot'=>1,
					'keterangan'=>$payment->keterangan,
					'tgl'=>$now->format('Y-m-d'),
					'jam'=>$now->format('Y-m-d H:i:s'),
					'oleh'=>$ci->pagesession->get()->employee_id,
					'trans'=>1,
					'id_payment_transfer'=>$id_payment
				);
				
				if($jenis_bayar=='TR'){
					$data2['kredit']=$jumlah;
					$data2['hr']=$jumlah;
					$data2['debit']=0;
					$data2['kd_payment_type']='TRD';
				}else{
					$data2['kd_payment_type']='TR';
					$data2['debit']=$jumlah;
					$data2['hr']=$jumlah;
					$data2['kredit']=0;
				}
				$ci->db->insert('rs_payment_dtl',$data2);
				$data1['id_payment_transfer']=$transfer;
				$data1['id_payment_dtl_transfer']=$data2['id_payment_dtl'];
				$data3=array(
					'lunas'=>0
				);
				
				$sqlPayment="SELECT hr_kredit,hr_debit FROM rs_payment WHERE id_payment=".$transfer;
				$arrPayment=$common->queryRow($sqlPayment);
				$datPayment=array(
					'hr_kredit'=>$arrPayment->hr_kredit+$data2['kredit'],
					'hr_debit'=>$arrPayment->hr_debit+$data2['debit']
				);
				$ci->db->where('id_payment',$transfer);
				$ci->db->update('rs_payment',$datPayment);
				
				$ci->db->where('id_payment',$transfer);
				$ci->db->update('rs_payment',$data3);
			}else{
				return false;
			}
		}
		$sqlPayment="SELECT hr_kredit,hr_debit FROM rs_payment WHERE id_payment=".$id_payment;
		$arrPayment=$common->queryRow($sqlPayment);
		$datPayment=array(
			'hr_kredit'=>$arrPayment->hr_kredit+$data1['kredit'],
			'hr_debit'=>$arrPayment->hr_debit+$data1['debit']
		);
		$ci->db->where('id_payment',$id_payment);
		$ci->db->update('rs_payment',$datPayment);
		
		$ci->db->insert('rs_payment_dtl',$data1);
		$sql="SELECT SUM(D.kredit) AS kredit,SUM(D.debit) AS debit,M.kredit AS type FROM rs_payment_dtl D 
			INNER JOIN  rs_payment M ON M.`id_payment`=D.`id_payment` WHERE D.id_payment=".$id_payment;
		$rSql=$common->queryRow($sql);
		$saved=false;
		if($rSql->type==1){
			if($rSql->kredit<=$rSql->debit){
				$saved=true;
			}
		}else{
			if($rSql->kredit>=$rSql->debit){
				$saved=true;
			}
		}
		if($saved==true){
			$data3=array(
				'lunas'=>1
			);
			$ci->db->where('id_payment',$id_payment);
			$ci->db->update('rs_payment',$data3);
		}
		for($i=0,$iLen=count($payment_detail); $i<$iLen;$i++){
			$detailArr=array(
				'id_payment'=>$id_payment,
				'tgl'=>$now->format('Y-m-d'),
				'jam'=>$now->format('Y-m-d H:i:s'),
				'id_payment_dtl'=>$data1['id_payment_dtl'],
				'id_payment_dtl_tag'=>$payment_detail[$i]['id'],
				'hr'=>$payment_detail[$i]['hr']
			);
			$ci->db->insert('rs_payment_tag',$detailArr);
		}
		$common->transEnd();
		return true;
	}
	public function deleteDtlId($id){
		$ci=&get_instance();
		$common=$ci->common;
		$sql="SELECT D.id_payment_transfer,D.id_payment_dtl_transfer,D.id_payment,D.trans,P.`kredit` AS type FROM rs_payment_dtl D 
			INNER JOIN rs_payment P ON P.`id_payment`=D.`id_payment` WHERE `id_payment_dtl`=".$id;
		$rSql=$common->queryRow($sql);
		$id_payment_dtl_transfer=null;
		$del=true;
		
		if($rSql->id_payment_transfer != null && $rSql->trans==3){
			$id_payment_dtl_transfer=$rSql->id_payment_dtl_transfer;
			/*
			$sql2="SELECT SUM(D.kredit) AS kredit,SUM(D.debit) AS debit,M.kredit AS type FROM rs_payment_dtl D 
				INNER JOIN  rs_payment M ON M.`id_payment`=D.`id_payment` WHERE D.id_payment=".$rSql->id_payment_transfer." AND d.`trans`=3";
			$rSql2=$common->queryRow($sql2);	
			if($rSql->type==1){
				if($rSql2->debit>0){
					$del=false;
				}else{
					$id_payment_dtl_transfer=$rSql->id_payment_dtl_transfer;
				}
			}else{
				if($rSql2->kredit>0){
					$del=false;
				}else{
					$id_payment_dtl_transfer=$rSql->id_payment_dtl_transfer;
				}
			}
			*/
		}
		
		if($del==true){
			$sqlDtl="SELECT kredit,debit,id_payment FROM rs_payment_dtl WHERE id_payment_dtl=".$id;
			$arrDtl=$common->queryRow($sqlDtl);
			$sqlPayment="SELECT hr_kredit,hr_debit FROM rs_payment WHERE id_payment=".$arrDtl->id_payment;
			$arrPayment=$common->queryRow($sqlPayment);
			$arrPayment->hr_kredit-=$arrDtl->kredit;
			$arrPayment->hr_debit-=$arrDtl->debit;
			$datPayment=array(
				'hr_kredit'=>$arrPayment->hr_kredit,
				'hr_debit'=>$arrPayment->hr_debit
			);
			$ci->db->where('id_payment',$arrDtl->id_payment);
			$ci->db->update('rs_payment',$datPayment);
			
			
			
			$ci->db->query("DELETE FROM rs_payment_dtl WHERE id_payment_dtl=".$id);
			if($id_payment_dtl_transfer != null){
				$transferLunas=false;
				$sqlDtl="SELECT kredit,debit,id_payment FROM rs_payment_dtl WHERE id_payment_dtl=".$id_payment_dtl_transfer;
				$arrDtl=$common->queryRow($sqlDtl);
				$sqlPayment="SELECT hr_kredit,hr_debit FROM rs_payment WHERE id_payment=".$arrDtl->id_payment;
				$arrPayment=$common->queryRow($sqlPayment);
				$arrPayment->hr_kredit-=$arrDtl->kredit;
				$arrPayment->hr_debit-=$arrDtl->debit;
				$datPayment=array(
					'hr_kredit'=>$arrPayment->hr_kredit,
					'hr_debit'=>$arrPayment->hr_debit
				);
				$ci->db->where('id_payment',$arrDtl->id_payment);
				$ci->db->update('rs_payment',$datPayment);
				
				
				$ci->db->query("DELETE FROM rs_payment_dtl WHERE id_payment_dtl=".$id_payment_dtl_transfer);
				$sql3="SELECT SUM(D.kredit) AS kredit,SUM(D.debit) AS debit,M.kredit AS type FROM rs_payment_dtl D 
						INNER JOIN  rs_payment M ON M.`id_payment`=D.`id_payment` WHERE D.id_payment=".$rSql->id_payment_transfer;
				$rSql3=$common->queryRow($sql3);
				if($rSql3->type==1){
					if($rSql3->debit>=$rSql3->kredit){
						$transferLunas=true;
					}
				}else{
					if($rSql3->kredit>=$rSql3->debit){
						$transferLunas=true;
					}
				}
				if($transferLunas==true){
					$data4=array(
						'lunas'=>1
					);
					$ci->db->where('id_payment',$rSql->id_payment_transfer);
					$ci->db->update('rs_payment',$data4);
				}else{
					$data4=array(
						'lunas'=>0
					);
					$ci->db->where('id_payment',$rSql->id_payment_transfer);
					$ci->db->update('rs_payment',$data4);
				}
			}
			$sql3="SELECT SUM(D.kredit) AS kredit,SUM(D.debit) AS debit,M.kredit AS type FROM rs_payment_dtl D 
					INNER JOIN  rs_payment M ON M.`id_payment`=D.`id_payment` WHERE D.id_payment=".$rSql->id_payment;
			$rSql3=$common->queryRow($sql3);
			$transferLunas=false;
			if($rSql3->type==1){
				if($rSql3->debit>=$rSql3->kredit){
					$transferLunas=true;
				}
			}else{
				if($rSql3->kredit>=$rSql3->debit){
					$transferLunas=true;
				}
			}
			if($transferLunas==true){
				$data4=array(
					'lunas'=>1
				);
				$ci->db->where('id_payment',$rSql->id_payment);
				$ci->db->update('rs_payment',$data4);
			}else{
				$data4=array(
					'lunas'=>0
				);
				$ci->db->where('id_payment',$rSql->id_payment);
				$ci->db->update('rs_payment',$data4);
				}
			return true;
		}else{
			return false;
		}
		
	}
	public function deleteNo($no){
		$ci=&get_instance();
		$common=$ci->common;
		$row=$common->queryRow("SELECT count(id_payment_dtl) as jum FROM rs_payment_dtl WHERE id_payment=".$no." AND trans=3");
		if($row->jum>0){
			return false;
		}else{
			$ci->db->query("DELETE FROM rs_payment WHERE id_payment=".$no);
			return true;
		}
	}
	public function getDtlByPayment($pid){
		$ci=&get_instance();
		// $common=$ci->common;
		$sql="SELECT trans,payment_detail_id AS id,payment_id,PT.payment_type_code,create_on,
			CASE WHEN trans=3 OR PT.payment_type_code='TR' OR PT.payment_type_code='TRD' then 
				CASE WHEN
					py.description is null or py.description=''
				then
					PT.payment_type_name 
				else
					CONCAT(PT.payment_type_name,' - ',py.description)
				end
			else py.description END AS keterangan,
			py.kredit,py.debit,payment_id_transfer 
			FROM payment_detail py 
			INNER JOIN payment_type PT ON PT.payment_type_id=py.payment_type_id 
			WHERE payment_id=".$pid." ORDER BY py.trans ASC,py.create_on ASC";
			//echo $sql;
		$res=$ci->query->result($sql);
		return $res;
	}
	public function getPaymentById($pid){
		$ci=&get_instance();
		$res=$ci->query->result("SELECT * FROM payment WHERE payment_id=".$pid);
		return $res;
	}
	public function clearDetail($id_payment){
		$ci=&get_instance();
		$common=$ci->common;
		$row=$common->queryRow("SELECT count(id_payment_dtl) as total FROM rs_payment_dtl WHERE id_payment=".$id_payment." AND
			trans=3
		");
		if($row->total==0){
			$sql="SELECT hr_debit,hr_kredit FROM rs_payment WHERE id_payment=".$id_payment;
			$payment=$common->queryRow($sql);
			$sqlDtl="SELECT SUM(kredit) AS kredit,SUM(debit) AS debit FROM rs_payment_dtl WHERE  id_payment=".$id_payment." AND trans in(1,2) and
				kd_payment_type not in('TR','TRD')";
			$dtl=$common->queryRow($sqlDtl);
			$data=array(
				'hr_debit'=>$payment->hr_debit-$dtl->debit,
				'hr_kredit'=>$payment->hr_kredit-$dtl->kredit
			);
			$ci->db->where('id_payment',$id_payment);
			$ci->db->update('rs_payment',$data);
			
			$ci->common->query("DELETE FROM rs_payment_dtl WHERE  id_payment=".$id_payment." AND trans in(1,2) and
			kd_payment_type not in('TR','TRD')");
			return true;
		}else{
			return false;
		}
	}
	public function addDetail($id_payment,$kredit=true,$keterangan,$jumlah,$trans=1,$code=null,$harga,$total){
		$ci=&get_instance();
		$common=$ci->common;
		$now=new DateTime();
		$arr=array(
			'id_payment_dtl'=>$common->seq('ID_PAYMENT_DTL'),
			'id_payment'=>$id_payment,
			'trans'=>$trans,
			'code'=>$code,
			'hr'=>$harga,
			'tot'=>$total,
			'keterangan'=>$keterangan,
			'tgl'=>$now->format('Y-m-d'),
			'jam'=>$now->format('Y-m-d H:i:s'),
			'oleh'=>$ci->pagesession->get()->employee_id,
		);
		if($kredit===true){
			if($trans==1){
				$arr['kd_payment_type']='KR';
			}else{
				$arr['kd_payment_type']='ADMK';
			}
			$arr['kredit']=$jumlah;
			$arr['debit']=0;
		}else{
			if($trans==1){
				$arr['kd_payment_type']='DB';
			}else{
				$arr['kd_payment_type']='ADMD';
			}
			$arr['debit']=$jumlah;
			$arr['kredit']=0;
		}
		$ci->db->insert('rs_payment_dtl',$arr);
		$sql="SELECT hr_debit,hr_kredit FROM rs_payment WHERE id_payment=".$id_payment;
		$payment=$common->queryRow($sql);
		$debit=$arr['debit']+$payment->hr_debit;
		$kredit=$arr['kredit']+$payment->hr_kredit;
		$lunas=0;
		if($debit==$kredit){
			$lunas=1;
		}
		$data=array(
			'hr_debit'=>$debit,
			'hr_kredit'=>$kredit,
			'lunas'=>$lunas
		);
		$ci->db->where('id_payment',$id_payment);
		$ci->db->update('rs_payment',$data);
		return $arr['id_payment_dtl'];
	}
	public function updateDetail($id_payment_dtl,$kredit=true,$keterangan,$jumlah,$trans=1,$code=null,$harga,$total){
		$ci=&get_instance();
		$common=$ci->common;
		$now=new DateTime();
		$arr=array(
			'trans'=>$trans,
			'code'=>$code,
			'hr'=>$harga,
			'tot'=>$total,
			'keterangan'=>$keterangan,
			'tgl'=>$now->format('Y-m-d'),
			'jam'=>$now->format('Y-m-d H:i:s'),
			'oleh'=>$ci->pagesession->get()->employee_id
		);
		if($kredit===true){
			if($trans==1){
				$arr['kd_payment_type']='KR';
			}else{
				$arr['kd_payment_type']='ADMK';
			}
			$arr['kredit']=$jumlah;
			$arr['debit']=0;
		}else{
			if($trans==1){
				$arr['kd_payment_type']='DB';
			}else{
				$arr['kd_payment_type']='ADMD';
			}
			$arr['debit']=$jumlah;
			$arr['kredit']=0;
		}
		$sqlDtl="SELECT kredit,debit,id_payment FROM rs_payment_dtl WHERE id_payment_dtl=".$id_payment_dtl;
		$arrDtl=$common->queryRow($sqlDtl);
		$sqlPayment="SELECT hr_kredit,hr_debit FROM rs_payment WHERE id_payment=".$arrDtl->id_payment;
		$arrPayment=$common->queryRow($sqlPayment);
		$arrPayment->hr_kredit-=$arrDtl->kredit;
		$arrPayment->hr_debit-=$arrDtl->debit;
		$arrPayment->hr_kredit+=$arr['kredit'];
		$arrPayment->hr_debit+=$arr['debit'];
		$datPayment=array(
			'hr_kredit'=>$arrPayment->hr_kredit,
			'hr_debit'=>$arrPayment->hr_debit
		);
		$ci->db->where('id_payment',$arrDtl->id_payment);
		$ci->db->update('rs_payment',$datPayment);
		
		$ci->db->where('id_payment_dtl',$id_payment_dtl);
		$ci->db->update('rs_payment_dtl',$arr);
		$sql="SELECT id_payment FROM rs_payment_dtl WHERE id_payment_dtl=".$id_payment_dtl;
		$rSql=$common->queryRow($sql);
		
		$sql3="SELECT SUM(D.kredit) AS kredit,SUM(D.debit) AS debit,M.kredit AS type FROM rs_payment_dtl D 
						INNER JOIN  rs_payment M ON M.`id_payment`=D.`id_payment` WHERE D.id_payment=".$rSql->id_payment;
		$rSql3=$common->queryRow($sql3);
		$transferLunas=false;
		if($rSql3->type==1){
			if($rSql3->debit>=$rSql3->kredit){
				$transferLunas=true;
			}
		}else{
			if($rSql3->kredit>=$rSql3->debit){
				$transferLunas=true;
			}
		}
		if($transferLunas==true){
			$data4=array(
				'lunas'=>1
			);
			$ci->db->where('id_payment',$rSql->id_payment);
			$ci->db->update('rs_payment',$data4);
		}else{
			$data4=array(
				'lunas'=>0
			);
			$ci->db->where('id_payment',$rSql->id_payment);
			$ci->db->update('rs_payment',$data4);
		}
		
		return true;
	}
	public function updateSystem($id_payment,$kredit=true,$keterangan,$jumlah,$trans=1,$code=null,$harga,$total){
		$ci=&get_instance();
		$common=$ci->common;
		$now=new DateTime();
		$arr=array(
			'trans'=>$trans,
			'code'=>$code,
			'hr'=>$harga,
			'tot'=>$total,
			'keterangan'=>$keterangan,
			'tgl'=>$now->format('Y-m-d'),
			'jam'=>$now->format('Y-m-d H:i:s'),
			'oleh'=>$ci->pagesession->get()->employee_id
		);
		if($kredit===true){
			if($trans==1){
				$arr['kd_payment_type']='KR';
			}else{
				$arr['kd_payment_type']='ADMK';
			}
			$arr['kredit']=$jumlah;
			$arr['debit']=0;
		}else{
			if($trans==1){
				$arr['kd_payment_type']='DB';
			}else{
				$arr['kd_payment_type']='ADMD';
			}
			$arr['debit']=$jumlah;
			$arr['kredit']=0;
		}
		$sqlDtl="SELECT kredit,debit,id_payment FROM rs_payment_dtl WHERE id_payment=".$id_payment." AND code='".$code."'";
		$arrDtl=$common->queryRow($sqlDtl);
		$sqlPayment="SELECT hr_kredit,hr_debit FROM rs_payment WHERE id_payment=".$arrDtl->id_payment;
		//echo $sqlPayment;
		$arrPayment=$common->queryRow($sqlPayment);
		$arrPayment->hr_kredit-=$arrDtl->kredit;
		$arrPayment->hr_debit-=$arrDtl->debit;
		$arrPayment->hr_kredit+=$arr['kredit'];
		$arrPayment->hr_debit+=$arr['debit'];
		$datPayment=array(
			'hr_kredit'=>$arrPayment->hr_kredit,
			'hr_debit'=>$arrPayment->hr_debit
		);
		$ci->db->where('id_payment',$arrDtl->id_payment);
		$ci->db->update('rs_payment',$datPayment);
		$ci->db->where(array('id_payment'=>$id_payment,'code'=>$code));
		$ci->db->update('rs_payment_dtl',$arr);
		
		$sql3="SELECT SUM(D.kredit) AS kredit,SUM(D.debit) AS debit,M.kredit AS type FROM rs_payment_dtl D 
						INNER JOIN  rs_payment M ON M.`id_payment`=D.`id_payment` WHERE D.id_payment=".$id_payment;
		$rSql3=$common->queryRow($sql3);
		$transferLunas=false;
		if($rSql3->type==1){
			if($rSql3->debit>=$rSql3->kredit){
				$transferLunas=true;
			}
		}else{
			if($rSql3->kredit>=$rSql3->debit){
				$transferLunas=true;
			}
		}
		if($transferLunas==true){
			$data4=array(
				'lunas'=>1
			);
			$ci->db->where('id_payment',$id_payment);
			$ci->db->update('rs_payment',$data4);
		}else{
			$data4=array(
				'lunas'=>0
			);
			$ci->db->where('id_payment',$id_payment);
			$ci->db->update('rs_payment',$data4);
		}
		
		return true;
	}
	public function printBill($id_payment){
		
	}
	public function getPrint(){
		$tmpdir=sys_get_temp_dir();
		$file=tempnam($tmpdir,'ctk');
		$handle=fopen($file,'w');
		$condensed=Chr(27).Chr(33).Chr(4);
		$bold1=Chr(27).Chr(69);
		$bold0=Chr(27).Chr(70);
		$initialized=Chr(27).Chr(64);
		$condensed1=Chr(15);
		$condensed0=Chr(18);
		$Data=$initialized;
		$Data.=$condensed1;
		$Data.='==================\n';
		$Data.='|   '.$bold1.'ASEP KAMALUDIN'.$bold0;
		$Data.='==================\n';
		$Data.='==================\n';
		$Data.='==================\n';
		$Data.='==================\n';
		$Data.='==================\n';
		$Data.='==================\n';
		$Data.='==================\n';
		fwrite($handle,$Data);
		fclose($handle);
	}
}

?>