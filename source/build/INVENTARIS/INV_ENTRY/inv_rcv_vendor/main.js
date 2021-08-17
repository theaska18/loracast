/*
	import cmp.ipanel
	import cmp.iinput
	import cmp.idatefield
	import cmp.iselect
	import cmp.icomboquery
	import cmp.ilistinput
	import cmp.icombobox
	import cmp.iconfig
	import cmp.itable
	import cmp.inumberfield
	import PARAMETER.iparameter
	import DIRECT_PRINT.idirectprint
*/
new Ext.Panel({
	id : 'INV_RCV_VENDOR.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_RCV_VENDOR.search',
			modal:false,
			title:'Penerimaan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_RCV_VENDOR.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_RCV_VENDOR.search.f1').focus();
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('search');
				}
			},
			fbar: [
				{
					text: 'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'INV_RCV_VENDOR.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_RCV_VENDOR.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_RCV_VENDOR.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_RCV_VENDOR.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close fa-red',
					handler: function() {
						Ext.getCmp('INV_RCV_VENDOR.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_RCV_VENDOR.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Terima',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},
							id:'INV_RCV_VENDOR.search.f1'
						},{
							xtype:'iinput',
							label : 'Tgl. Terima',
							items : [
								 {
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									press:{
										enter:function(){
											_click('INV_RCV_VENDOR.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									margin:false,
									name : 'f3',
									press:{
										enter:function(){
											_click('INV_RCV_VENDOR.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'iinput',
							label : 'Jatuh Tempo',
							items : [
								{
									xtype:'idatefield',
									id : 'INV_RCV_VENDOR.search.f4',
									name : 'f4',
									margin:false,
									press:{
										enter:function(){
											_click('INV_RCV_VENDOR.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									id : 'INV_RCV_VENDOR.search.f5',
									margin:false,
									name : 'f5',
									press:{
										enter:function(){
											_click('INV_RCV_VENDOR.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Nama Vendor',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},
							id:'INV_RCV_VENDOR.search.f6'
						},{
							xtype:'itextfield',
							name:'f7',
							fieldLabel:'No. Surat',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},
							id:'INV_RCV_VENDOR.search.f7'
						},{
							xtype:'itextfield',
							name:'f9',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},
							id:'INV_RCV_VENDOR.search.f9'
						},{
							xtype:'itextfield',
							name:'f10',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},
							id:'INV_RCV_VENDOR.search.f10'
						},{
							xtype:'itextfield',
							name:'f11',
							fieldLabel:'Kode Gin',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								}
							},
							id:'INV_RCV_VENDOR.search.f10'
						},{ 
							xtype:'iparameter',
							id : 'INV_RCV_VENDOR.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_RCV_VENDOR.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('INV_RCV_VENDOR.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('INV_RCV_VENDOR.dropdown').getValue()]=Ext.getCmp('INV_RCV_VENDOR.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_RCV_VENDOR&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('INV_RCV_VENDOR_DELETE',function(){
						Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
							msg : "Apakah akan menghapus No. Terima '"+a.f1+"'",
							allow : 'INV_RCV_VENDOR.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_RCV_VENDOR&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('INV_RCV_VENDOR.list').setLoading('Hapus Kode Terima '+a.f1);
									},
									success : function(response) {
										Ext.getCmp('INV_RCV_VENDOR.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_RCV_VENDOR.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_RCV_VENDOR.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_RCV_VENDOR_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_RCV_VENDOR&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_RCV_VENDOR.list').setLoading("Mengambil No. Terima '"+a.f1+"'");
							},
							success : function(response) {
								Ext.getCmp('INV_RCV_VENDOR.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
									Ext.getCmp('INV_RCV_VENDOR.input.panel').qReset();
									table.resetTable();
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.receive_detail_id);
										table._get('barang',i).setValue({i:obj.item_id,name:obj.item_name});
										table._get('sat',i).setUrl(url + 'cmd?m=INV_RCV_VENDOR&f=loadMeasurementByUpdate&i='+obj.item_id+'&frac='+obj.fraction+'&mou='+obj.measurement_id,obj.measurement_id);

										table._get('qty',i)._setValue(obj.qty);
										table._get('fraction',i)._setValue(obj.fraction);
										table._get('sat_kecil',i).setValue(obj.measurement_name);
										table._get('harga_beli',i)._setValue(obj.buy_price);
										table._get('discount',i)._setValue(obj.disc);
										table._get('discount_rp',i)._setValue(obj.disc_price);
										table._get('ppn',i)._setValue(obj.ppn);
										table._get('gin',i).setValue(obj.gin_code);
										if(obj.expire_flag==1){
											table._get('expired',i).setReadOnly(false);
											table._get('expired',i).setValue(obj.expire_date);
										}else{
											table._get('expired',i).setReadOnly(true);
										}
										table._get('expire_flag',i).setValue(obj.expire_flag);
										table._get('batch',i).setValue(obj.batch);
										table.countLine(i);
										
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('barcode',i).setReadOnly(true);
											table._get('sat',i).setReadOnly(true);
											table._get('expired',i).setReadOnly(true);
											table._get('batch',i).setReadOnly(true);
											table._get('qty',i).setReadOnly(true);
											table._get('fraction',i).setReadOnly(true);
											table._get('del',i).disable();
											if(obj.qty_out<0){
												table._get('ppn',i).setReadOnly(true);
												table._get('discount',i).setReadOnly(true);
												table._get('discount_rp',i).setReadOnly(true);
												table._get('harga_beli',i).setReadOnly(true);
											}
										}
									}
									table.loadQuery=true;
									Ext.getCmp('INV_RCV_VENDOR.input.i').setValue(a.i);
									Ext.getCmp('INV_RCV_VENDOR.input.f1').setValue(a.f1);
									Ext.getCmp('INV_RCV_VENDOR.input.f2').setValue(a.f2);
									Ext.getCmp('INV_RCV_VENDOR.input.f3').setValue(a.f3);
									Ext.getCmp('INV_RCV_VENDOR.input.f4').setValue({i:o.distributor_id,name:o.vendor});
									Ext.getCmp('INV_RCV_VENDOR.input.f5').setValue(a.f6);
									Ext.getCmp('INV_RCV_VENDOR.input.f6').setValue(o.description);
									if(o.posted ==0){
										Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(false);
										Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(false);
										Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(false);
										Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(false);
										Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(false);
										Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').enable();
										Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').disable();
									}else{
										table._getAddButton().disable();
										Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(true);
										Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(true);
										Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(true);
										Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(true);
										Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(true);
										Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').disable();
										Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').enable();
									}
									Ext.getCmp('INV_RCV_VENDOR.input.materai')._setValue(o.materai);
									table.count();
									Ext.getCmp('INV_RCV_VENDOR.list').hide();
									Ext.getCmp('INV_RCV_VENDOR.input').show();
									Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
									Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_RCV_VENDOR.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_RCV_VENDOR.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_RCV_VENDOR.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Penerimaan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'INV_RCV_VENDOR.config',
					code:[
						iif(_access('INV_RCV_VENDOR_config_PPN')==false,'PPN',null),
						iif(_access('INV_RCV_VENDOR_config_BARCODE')==false,'BARCODE',null),
						iif(_access('INV_RCV_VENDOR_config_DEFAULT_DUE_DATE')==false,'DEFAULT_DUE_DATE',null),
						iif(_access('INV_RCV_VENDOR_config_DEFAULT_BATCH')==false,'DEFAULT_BATCH',null),
						iif(_access('INV_RCV_VENDOR_config_UNIT_ID')==false,'UNIT_ID',null),
						iif(_access('INV_RCV_VENDOR_config_LABEL_FILE_NAME')==false,'LABEL_FILE_NAME',null),
						iif(_access('INV_RCV_VENDOR_config_LABEL_PREVIEW')==false,'LABEL_PREVIEW',null),
						iif(_access('INV_RCV_VENDOR_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
						iif(_access('INV_RCV_VENDOR_config_SEQUENCE_GIN')==false,'SEQUENCE_GIN',null),
						iif(_access('INV_RCV_VENDOR_config_PRINT_BARCODE')==false,'PRINT_BARCODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'INV_RCV_VENDOR.btnAdd',
					iconCls: 'fa fa-plus  fa-green',
					handler:function(a){
						Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(false);
						Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(false);
						Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(false);
						Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(false);
						Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(false);
						Ext.getCmp('INV_RCV_VENDOR.input.panel').qReset();
						Ext.getCmp('INV_RCV_VENDOR.input.tableOption').resetTable();
						Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').enable();
						Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').disable();
						Ext.getCmp('INV_RCV_VENDOR.list').hide();
						Ext.getCmp('INV_RCV_VENDOR.input').show();
						Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
						Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'INV_RCV_VENDOR.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'INV_RCV_VENDOR.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f1',text:'No. Terima'},
								{id:'f6',text:'Nama Vendor'},
								{id:'f7',text:'No. Surat'},
								{id:'f9',text:'Nama Barang'},
								{id:'f10',text:'Kode Barang'},
								{id:'f11',text:'Kode Gin'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'INV_RCV_VENDOR.text',
							press:{
								enter:function(){
									_click('INV_RCV_VENDOR.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'INV_RCV_VENDOR.btnSearch',
							handler : function(a) {
								Ext.getCmp('INV_RCV_VENDOR.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_RCV_VENDOR.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('INV_RCV_VENDOR.search').show();
						Ext.getCmp('INV_RCV_VENDOR.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'No. Terima',width: 120, dataIndex: 'f1' },
				{ text: 'Tgl. Terima',width: 100,xtype:'date',dataIndex: 'f2'},
				{ text: 'Jatuh Tempo',width: 100,xtype:'date',dataIndex: 'f3'},
				{ text: 'Vendor',flex: 1,dataIndex: 'f4' },
				{ text: 'No. Surat',width: 200,dataIndex: 'f6'},
				{ xtype:'active',text: 'Posting',dataIndex: 'f5'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_RCV_VENDOR.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_RCV_VENDOR.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'INV_RCV_VENDOR.input',
			hidden:true,
			border:false,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('INV_RCV_VENDOR.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_RCV_VENDOR.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('INV_RCV_VENDOR.input.btnNew');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar: [
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'INV_RCV_VENDOR.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('INV_RCV_VENDOR.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'INV_RCV_VENDOR.close',
								onY : function() {
									Ext.getCmp('INV_RCV_VENDOR.input').hide();
									Ext.getCmp('INV_RCV_VENDOR.list').show();
								}
							});
						}else{
							Ext.getCmp('INV_RCV_VENDOR.input').hide();
							Ext.getCmp('INV_RCV_VENDOR.list').show();
						}
					}
				},'->','<b>Input Penerimaan</b>','->',
				{
					xtype:'buttongroup',
					items:[
						{
							text: 'New',
							tooltip:'New <b>[F6]</b>',
							id:'INV_RCV_VENDOR.input.btnNew',
							iconCls:'fa fa-file',
							handler: function() {
								var $this = this;
								$this.closing = false;
								if (Ext.getCmp('INV_RCV_VENDOR.input.panel').qGetForm() == false)
									Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
										msg :'Apakah akan mengabaikan data yang sudah diubah?',
										allow : 'INV_RCV_VENDOR.close',
										onY : function() {
											Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(false);
											Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(false);
											Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(false);
											Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(false);
											Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(false);
											Ext.getCmp('INV_RCV_VENDOR.input.panel').qReset();
											Ext.getCmp('INV_RCV_VENDOR.input.tableOption').resetTable();
											Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').enable();
											Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').disable();
											Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
											Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
										}
									});
								else{
									Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(false);
									Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(false);
									Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(false);
									Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(false);
									Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(false);
									Ext.getCmp('INV_RCV_VENDOR.input.panel').qReset();
									Ext.getCmp('INV_RCV_VENDOR.input.tableOption').resetTable();
									Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').enable();
									Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').disable();
									Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
									Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
								}
								return false;
							}
						},{
							text: 'Simpan',
							tooltip:'Simpan <b>[Ctrl+s]</b>',
							id:'INV_RCV_VENDOR.input.btnSave',
							iconCls:'fa fa-save fa-green',
							handler: function() {
								var req=Ext.getCmp('INV_RCV_VENDOR.input.panel').qGetForm(true);
								if(req == false){
									var error=false;
									var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
									var objCek={};
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(table._get('qty',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
											table._get('qty',i).focus();
											return false;
										}
										if(table._get('fraction',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Faction Tidak Boleh 0.',type : 'warning'});
											table._get('fraction',i).focus();
											return false;
										}
										if(objCek[table._get('barang',i).getValue()]== undefined){
											objCek[table._get('barang',i).getValue()]={};
										}
										if(objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] != undefined){
											error=true;
											Ext.create('IToast').toast({msg : 'Satuan Barang dan Batch tidak boleh sama.',type : 'warning'});
											table._get('sat',i).focus();
											return false;
										}else{
											objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] =true;
										}
										
									}
									Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
										msg : 'Apakah akan menyimpan data ini?',
										allow : 'INV_RCV_VENDOR.save',
										onY : function() {
											var param = Ext.getCmp('INV_RCV_VENDOR.input.panel').qParams();
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_RCV_VENDOR&f=save',
												method : 'POST',
												params:param,
												before:function(){
													Ext.getCmp('INV_RCV_VENDOR.input').setLoading('Menyimpan');
												},
												success : function(response) {
													Ext.getCmp('INV_RCV_VENDOR.input').setLoading(false);
													var r = ajaxSuccess(response);
													if (r.r == 'S') {
														for(var j=0,jLen=r.d.l.length; j<jLen;j++){
															var Oj=r.d.l[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('id',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														Ext.getCmp('INV_RCV_VENDOR.input.i').setValue(r.d.id);
														Ext.getCmp('INV_RCV_VENDOR.input.f1').setValue(r.d.code);
														Ext.getCmp('INV_RCV_VENDOR.list').refresh();
														Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
														Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
													}
												},
												failure : function(jqXHR, exception) {
													Ext.getCmp('INV_RCV_VENDOR.input').setLoading(false);
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								}else if(req==true)
									Ext.getCmp('INV_RCV_VENDOR.input').qClose();
							}
						},{
							text: 'Posting',
							tooltip:'Posting',
							id:'INV_RCV_VENDOR.input.btnPosting',
							iconCls:'fa fa-check fa-green',
							handler: function() {
								if(Ext.getCmp('INV_RCV_VENDOR.input.c').getValue()==''){
									Ext.getCmp('INV_RCV_VENDOR.input.c').setValue('Y');
								}else{
									Ext.getCmp('INV_RCV_VENDOR.input.c').setValue('');
								}
								var req=Ext.getCmp('INV_RCV_VENDOR.input.panel').qGetForm(true);
								if(req == false){
									var error=false;
									var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
									var objCek={};
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(table._get('qty',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
											table._get('qty',i).focus();
											return false;
										}
										if(table._get('fraction',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Faction Tidak Boleh 0.',type : 'warning'});
											table._get('fraction',i).focus();
											return false;
										}
										if(objCek[table._get('barang',i).getValue()]== undefined){
											objCek[table._get('barang',i).getValue()]={};
										}
										if(objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] != undefined){
											error=true;
											Ext.create('IToast').toast({msg : 'Satuan Barang dan Batch tidak boleh sama.',type : 'warning'});
											table._get('sat',i).focus();
											return false;
										}else{
											objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] =true;
										}
									}
									Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
										msg : 'Apakah akan di Posting?',
										allow : 'INV_RCV_VENDOR.posting',
										onY : function() {
											var param = Ext.getCmp('INV_RCV_VENDOR.input.panel').qParams();
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_RCV_VENDOR&f=posting',
												method : 'POST',
												params:param,
												before:function(){
													Ext.getCmp('INV_RCV_VENDOR.input').setLoading('Menyimpan');
												},
												success : function(response) {
													Ext.getCmp('INV_RCV_VENDOR.input').setLoading(false);
													var r = ajaxSuccess(response);
													if (r.r == 'S') {
														for(var j=0,jLen=r.d.l.length; j<jLen;j++){
															var Oj=r.d.l[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('id',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														for(var j=0,jLen=r.d.lg.length; j<jLen;j++){
															var Oj=r.d.lg[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('gin',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														Ext.getCmp('INV_RCV_VENDOR.input.i').setValue(r.d.id);
														Ext.getCmp('INV_RCV_VENDOR.input.f1').setValue(r.d.code);
														Ext.getCmp('INV_RCV_VENDOR.list').refresh();
														Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').disable();
														Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').enable();
														Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
														Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
														for(var i=0,iLen=table._getTotal();i<iLen;i++){
															table._get('barang',i).setReadOnly(true);
															table._get('barcode',i).setReadOnly(true);
															table._get('sat',i).setReadOnly(true);
															table._get('expired',i).setReadOnly(true);
															table._get('batch',i).setReadOnly(true);
															table._get('qty',i).setReadOnly(true);
															table._get('fraction',i).setReadOnly(true);
															table._get('del',i).disable();
														}
														table._getAddButton().disable();
														Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(true);
														Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(true);
														Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(true);
														Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(true);
														Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(true);
													}
												},
												failure : function(jqXHR, exception) {
													Ext.getCmp('INV_RCV_VENDOR.input').setLoading(false);
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								}else if(req==true)
									Ext.getCmp('INV_RCV_VENDOR.input').qClose();
							}
						},{
							text: 'Unposting',
							tooltip:'Unposting <b>[Esc]</b>',
							id:'INV_RCV_VENDOR.input.btnUnposting',
							iconCls:'fa fa-close fa-red',
							handler: function() {
								Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
									msg : 'Apakah akan di UnPosting?',
									allow : 'INV_RCV_VENDOR.posting',
									onY : function() {
										Ext.Ajax.request({
											url : url + 'cmd?m=INV_RCV_VENDOR&f=unposting',
											method : 'POST',
											params:{i:Ext.getCmp('INV_RCV_VENDOR.input.i').getValue()},
											before:function(){
												Ext.getCmp('INV_RCV_VENDOR.input').setLoading('Menyimpan');
											},
											success : function(response) {
												Ext.getCmp('INV_RCV_VENDOR.input').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
													Ext.getCmp('INV_RCV_VENDOR.list').refresh();
													Ext.getCmp('INV_RCV_VENDOR.input.btnPosting').enable();
													Ext.getCmp('INV_RCV_VENDOR.input.btnUnposting').disable();
													Ext.getCmp('INV_RCV_VENDOR.input.f2').focus();
													Ext.getCmp('INV_RCV_VENDOR.input.panel').qSetForm();
													for(var i=0,iLen=table._getTotal();i<iLen;i++){
														table._get('barang',i).setReadOnly(false);
														table._get('sat',i).setReadOnly(false);
														if(table._get('expire_flag',i).getValue()==1){
															table._get('expired',i).setReadOnly(false);
														}
														table._get('batch',i).setReadOnly(false);
														table._get('barcode',i).setReadOnly(false);
														table._get('qty',i).setReadOnly(false);
														table._get('fraction',i).setReadOnly(false);
														table._get('del',i).enable();
														table._get('ppn',i).setReadOnly(false);
														table._get('discount',i).setReadOnly(false);
														table._get('discount_rp',i).setReadOnly(false);
														table._get('harga_beli',i).setReadOnly(false);
													}
													table._getAddButton().enable();
													Ext.getCmp('INV_RCV_VENDOR.input.f2').setReadOnly(false);
													Ext.getCmp('INV_RCV_VENDOR.input.f3').setReadOnly(false);
													Ext.getCmp('INV_RCV_VENDOR.input.f4').setReadOnly(false);
													Ext.getCmp('INV_RCV_VENDOR.input.f5').setReadOnly(false);
													Ext.getCmp('INV_RCV_VENDOR.input.f6').setReadOnly(false);
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('INV_RCV_VENDOR.input').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							}
						}
					]
				}
				
			],
			items:[
				{
					xtype:'ipanel',
					paddingBottom:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,false,true),
					id : 'INV_RCV_VENDOR.input.panel',
					submit:'INV_RCV_VENDOR.input.btnSave',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					items:[
						{
							xtype:'form',
							border:false,
							cls:'i-transparent',
							style:'margin-bottom: 5px;',
							layout:'column',
							items:[
								{
									xtype:'ihiddenfield',
									name:'i',
									id:'INV_RCV_VENDOR.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'INV_RCV_VENDOR.input.c'
								},{
									xtype:'itextfield',
									id : 'INV_RCV_VENDOR.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Terima'
								},{
									xtype:'idatefield',
									id : 'INV_RCV_VENDOR.input.f2',
									submit:'INV_RCV_VENDOR.input.panel',
									value:new Date(),
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Terima'
								},{
									xtype:'idatefield',
									id : 'INV_RCV_VENDOR.input.f3',
									submit:'INV_RCV_VENDOR.input.panel',
									allowBlank : false,
									labelAlign:'top',
									value:eval(getSetting('INV_RCV_VENDOR','DEFAULT_DUE_DATE')),
									name : 'f3',
									width: 100,
									fieldLabel:'Jatuh Tempo'
								},{
									xtype:'iselect',
									fieldLabel:'Vendor',
									labelAlign:'top',
									submit:'INV_RCV_VENDOR.input.panel',
									width: 250,
									id:'INV_RCV_VENDOR.input.f4',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'f4',
									button:{
										urlData:url + 'cmd?m=INV_RCV_VENDOR&f=getListVendor',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Vendor',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Vendor',
											},{
												xtype:'icomboquery',
												name : 'f3',
												fieldLabel:'Jenis Penyalur',
												query:"SELECT distributor_type_id AS id,CONCAT(distributor_type_name,' - ',distributor_type_code) AS text FROM inv_distributor_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY distributor_type_code ASC",
											},{
												xtype:'itextfield',
												name:'f14',
												fieldLabel:'No. PAK',
											},{
												xtype:'itextfield',
												name:'f16',
												fieldLabel:'Fax',
											},{
												xtype:'itextfield',
												name:'f6',
												fieldLabel:'Alamat',
											},{
												xtype:'itextfield',
												name:'f7',
												type:'DYNAMIC_COUNTRY',
												fieldLabel:'Negara',
											},{
												xtype:'itextfield',
												name:'f8',
												fieldLabel:'Provinsi',
											},{
												xtype:'itextfield',
												name:'f9',
												fieldLabel:'Kota',
											}
										],
										columns:[
											{ hidden:true,hideable:false,dataIndex: 'i'},
											{ text: 'Vendor',width: 250, dataIndex: 'name'  },
											{ text: 'Jenis Vendor',width: 100,dataIndex: 'type' },
											{ text: 'Email',width: 150, dataIndex:'email'},
											{ text: 'Alamat',flex:1, dataIndex: 'address' },
											{ xtype:'active',menuDisabled:true,dataIndex: 'a'}
										]
									}
								},{
									xtype:'itextfield',
									id : 'INV_RCV_VENDOR.input.f5',
									labelAlign:'top',
									submit:'INV_RCV_VENDOR.input.panel',
									maxLength:32,
									name : 'f5',
									width: 200,
									fieldLabel:'No. Surat'
								},{
									xtype:'itextfield',
									id : 'INV_RCV_VENDOR.input.f6',
									labelAlign:'top',
									submit:'INV_RCV_VENDOR.input.panel',
									maxLength:128,
									name : 'f6',
									width: 300,
									fieldLabel:'Keterangan'
								}	
							]
						},{
							xtype:'ilistinput',
							id:'INV_RCV_VENDOR.input.tableOption',
							name:'options',
							flex:1,
							style:'padding: 0px 4px;',
							margin:false,
							loadQuery:true,
							
							onRemove:function(){
								var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
								table.count();
							},
							countLine:function(line){
								var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
								var jumlahQty=parseFloat(table._get('fraction',line)._getValue())* parseFloat(table._get('qty',line)._getValue());
								table._get('jumlah_qty',line)._setValue(jumlahQty);
								var discAll=0,ppn=0,tot=0;
								discAll=((((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue()))/100)*parseFloat(table._get('discount',line)._getValue()))+
									parseFloat(table._get('discount_rp',line)._getValue()));
								table._get('jumlah_harga',line).setValue((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue())));
								table._get('jumlah_diskon',line).setValue(discAll);
								ppn=(((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue()))-discAll)/100)*parseFloat(table._get('ppn',line)._getValue());
								table._get('jumlah_ppn',line).setValue(ppn);
								tot=((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue()))-discAll)+ppn;
								table._get('jumlah',line)._setValue(tot);
								table._get('harga_dasar',line).setValue((tot/parseFloat(table._get('qty',line)._getValue()))/parseFloat(table._get('fraction',line)._getValue()));
							},
							count:function(){
								var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
								var jumlahDiskon=0,jumlahPPN=0,jumlahHarga=0;
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									jumlahDiskon+=parseFloat(table._get('jumlah_diskon',i).getValue());
									jumlahPPN+=parseFloat(table._get('jumlah_ppn',i).getValue());
									jumlahHarga+=parseFloat(table._get('jumlah_harga',i).getValue());
								}
								Ext.getCmp('INV_RCV_VENDOR.input.discount')._setValue(jumlahDiskon);
								Ext.getCmp('INV_RCV_VENDOR.input.ppn')._setValue(jumlahPPN);
								Ext.getCmp('INV_RCV_VENDOR.input.sub_total')._setValue(jumlahHarga);
								Ext.getCmp('INV_RCV_VENDOR.input.total')._setValue(((jumlahHarga-jumlahDiskon)+jumlahPPN)+parseInt(Ext.getCmp('INV_RCV_VENDOR.input.materai')._getValue()));
							},
							items:[
								{
									xtype:'itextfield',
									name:'barcode',
									submit:'INV_RCV_VENDOR.input.panel',
									hidden:iif(getSetting('INV_RCV_VENDOR','BARCODE')=='Y',false,true),
									text:'Barcode (Pencarian)',
									width:150,
									emptyText:'Masukan Barcode',
									press:{
										enter:function(b){
											if(b.getValue()!==''){
												var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
												if(table.loadQuery==true){
													Ext.Ajax.request({
														url : url + 'cmd?m=INV_RCV_VENDOR&f=getInitItemByBarcode',
														method : 'GET',
														params : {
															i : b.getValue()
														},
														success : function(response) {
															var r = ajaxSuccess(response);
															if (r.r == 'S'){
																var o=r.d.o;
																table._get('barang',b.line).setValue({i:o.i,name:o.item});
																table._get('sat',b.line).setUrl(url + 'cmd?m=INV_RCV_VENDOR&f=loadMeasurementByItem&i='+o.i,o.f1);	
																table._get('qty',b.line)._setValue(1);
																if(o.harga==null){
																	o.harga=0;
																}
																table._get('harga_beli',b.line)._setValue(o.harga);
																table._get('fraction',b.line)._setValue(o.f2);
																table._get('sat_kecil',b.line).setValue(o.f3);
																table._get('expire_flag',b.line).setValue(o.f4);
																if(o.f4==1){
																	table._get('expired',b.line).setReadOnly(false);
																}else{
																	table._get('expired',b.line).setReadOnly(true);
																}
																table.countLine(b.line);
																table.count();
															}
														},
														failure : function(jqXHR, exception) {
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											}
										}
									}
								},{
									xtype:'iselect',
									width: 250,
									text:'Barang',
									submit:'INV_RCV_VENDOR.input.panel',
									emptyText:'Barang',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'barang',
									onReset:function(a){
										var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
										table.countLine(a.line);
										table.count();
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
										if(table.loadQuery==true){
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_RCV_VENDOR&f=getInitItem',
												method : 'GET',
												params : {
													i : a.i
												},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S'){
														var o=r.d.o,table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
														table._get('sat',b.line).setUrl(url + 'cmd?m=INV_RCV_VENDOR&f=loadMeasurementByItem&i='+a.i,o.f1);	
														table._get('qty',b.line)._setValue(1);
														if(a.harga==null){
															a.harga=0;
														}
														table._get('harga_beli',b.line)._setValue(a.harga);
														table._get('fraction',b.line)._setValue(o.f2);
														table._get('sat_kecil',b.line).setValue(o.f3);
														table._get('expire_flag',b.line).setValue(o.f4);
														if(o.f4==1){
															table._get('expired',b.line).setReadOnly(false);
														}else{
															table._get('expired',b.line).setReadOnly(true);
														}
														table.countLine(b.line);
														table.count();
													}
												},
												failure : function(jqXHR, exception) {
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									},
									button:{
										urlData : url + 'cmd?m=INV_RCV_VENDOR&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Barang',
											}
										],
										columns:[
											{ hidden:true,hideable:false,dataIndex: 'i'},
											{ text: 'Barang',width: 200, dataIndex: 'name'},
											{ text: 'Satuan Beli',width: 100, dataIndex:'mou' },
											{ text: 'Deskripsi',flex: 1,dataIndex: 'description'},
											{ text: 'Stok',width: 100, dataIndex:'stock',align:'right',
												renderer: function(value,a){
													return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_k;
												}
											},{ text: 'Harga',width: 100, dataIndex:'harga',align:'right',
												renderer: function(value){
													return Number(value).toLocaleString(window.navigator.language,{style: 'currency', currency: 'IDR',minimumFractionDigits:2 });;
												}
											},{ xtype:'active',dataIndex: 'a'}
										]
									}
								},{
									xtype:'itextfield',
									name:'gin',
									text:'Gin Code',
									readOnly:true,
									submit:'INV_RCV_VENDOR.input.panel',
									tabIndex:-1,
									width:100,
									emptyText:'Gin Code',
								},{
									xtype:'button',
									iconCls:'fa fa-barcode',
									width: 20,
									hidden:iif(getSetting('INV_RCV_VENDOR','PRINT_BARCODE')=='Y',false,true),
									text:'&nbsp;',
									tabIndex:-1,
									handler:function(a){
										_access('INV_RCV_VENDOR_print_barcode',function(){
											if(Ext.getCmp('INV_RCV_VENDOR.input.tableOption')._get('gin',a.line).getValue()!==''){
												Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
													msg :'Apakah akan cetak Barcode?',
													allow : 'INV_RCV_VENDOR.barcode',
													onY : function() {
														Ext.Ajax.request({
															url : url + 'cmd?m=INV_RCV_VENDOR&f=printBarcode',
															method : 'POST',
															params:{i:Ext.getCmp('INV_RCV_VENDOR.input.tableOption')._get('gin',a.line).getValue()},
															success : function(response) {
																var r = ajaxSuccess(response);
																if (r.r == 'S') {
																	if(_var.DIRECT_PRINT_ws != undefined){
																		_var.DIRECT_PRINT_ws.send(JSON.stringify(r.d));
																	}else{
																		Ext.create('IToast').toast({msg : 'Socket Print tidak Aktif/ Tidak ada.',type : 'warning'});
																	}
																}
															},
															failure : function(jqXHR, exception) {
																ajaxError(jqXHR, exception,true);
															}
														});
													}
												});
											}else{
												Ext.create('IToast').toast({msg : 'Gin Tidak Tersedia.',type : 'warning'});
											}
										})
									}
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'idropdown',
									name:'sat',
									tabIndex:-1,
									submit:'INV_RCV_VENDOR.input.panel',
									text:'Satuan',
									listeners:{
										select:function(a,b,c){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											if(table.loadQuery==true){
												table._get('fraction',a.line)._setValue(b[0].raw.f1);
												table.countLine(a.line);
												table.count();
											}
										}
									},
									allowBlank: false,
									width:100,
									emptyText:'Satuan',
								},{
									xtype:'idatefield',
									name:'expired',
									submit:'INV_RCV_VENDOR.input.panel',
									text:'Expired',
									allowBlank: false,
									emptyText:'Expired',
									width: 90,
								},{
									xtype:'itextfield',
									name:'batch',
									submit:'INV_RCV_VENDOR.input.panel',
									text:'Batch',
									value:getSetting('INV_RCV_VENDOR','DEFAULT_BATCH'),
									width:120,
									allowBlank: false,
									emptyText:'Batch',
								},{
									xtype:'inumberfield',
									name:'qty',
									submit:'INV_RCV_VENDOR.input.panel',
									align:'right',
									text:'Qty',
									allowBlank: false,
									emptyText:'Qty',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'fraction',
									text:'Frac',
									tabIndex:-1,
									submit:'INV_RCV_VENDOR.input.panel',
									align:'right',
									app:{decimal:0},
									allowBlank: false,
									emptyText:'Frac',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'jumlah_qty',
									text:'Jumlah',
									submit:'INV_RCV_VENDOR.input.panel',
									align:'right',
									readOnly:true,
									tabIndex:-1,
									app:{decimal:0},
									emptyText:'Jumlah',
									width: 40,
								},{
									xtype:'itextfield',
									name:'sat_kecil',
									text:'Sat. Kecil',
									readOnly:true,
									submit:'INV_RCV_VENDOR.input.panel',
									tabIndex:-1,
									allowBlank: false,
									width:100,
									emptyText:'Sat. Kecil',
								},{
									xtype:'inumberfield',
									name:'harga_beli',
									text:'Harga Beli',
									submit:'INV_RCV_VENDOR.input.panel',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									align:'right',
									app:{type:'CURRENCY',decimal:2},
									allowBlank: false,
									emptyText:'Harga Beli',
									width: 120,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
								},{
									xtype:'ihiddenfield',
									name:'jumlah_harga',
									value:0
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									name:'discount',
									align:'right',
									submit:'INV_RCV_VENDOR.input.panel',
									text:'Dis %',
									allowBlank: false,
									app:{decimal:2},
									emptyText:'Disc %',
									width: 40,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									name:'discount_rp',
									align:'right',
									submit:'INV_RCV_VENDOR.input.panel',
									text:'Discount Rp',
									allowBlank: false,
									app:{type:'CURRENCY',decimal:2},
									emptyText:'Discount Rp',
									width: 100,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
								},{
									xtype:'ihiddenfield',
									name:'jumlah_diskon',
									value:0
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									name:'ppn',
									align:'right',
									submit:'INV_RCV_VENDOR.input.panel',
									text:'PPN',
									allowBlank: false,
									app:{decimal:2},
									value:getSetting('INV_RCV_VENDOR','PPN'),
									emptyText:'PPN %',
									width: 40,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
								},{
									xtype:'ihiddenfield',
									name:'jumlah_ppn',
									value:0
								},{
									xtype:'ihiddenfield',
									name:'harga_dasar',
									value:0
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									name:'jumlah',
									align:'right',
									submit:'INV_RCV_VENDOR.input.panel',
									tabIndex: -1,
									text:'Jumlah Rp',
									readOnly:true,
									app:{type:'CURRENCY',decimal:2},
									emptyText:'Jumlah Rp',
									width: 120,
								},{
									xtype:'ihiddenfield',
									name:'expire_flag',
									value:0
								}
							]
						},{
							xtype:'form',
							layout:'column',
							border:false,
							cls:'i-transparent',
							items:[
								{
									xtype:'inumberfield',
									id : 'INV_RCV_VENDOR.input.materai',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									width: 150,
									listeners:{
										blur:function(){
											var table=Ext.getCmp('INV_RCV_VENDOR.input.tableOption');
											table.count();
										}
									},
									fieldLabel:'Materai',
									submit:'INV_RCV_VENDOR.input.panel',
									labelWidth: 50,
									name : 'materai',
									app:{type:'CURRENCY',decimal:0},
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									id : 'INV_RCV_VENDOR.input.sub_total',
									width: 190,
									labelWidth: 70,
									readOnly:true,
									tabIndex: -1,
									name : 'all_jumlah',
									fieldLabel:'Sub Total',
									app:{type:'CURRENCY',decimal:2},
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									id : 'INV_RCV_VENDOR.input.discount',
									width: 170,
									labelWidth: 50,
									fieldLabel:'Diskon',
									readOnly:true,
									tabIndex: -1,
									name : 'all_diskon',
									app:{type:'CURRENCY',decimal:2},
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									id : 'INV_RCV_VENDOR.input.ppn',
									width: 170,
									labelWidth: 50,
									fieldLabel:'PPN',
									readOnly:true,
									tabIndex: -1,
									name : 'all_ppn',
									app:{type:'CURRENCY',decimal:2},
								},{
									xtype:'inumberfield',
									hidden:iif(_access('INV_RCV_VENDOR_INPUT_COST')==true,true,false),
									id : 'INV_RCV_VENDOR.input.total',
									width: 170,
									fieldLabel:'Total',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'total',
									app:{type:'CURRENCY',decimal:2},
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_RCV_VENDOR.input.panel').qGetForm() == false)
					Ext.getCmp('INV_RCV_VENDOR.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_RCV_VENDOR.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_RCV_VENDOR.confirm'}
	]
});