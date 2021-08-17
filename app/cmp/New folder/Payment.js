_var.Payment={id:null};
Ext.define('App.cmp.Payment',{
	extend:'App.cmp.Table',
	autoRefresh:false,
	minHeight: 150,
	hideBbar:true,
	lunas:false,
	printing:true,
	buy:0,
	params:function(bo,$this){
		var arr={};
		arr['pid']=$this.payment_id;
		return arr;
	},
	url:url + 'cmp/getPaymentList',
	result:function(response){
		return {list:response.d,total:response.t};
	},
	features:[{
		ftype:'summary'
	}],
	initComponent:function(){
		var $this=this;
		_var.Payment.id=$this.id;
		this.pay=function(){
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			}
			var win=new Ext.Window({
				iconCls:'fa fa-money',
				id:$this.id+'window',
				maxWidth:iif(_mobile==true,size.width,undefined),
				maxHeight:iif(_mobile==true,size.height,undefined),
				title:'Bayar',
				modal : true,
				autoScroll:true,
				listeners:{
					show:function(){
						shortcut.set({
							code:'payment',
							list:[
								{key:'ctrl+s',fn:function(){_click(_var.Payment.id+'btnSave');}
								},{key:'esc',fn:function(){_click(_var.Payment.id+'btnClose');}}
							]
						});
					},
					close:function(){shortcut.remove('payment');}
				},
				fbar: [{
					text: 'Bayar',
					id:$this.id+'btnSave',
					tooltip:'Bayar <b>[Ctrl+S]</b>',
					iconCls:'fa fa-money',
					handler: function() {
						var req=Ext.getCmp($this.id+'panel').qGetForm(true);
						if(req == false)
							Ext.Msg.confirm('Konfirmasi', 'Apakah lakukan transaksi ini?', function(answer) {
								if (answer == "yes") {
									var param = Ext.getCmp($this.id+'panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmp/pay',
										method : 'POST',
										params:param,
										before:function(){Ext.getCmp($this.id+'panel').setLoading(true);},
										success : function(response) {
											Ext.getCmp($this.id+'panel').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){win.close();$this.refresh();}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp($this.id+'panel').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:$this.id+'btnClose',
					handler: function(){win.close();}
				}],
				items:[
					{
						xtype:'ipanel',
						id : $this.id+'panel',
						width: 700,
						layout:{type:'vbox',align:'stretch'},
						items:[
							{
								xtype:'form',
								style:'margin-bottom:5px;',
								border:false,
								items:[
									{
										xtype:'ihiddenfield',
										fieldLabel:'No. Faktur',
										name:'payment_id',
										id:$this.id+'i',
									},{
										xtype:'itextfield',
										fieldLabel:'No. Faktur',
										readOnly:true,
										width: 350,
										id:$this.id+'f1',
									},{
										xtype:'idropdown',
										fieldLabel:'Pembayaran',
										width:350,
										allowBlank: false,
										name:'payment_type',
										query:"SELECT payment_type_id AS id, payment_type_name AS text, "+
											"percentage_flag AS f1,percentage AS f2,kredit AS f3,transfer_flag AS f4 "+
											"FROM payment_type WHERE buy_flag="+$this.buy+" AND tenant_id="+_tenant_id+" ORDER BY payment_type_name",
										id:$this.id+'f2',
										listeners:{
											select:function(a){
												if(a.getValue() != null){
													Ext.getCmp($this.id+'list').enable();
													var table=Ext.getCmp($this.id+'list');
													for(var i=0,iLen=table._getTotal(); i<iLen;i++){
														table._get('f3',i)._setValue(a.dataSelect.f2);
														table._get('f4',i)._setValue(((Number(a.dataSelect.f2)/100))*table._get('f2',i)._getValue());
														table._get('f5',i)._setValue(table._get('f2',i)._getValue()-(table._get('f4',i)._getValue()*iif(a.dataSelect.f3==0,-1,1)));
													}
													if(a.dataSelect.f4==1){
														Ext.getCmp($this.id+'f4').setReadOnly(false);
														Ext.getCmp($this.id+'f4').setValue(null);
														Ext.getCmp($this.id+'f5').setValue(null);
														Ext.getCmp($this.id+'f6').setValue(null);
													}else{
														Ext.getCmp($this.id+'f4').setReadOnly(true);
														Ext.getCmp($this.id+'f4').setValue(null);
														Ext.getCmp($this.id+'f5').setValue(null);
														Ext.getCmp($this.id+'f6').setValue(null);
													}
												}
											}
										},
										allowBlank: false
									},{
										xtype:'itextfield',
										fieldLabel:'No. Faktur',
										name:'faktur',
										readOnly:true,
										id_parent:$this.id,
										allowBlank: false,
										listeners:{
											blur:function(a){
												if(a.getValue()!=='' && a.getValue() !== null){
													if(a.getValue() !==Ext.getCmp(a.id_parent+'f1').getValue()){
														Ext.Ajax.request({
															url : url + 'cmp/getByPayCode',
															method : 'GET',
															params:{code:a.getValue()},
															before:function(){Ext.getCmp(a.id_parent+'panel').setLoading(true);},
															success : function(response) {
																Ext.getCmp(a.id_parent+'panel').setLoading(false);
																var r = ajaxSuccess(response);
																if (r.r == 'S'){
																	if($this.cekPartners != undefined && $this.cekPartners(r.d.partners_id)==true){
																		Ext.getCmp(a.id_parent+'f6').setValue(r.d.payment_id);
																		Ext.getCmp(a.id_parent+'f5').setValue(new Date(r.d.tgl));
																	}else{
																		a.setValue('');
																		a.focus();
																		Ext.create('App.cmp.Toast').toast({msg : 'Faktur Tujuan Tidak Sesuai dengan rekanan.',type : 'warning'});
																	}
																}else{
																	a.setValue('');
																	a.focus();
																}
															},
															failure : function(jqXHR, exception) {
																Ext.getCmp(a.id_parent+'panel').setLoading(false);
																a.setValue('');
																a.focus();
																ajaxError(jqXHR, exception);
															}
														});
													}else{
														a.focus();
														Ext.create('App.cmp.Toast').toast({msg : 'Faktur Transfer Tidak Boleh sama dengan faktur pengirim.',type : 'warning'});
													}
												}
											}
										},
										width:350,
										id:$this.id+'f4',
									},{
										xtype:'ihiddenfield',
										id:$this.id+'f6',
										name:'payment_id_transfer',
									},{
										xtype:'idatefield',
										fieldLabel:'Tgl. Faktur',
										readOnly:true,
										// width:350,
										id:$this.id+'f5',
									},{
										xtype:'itextfield',
										fieldLabel:'Detail',
										name:'detail',
										width:350,
										id:$this.id+'f3',
									}
								]
							},{
								xtype:'ilistinput',
								id:$this.id+'list',
								height:200,
								bodyStyle:'margin-left:-1px;margin-right:-1px;',
								margin:false,
								disabled:true,
								name:'options',
								items:[
									{
										xtype:'itextfield',
										name:'f1',
										tabIndex: -1,
										text:'Deskripsi',
										readOnly:true,
										flex:1,
									},{
										xtype:'ihiddenfield',
										name:'i'
									},{
										xtype:'inumberfield',
										tabIndex: -1,
										name:'f2',
										align:'right',
										readOnly:true,
										text:'Piutang',
										app:{type:'CURRENCY',decimal:2},
										width: 120,
									},{
										xtype:'inumberfield',
										name:'f3',
										align:'right',
										text:'(%)',
										app:{decimal:2},
										listeners:{
											blur:function(a){
												var b=Ext.getCmp($this.id+'f2');
												var table=Ext.getCmp($this.id+'list');
												if(table._get('f3',a.line)._getValue()>100){
													table._get('f3',a.line)._setValue(100);
												}
												table._get('f4',a.line)._setValue((table._get('f3',a.line)._getValue()/100)*table._get('f2',a.line)._getValue());
												table._get('f5',a.line)._setValue(table._get('f2',a.line)._getValue()-(table._get('f4',a.line)._getValue()*iif(b.dataSelect.f3==0,-1,1)));
											}
										},
										width: 70,
									},{
										xtype:'inumberfield',
										align:'right',
										allowBlank: false,
										name:'f4',
										text:'Bayar',
										app:{type:'CURRENCY',decimal:2},
										listeners:{
											blur:function(a){
												var b=Ext.getCmp($this.id+'f2');
												var table=Ext.getCmp($this.id+'list');
												if(table._get('f4',a.line)._getValue()>table._get('f2',a.line)._getValue()){
													table._get('f4',a.line)._setValue(table._get('f2',a.line)._getValue());
												}
												table._get('f3',a.line)._setValue((table._get('f4',a.line)._getValue()/table._get('f2',a.line)._getValue())*100);
												table._get('f5',a.line)._setValue(table._get('f2',a.line)._getValue()-(table._get('f4',a.line)._getValue()*iif(b.dataSelect.f3==0,-1,1)));
											}
										},
										width: 120,
									},{
										xtype:'inumberfield',
										align:'right',
										readOnly:true,
										tabIndex: -1,
										name:'f5',
										text:'Sisa',
										app:{type:'CURRENCY',decimal:2},
										width: 120,
									}
								]
							}
						]
					}
				]
			}).show();
			Ext.getCmp($this.id+'panel').qReset();
			Ext.getCmp($this.id+'i').setValue($this.payment_id);
			Ext.getCmp($this.id+'f1').setValue($this.payment_code);
			Ext.Ajax.request({
				url : url + 'cmp/getPaymentDetailList',
				method : 'GET',
				params:{pid:Ext.getCmp($this.id+'i').getValue()},
				before:function(){Ext.getCmp($this.id+'list').setLoading(true);},
				success : function(response) {
					Ext.getCmp($this.id+'list').setLoading(false);
					var r = ajaxSuccess(response);
					var table=Ext.getCmp($this.id+'list');
					table.resetTable();
					if (r.r == 'S') {
						for(var i=0, iLen=r.d.length; i<iLen;i++){
							if(i!=0){table._add();}
							table._get('i',i).setValue(r.d[i].i);
							table._get('f1',i).setValue(r.d[i].f1);
							table._get('f2',i)._setValue(r.d[i].f2);
							table._get('del',i).disable();
						}
						table._getAddButton().disable();
						Ext.getCmp($this.id+'panel').qSetForm();
					}
				},
				failure : function(jqXHR, exception) {
					Ext.getCmp($this.id+'list').setLoading(false);
					ajaxError(jqXHR, exception,true);
				}
			});
			Ext.getCmp($this.id+'panel').qSetForm();
			Ext.getCmp($this.id+'f2').focus();
		};
		this.columns=[
			{ xtype: 'rownumberer'},
			{ hidden:true,dataIndex: 'i' },
			{ text: 'Waktu/Tanggal',width:150,dataIndex: 'f1',align:'center',menuDisabled:true},
			{ text: 'Deskripsi',flex:1,dataIndex: 'f2',menuDisabled:true,renderer: function(value,a){
					if(a.recordIndex>0){return '<div style="float:right;"><b>'+value+'</b></div>';
					}else{return value;}
				},summaryType:function(records,a,b){
					var tLunas='';
					if(records.length>0){
						var sum1=0;
						for(var i=0,iLen=records.length;i<iLen;i++){sum1+=toInt(records[i].data.f3);}
						var sum2=0;
						for(var i=0,iLen=records.length;i<iLen;i++){sum2+=toInt(records[i].data.f4);}
						if(sum1==sum2){
							if($this.initStatus != undefined){$this.initStatus(1);}
							$this.lunas=1;
							tLunas='<div style="margin-right:5px;float:right;background:green;padding-left: 2px;padding-right: 2px;color:white;">BALANCE</div>';
						}else{
							if($this.initStatus != undefined){$this.initStatus(0);}
							$this.lunas=0;
							tLunas='<div style="margin-right:5px;float:right;background:red;padding-left: 2px;padding-right: 2px;color:white;">BELUM BALANCE</div>';
						}
					}else{
						$this.lunas=0;
						if($this.initStatus != undefined){$this.initStatus(null);}
					}
					return '<div style="float:right;"><b>TOTAL Sisa : '+ (sum1-sum2).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'}); +'</b></div>'+tLunas;
				}
			},
			{ text: 'Tagihan',width: 120,dataIndex: 'f3',menuDisabled:true,align:'right',xtype:'numbercolumn',
				renderer: function(value,a){
					return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
				},summaryType:function(records){
					var sum=0;
					for(var i=0,iLen=records.length;i<iLen;i++){sum+=toInt(records[i].data.f3);}
					return sum;
				}
			},{ text: 'Pembayaran',width: 120,dataIndex: 'f4',menuDisabled:true,align:'right',xtype:'numbercolumn',
				renderer: function(value,a){
					return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
				} ,summaryType:function(records){
					var sum=0;
					for(var i=0,iLen=records.length;i<iLen;i++){sum+=toInt(records[i].data.f4);}
					return sum;
				}
			},{
				text: 'Detail',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-clipboard',
				isDisabled : function(view, rowIdx, colIdx, item, record) {return iif(rowIdx>0,false,true);},
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					if($this.beforeDetail == undefined || 
						($this.beforeDetail != undefined && 
						$this.beforeDetail(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
						var size = {
							width: window.innerWidth || document.body.clientWidth,
							height: window.innerHeight || document.body.clientHeight
						}
						var win=new Ext.Window({
							id:$this.id+'detail',
							title:'Detail',
							modal : true,
							autoScroll:true,
							maxWidth:iif(_mobile==true,size.width,undefined),
							maxHeight:iif(_mobile==true,size.height,undefined),
							fbar: [{
								text: 'Close',
								iconCls:'fa fa-close',
								id:$this.id+'btnClosedetail',
								handler: function(){win.close();}
							}],
							items:[
								{
									xtype:'panel',
									id : $this.id+'paneldetail',
									width: 400,
									layout:'fit',
									border:false,
									items:[
										{
											xtype:'hiddenfield',
											id : $this.id+'detailId',
										},{
											xtype:'itable',
											height:200,
											features:[{
												ftype:'summary'
											}],
											hideBbar:true,
											autoRefresh:false,
											id : $this.id+'detailList',
											params:function(bo){
												var arr={};
												arr['pid']=Ext.getCmp($this.id+'detailId').getValue();
												return arr;
											},
											url:url + 'cmp/getDetailPayment',
											result:function(response){
												return {list:response.d,total:response.t};
											},
											columns:[
												{ xtype: 'rownumberer'},
												{ text: 'Barang',flex:1,dataIndex: 'f1',summaryType:function(records,a,b){
														return 'TOTAL';
													}
												},{ text: 'Jumlah',width: 150,dataIndex: 'f2',align:'right',xtype:'numbercolumn',
													renderer: function(value,a){
														// value=lib.number.formatToNumber(value,window.navigator.language);
														return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
													} ,summaryType:function(records){
														var sum=0;
														for(var i=0,iLen=records.length;i<iLen;i++){sum+=toInt(records[i].data.f2);}
														return sum;
													}
												}
											]
										}
									]
								}
							]
						}).show();
						Ext.getCmp($this.id+'detailId').setValue(record.data.i);
						Ext.getCmp($this.id+'detailList').refresh();
					}
				}
			},{
				text: 'Print',
				hidden:iif($this.printing==true,false,true),
				xtype: 'actioncolumn',
				iconCls: 'fa fa-print',
				isDisabled : function(view, rowIdx, colIdx, item, record) {return iif(record.raw.f5>0,false,true);},
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					if(rowIndex==0){
						if($this.beforeFaktur == undefined || 
						($this.beforeFaktur != undefined && 
						$this.beforeFaktur(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
							Ext.Msg.confirm('Konfirmasi', 'Apakah akan cetak Faktur?', function(answer) {
								if (answer == "yes") {
									Ext.Ajax.request({
										url : $this.urlFaktur,
										method : 'POST',
										params : {i : record.data.i,file:$this.urlFakturFile,show:$this.fakturPreview,
											pid:$this.payment_id},
										before:function(){$this.setLoading(true);},
										success : function(response) {
											$this.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){}
										},
										failure : function(jqXHR, exception) {
											$this.setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
							
						}
					}else{
						if($this.beforeKwitansi == undefined || 
						($this.beforeKwitansi != undefined && 
						$this.beforeKwitansi(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
							Ext.Msg.confirm('Konfirmasi', 'Apakah akan cetak Kwitansi?', function(answer) {
								if (answer == "yes") {
									Ext.Ajax.request({
										url : $this.urlKwitansi,
										method : 'POST',
										params : {i : record.data.i,file:$this.urlKwitansiFile,show:$this.kwitansiPreview,
											pid:$this.payment_id},
										before:function(){$this.setLoading(true);},
										success : function(response) {
											$this.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){}
										},
										failure : function(jqXHR, exception) {
											$this.setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
							
						}
					}
				}
			},{
				text: 'Hapus',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-trash',
				isDisabled : function(view, rowIdx, colIdx, item, record) {return iif(rowIdx>0,false,true);},
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					if($this.beforeDelete == undefined || 
						($this.beforeDelete != undefined && 
						$this.beforeDelete(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
  						Ext.Msg.confirm('Konfirmasi', 'Apakah hapus pembayaran ini?', function(answer) {
							if (answer == "yes") {
								Ext.Ajax.request({
									url : url + 'cmp/del',
									method : 'POST',
									params : {i : record.data.i},
									before:function(){$this.setLoading(true);},
									success : function(response) {
										$this.setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){$this.refresh();}
									},
									failure : function(jqXHR, exception) {
										$this.setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					}
				}
			}
		];
		this.callParent(arguments);
	}
});