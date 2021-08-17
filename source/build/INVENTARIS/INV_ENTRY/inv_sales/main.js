/*
	import cmp.ipanel
	import cmp.iinput
	import cmp.idatefield
	import cmp.iselect
	import cmp.ilistinput
	import cmp.iconfig
	import cmp.itable
	import cmp.ipayment
	import cmp.inumberfield
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_SALES.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_SALES.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_SALES.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('INV_SALES.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	xtype:'panel',
	id : 'INV_SALES.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_SALES.search',
			modal:false,
			title:'Penjualan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_SALES.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_SALES.search.f1').focus();
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
					iconCls:'fa fa-search',
					id:'INV_SALES.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_SALES.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_SALES.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_SALES.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_SALES.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_SALES.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Penjualan',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f1'
						},{
							xtype:'itextfield',
							name:'f7',
							fieldLabel:'No. Surat Jalan',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f7'
						},{
							xtype:'itextfield',
							name:'f14',
							fieldLabel:'Keterangan',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f14'
						},{
							xtype:'iinput',
							label : 'Tgl. Jual',
							items : [
								 {
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									press:{
										enter:function(){
											_click('INV_SALES.search.btnSearch');
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
											_click('INV_SALES.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Nama Partner',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f6'
						},{ 
							xtype:'idropdown',
							id : 'INV_SALES.search.f9',
							parameter:'ACTIVE_FLAG',
							name : 'f9',
							width: 200,
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								},
							},
							fieldLabel:'Lunas'
						},{ 
							xtype:'idropdown',
							id : 'INV_SALES.search.f10',
							parameter:'STAT_SEND',
							name : 'f10',
							width: 200,
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								},
							},
							fieldLabel:'Status'
						},{ 
							xtype:'idropdown',
							id : 'INV_SALES.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						},{
							xtype:'itextfield',
							name:'f11',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f11'
						},{
							xtype:'itextfield',
							name:'f12',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f12'
						},{
							xtype:'itextfield',
							name:'f13',
							fieldLabel:'Kode Gin',
							press:{
								enter:function(){
									_click('INV_SALES.search.btnSearch');
								}
							},
							id:'INV_SALES.search.f13'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_SALES.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_SALES.search.panel').qParams();
					arr['unit_id']=getSetting('INV_SALES','UNIT_ID');
					return arr;
				}else{
					var obj={};
					obj[Ext.getCmp('INV_SALES.dropdown').getValue()]=Ext.getCmp('INV_SALES.text').getValue();
					obj['unit_id']=getSetting('INV_SALES','UNIT_ID');
					return obj;
				}
			},
			url:url + 'cmd?m=INV_SALES&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('INV_SALES_DELETE',function(){
						Ext.getCmp('INV_SALES.confirm').confirm({
							msg : "Apakah akan menghapus No. Penjualan '"+a.f1+"'",
							allow : 'INV_SALES.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_SALES&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('INV_SALES.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_SALES.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_SALES.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_SALES.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_SALES_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_SALES&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_SALES.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('INV_SALES.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_SALES.input.tableOption');
									Ext.getCmp('INV_SALES.input.panel').qReset();
									table.resetTable();
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.trans_detail_id);
										table._get('barang',i).setValue({i:obj.item_id,name:obj.item_name});
										table._get('fraction',i).setValue(obj.fraction);
										table._get('qty',i)._setValue(obj.qty);
										table._get('qty_dist',i)._setValue(obj.qty_dist);
										table._get('qty_sisa',i)._setValue(obj.qty_sisa);
										table._get('sat_kecil',i).setValue(obj.measurement_name);
										table._get('sat_kecil_id',i).setValue(obj.measurement_id);
										table._get('gin',i).setValue(obj.gin_code);
										table._get('gin_id',i).setValue(obj.gin_id);
										table._get('harga',i)._setValue(obj.price);
										table._get('note',i).setValue(obj.note);
										table.countLine(i);
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('qty',i).setReadOnly(true);
											table._get('qty_dist',i).setReadOnly(true);
											table._get('harga',i).setReadOnly(true);
											table._get('del',i).disable();
											table._getAddButton().disable();
										}
									}
									table.loadQuery=true;
									Ext.getCmp('INV_SALES.input.i').setValue(a.i);
									Ext.getCmp('INV_SALES.input.f1').setValue(a.f1);
									Ext.getCmp('INV_SALES.input.f2').setValue(a.f2);
									Ext.getCmp('INV_SALES.input.f3').setValue({i:o.partners_id,name:o.partners});
									Ext.getCmp('INV_SALES.input.f4').setValue(o.description);
									Ext.getCmp('INV_SALES.input.f5').setValue(o.due_date);
									Ext.getCmp('INV_SALES.input.f6').setValue(o.sp_date);
									Ext.getCmp('INV_SALES.input.f7').setValue(o.sp_number);
									Ext.getCmp('INV_SALES.input.f8').setValue(o.sj_number);
									// Ext.getCmp('INV_SALES.input.f9').setValue(o.status);
									if(o.posted ==0){
										Ext.getCmp('INV_SALES.input.payment').hide();
										// Ext.getCmp('INV_SALES.input.btnSave').enable();
										Ext.getCmp('INV_SALES.input.btnPrintSJ').disable();
										Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-check fa-green');
										Ext.getCmp('INV_SALES.input.btnPosting').setText('Posting');
										Ext.getCmp('INV_SALES.input.f2').setReadOnly(false);
										Ext.getCmp('INV_SALES.input.f3').setReadOnly(false);
										Ext.getCmp('INV_SALES.input.f4').setReadOnly(false);
										Ext.getCmp('INV_SALES.input.f5').setReadOnly(false);
										Ext.getCmp('INV_SALES.input.f6').setReadOnly(false);
										Ext.getCmp('INV_SALES.input.f7').setReadOnly(false);
									}else{
										Ext.getCmp('INV_SALES.input.payment').show();
										// Ext.getCmp('INV_SALES.input.btnSave').disable();
										Ext.getCmp('INV_SALES.input.btnPrintSJ').enable();
										Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-close fa-red');
										Ext.getCmp('INV_SALES.input.btnPosting').setText('Unposting');
										Ext.getCmp('INV_SALES.input.f2').setReadOnly(true);
										Ext.getCmp('INV_SALES.input.f3').setReadOnly(true);
										Ext.getCmp('INV_SALES.input.f4').setReadOnly(true);
										Ext.getCmp('INV_SALES.input.f5').setReadOnly(true);
										Ext.getCmp('INV_SALES.input.f6').setReadOnly(true);
										Ext.getCmp('INV_SALES.input.f7').setReadOnly(true);
									}
									table.count();
									Ext.getCmp('INV_SALES.list').hide();
									Ext.getCmp('INV_SALES.input').show();
									Ext.getCmp('INV_SALES.input.payment').clear();
									if(o.payment_id != null){
										Ext.getCmp('INV_SALES.input.payment').payment_id=o.payment_id;
										Ext.getCmp('INV_SALES.input.payment').refresh();
									}
									Ext.getCmp('INV_SALES.input.f2').focus();
									Ext.getCmp('INV_SALES.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_SALES.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_SALES.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_SALES.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Penjualan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},
				{
					xtype:'iconfig',
					id:'INV_SALES.config',
					code:[
						iif(_access('INV_SALES_config_SEQUENCE_CODE_DIST')==false,'SEQUENCE_CODE_DIST',null),
						iif(_access('INV_SALES_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
						iif(_access('INV_SALES_config_KWITANSI_PREVIEW')==false,'KWITANSI_PREVIEW',null),
						iif(_access('INV_SALES_config_FAKTUR_PREVIEW')==false,'FAKTUR_PREVIEW',null),
						iif(_access('INV_SALES_config_UNIT_ID')==false,'UNIT_ID',null),
						iif(_access('INV_SALES_config_FAKTUR_NOTE_FOOT')==false,'FAKTUR_NOTE_FOOT',null),
						iif(_access('INV_SALES_config_SJ_NOTE_FOOT')==false,'SJ_NOTE_FOOT',null),
						iif(_access('INV_SALES_config_SJ_PREVIEW')==false,'SJ_PREVIEW',null),
						iif(_access('INV_SALES_config_DEFAULT_SEND_BY')==false,'DEFAULT_SEND_BY',null),
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'INV_SALES.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						var table=Ext.getCmp('INV_SALES.input.tableOption');
						table._getAddButton().enable();
						Ext.getCmp('INV_SALES.input.panel').qReset();
						table.resetTable();
						Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-check fa-green');
						Ext.getCmp('INV_SALES.input.btnPosting').setText('Posting');
						Ext.getCmp('INV_SALES.input.btnPrintSJ').disable();
						Ext.getCmp('INV_SALES.input.f2').setReadOnly(false);
						Ext.getCmp('INV_SALES.input.f3').setReadOnly(false);
						Ext.getCmp('INV_SALES.input.f4').setReadOnly(false);
						Ext.getCmp('INV_SALES.input.f5').setReadOnly(false);
						Ext.getCmp('INV_SALES.input.f6').setReadOnly(false);
						Ext.getCmp('INV_SALES.input.f7').setReadOnly(false);
						Ext.getCmp('INV_SALES.input.payment').hide();
						Ext.getCmp('INV_SALES.list').hide();
						Ext.getCmp('INV_SALES.input').show();
						Ext.getCmp('INV_SALES.input.payment').clear();
						Ext.getCmp('INV_SALES.input.f2').focus();
						Ext.getCmp('INV_SALES.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'INV_SALES.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'idropdown',
							id : 'INV_SALES.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f1',text:'No. Penjualan'},
								{id:'f7',text:'No. Surat Jalan'},
								{id:'f6',text:'Nama Partner'},
								{id:'f11',text:'Kode Barang'},
								{id:'f12',text:'Nama Barang'},
								{id:'f13',text:'Kode Gin'},
								{id:'f14',text:'Keterangan'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('INV_SALES.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'INV_SALES.text',
							press:{
								enter:function(){
									_click('INV_SALES.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'INV_SALES.btnSearch',
							handler : function(a) {
								Ext.getCmp('INV_SALES.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_SALES.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('INV_SALES.search').show();
						Ext.getCmp('INV_SALES.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'No. Penjualan',width: 120,align:'center', dataIndex: 'f1' },
				{ text:'No. S. Jalan',width: 120,align:'center', dataIndex: 'f7',hidden:iif(_access('INV_SALES_sj')==true,true,false) },
				{ text: 'Tgl. Jual',width: 100,align:'center',dataIndex: 'f2'},
				{ text: 'Partner',flex: 1,dataIndex: 'f4' },
				{ text: 'Keterangan',width: 200,dataIndex: 'f3'},
				{ text: 'Status',width: 80,dataIndex: 'f10'},
				{ text: 'Posting',width: 50,sortable :false,dataIndex: 'f5',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="fa fa-check fa-green"></span>';
						return '<span class="fa fa-close fa-red"></span>';
					}
				},{ text: 'Lunas',width: 50,sortable :false,dataIndex: 'f6',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="fa fa-check fa-green"></span>';
						return '<span class="fa fa-close fa-red"></span>';
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_SALES.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_SALES.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'INV_SALES.input',
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
									_click('INV_SALES.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_SALES.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('INV_SALES.input.btnNew');
								}
							},{
								key:'f7',
								fn:function(){
									_click('INV_SALES.input.btnPosting');
								}
							},{
								key:'f8',
								fn:function(){
									_click('INV_SALES.input.btnPay');
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
					id:'INV_SALES.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('INV_SALES.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('INV_SALES.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'INV_SALES.close',
								onY : function() {
									Ext.getCmp('INV_SALES.input').hide();
									Ext.getCmp('INV_SALES.list').show();
								}
							});
						}else{
							Ext.getCmp('INV_SALES.input').hide();
							Ext.getCmp('INV_SALES.list').show();
						}
					}
				},'->','<b>Input Penjualan</b>','->',
				{
					xtype:'buttongroup',
					items:[
						{
							text: 'New',
							tooltip:'New <b>[F6]</b>',
							id:'INV_SALES.input.btnNew',
							iconCls:'fa fa-file',
							handler: function() {
								var $this = this;
								$this.closing = false;
								if (Ext.getCmp('INV_SALES.input.panel').qGetForm() == false)
									Ext.getCmp('INV_SALES.confirm').confirm({
										msg :'Apakah akan mengabaikan data yang sudah diubah?',
										allow : 'INV_SALES.close',
										onY : function() {
											var table=Ext.getCmp('INV_SALES.input.tableOption');
											table._getAddButton().enable();
											Ext.getCmp('INV_SALES.input.payment').hide();
											Ext.getCmp('INV_SALES.input.panel').qReset();
											table.resetTable();
											Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-check fa-green');
											Ext.getCmp('INV_SALES.input.btnPosting').setText('Posting');
											Ext.getCmp('INV_SALES.input.btnPrintSJ').disable();
											Ext.getCmp('INV_SALES.input.f2').setReadOnly(false);
											Ext.getCmp('INV_SALES.input.f3').setReadOnly(false);
											Ext.getCmp('INV_SALES.input.f4').setReadOnly(false);
											Ext.getCmp('INV_SALES.input.f5').setReadOnly(false);
											Ext.getCmp('INV_SALES.input.f6').setReadOnly(false);
											Ext.getCmp('INV_SALES.input.f7').setReadOnly(false);
											
											Ext.getCmp('INV_SALES.input.payment').clear();
											Ext.getCmp('INV_SALES.input.panel').qSetForm();
											Ext.getCmp('INV_SALES.input.f2').focus();
										}
									});
								else{
									Ext.getCmp('INV_SALES.input.panel').qReset();
									Ext.getCmp('INV_SALES.input.payment').hide();
									Ext.getCmp('INV_SALES.input.tableOption').resetTable();
									Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-check fa-green');
									Ext.getCmp('INV_SALES.input.btnPosting').setText('Posting');
									Ext.getCmp('INV_SALES.input.btnPrintSJ').disable();
									Ext.getCmp('INV_SALES.input.f2').setReadOnly(false);
									Ext.getCmp('INV_SALES.input.f3').setReadOnly(false);
									Ext.getCmp('INV_SALES.input.f4').setReadOnly(false);
									Ext.getCmp('INV_SALES.input.f5').setReadOnly(false);
									Ext.getCmp('INV_SALES.input.f6').setReadOnly(false);
									Ext.getCmp('INV_SALES.input.f7').setReadOnly(false);
									
									Ext.getCmp('INV_SALES.input.payment').clear();
									Ext.getCmp('INV_SALES.input.panel').qSetForm();
									Ext.getCmp('INV_SALES.input.f2').focus();
								}
								return false;
							}
						},{
							text: 'Simpan',
							tooltip:'Simpan <b>[Ctrl+s]</b>',
							id:'INV_SALES.input.btnSave',
							iconCls:'fa fa-save fa-green',
							handler: function() {
								var req=Ext.getCmp('INV_SALES.input.panel').qGetForm(true);
								if(req == false){
									var error=false;
									var table=Ext.getCmp('INV_SALES.input.tableOption');
									var objCek={};
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(table._get('qty',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
											table._get('qty',i).focus();
											return false;
										}
										if(objCek[table._get('gin',i).getValue()]== undefined){
											objCek[table._get('gin',i).getValue()]='ADA';
										}else{
											Ext.create('IToast').toast({msg : 'Gin Tidak Boleh Sama.',type : 'warning'});
											table._get('barang',i).focus();
											return false;
										}
									}
									Ext.getCmp('INV_SALES.confirm').confirm({
										msg : 'Apakah akan menyimpan data ini?',
										allow : 'INV_SALES.save',
										onY : function() {
											var param = Ext.getCmp('INV_SALES.input.panel').qParams();
											param['unit_id']=getSetting('INV_SALES','UNIT_ID');
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_SALES&f=save',
												method : 'POST',
												params:param,
												before:function(){
													Ext.getCmp('INV_SALES.input').setLoading(true);
												},
												success : function(response) {
													Ext.getCmp('INV_SALES.input').setLoading(false);
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
														Ext.getCmp('INV_SALES.input.i').setValue(r.d.id);
														Ext.getCmp('INV_SALES.input.f1').setValue(r.d.code);
														Ext.getCmp('INV_SALES.input.f8').setValue(r.d.sj);
														Ext.getCmp('INV_SALES.list').refresh();
														Ext.getCmp('INV_SALES.input.f2').focus();
														Ext.getCmp('INV_SALES.input.panel').qSetForm();
													}
												},
												failure : function(jqXHR, exception) {
													Ext.getCmp('INV_SALES.input').setLoading(false);
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								}else if(req==true)
									Ext.getCmp('INV_SALES.input').qClose();
							}
						},{
							text: 'Posting',
							tooltip:'Posting/UnPosting <b>[F7]</b>',
							id:'INV_SALES.input.btnPosting',
							iconCls:'fa fa-check fa-green',
							handler: function(a) {
								var table=Ext.getCmp('INV_SALES.input.tableOption');
								if(a.getText()=='Posting'){
									_access('INV_SALES_posting',function(){
										if(Ext.getCmp('INV_SALES.input.c').getValue()==''){
											Ext.getCmp('INV_SALES.input.c').setValue('Y');
										}else{
											Ext.getCmp('INV_SALES.input.c').setValue('');
										}
										var req=Ext.getCmp('INV_SALES.input.panel').qGetForm(true);
										if(req == false){
											var error=false;
											var table=Ext.getCmp('INV_SALES.input.tableOption');
											var objCek={};
											for(var i=0,iLen=table._getTotal();i<iLen;i++){
												if(table._get('qty',i)._getValue()==0){
													Ext.create('IToast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
													table._get('qty',i).focus();
													return false;
												}
												if(objCek[table._get('gin',i).getValue()]== undefined){
													objCek[table._get('gin',i).getValue()]='ADA';
												}else{
													Ext.create('IToast').toast({msg : 'Gin Tidak Boleh Sama.',type : 'warning'});
													table._get('barang',i).focus();
													return false;
												}
											}
											Ext.getCmp('INV_SALES.confirm').confirm({
												msg : 'Apakah akan di Posting?',
												allow : 'INV_SALES.posting',
												onY : function() {
													var param = Ext.getCmp('INV_SALES.input.panel').qParams();
													param['unit_id']=getSetting('INV_SALES','UNIT_ID');
													Ext.Ajax.request({
														url : url + 'cmd?m=INV_SALES&f=posting',
														method : 'POST',
														params:param,
														before:function(){
															Ext.getCmp('INV_SALES.input').setLoading(true);
														},
														success : function(response) {
															Ext.getCmp('INV_SALES.input').setLoading(false);
															var r = ajaxSuccess(response);
															var table=Ext.getCmp('INV_SALES.input.tableOption');
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
																var table=Ext.getCmp('INV_SALES.input.tableOption');
																for(var i=0, iLen=table._getTotal(); i<iLen;i++){
																	table._get('barang',i).setReadOnly(true);
																	table._get('qty',i).setReadOnly(true);
																	table._get('qty_dist',i).setReadOnly(true);
																	table._get('harga',i).setReadOnly(true);
																	table._get('del',i).disable();
																}
																table._getAddButton().disable();
																Ext.getCmp('INV_SALES.input.payment').show();
																Ext.getCmp('INV_SALES.input.i').setValue(r.d.id);
																Ext.getCmp('INV_SALES.input.f1').setValue(r.d.code);
																Ext.getCmp('INV_SALES.input.f8').setValue(r.d.sj);
																Ext.getCmp('INV_SALES.list').refresh();
																Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-close fa-red');
																Ext.getCmp('INV_SALES.input.btnPosting').setText('Unposting');
																Ext.getCmp('INV_SALES.input.btnPrintSJ').enable();
																Ext.getCmp('INV_SALES.input.f2').setReadOnly(true);
																Ext.getCmp('INV_SALES.input.f3').setReadOnly(true);
																Ext.getCmp('INV_SALES.input.f4').setReadOnly(true);
																Ext.getCmp('INV_SALES.input.f5').setReadOnly(true);
																Ext.getCmp('INV_SALES.input.f6').setReadOnly(true);
																Ext.getCmp('INV_SALES.input.f7').setReadOnly(true);
																Ext.getCmp('INV_SALES.input.payment').payment_id=r.d.payment_id;
																Ext.getCmp('INV_SALES.input.payment').refresh();
																Ext.getCmp('INV_SALES.input.f2').focus();
																Ext.getCmp('INV_SALES.input.panel').qSetForm();
															}
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('INV_SALES.input').setLoading(false);
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											});
										}else if(req==true){
											Ext.getCmp('INV_SALES.input').qClose();
										}
									});
								}else{
									_access('INV_SALES_unposting',function(){
										Ext.getCmp('INV_SALES.confirm').confirm({
											msg : 'Apakah akan di UnPosting?',
											allow : 'INV_SALES.posting',
											onY : function() {
												Ext.Ajax.request({
													url : url + 'cmd?m=INV_SALES&f=unposting',
													method : 'POST',
													params:{i:Ext.getCmp('INV_SALES.input.i').getValue()},
													before:function(){
														Ext.getCmp('INV_SALES.input').setLoading(true);
													},
													success : function(response) {
														Ext.getCmp('INV_SALES.input').setLoading(false);
														var r = ajaxSuccess(response);
														if (r.r == 'S') {
															var table=Ext.getCmp('INV_SALES.input.tableOption');
															for(var i=0, iLen=table._getTotal(); i<iLen;i++){
																table._get('barang',i).setReadOnly(false);
																table._get('qty',i).setReadOnly(false);
																table._get('qty_dist',i).setReadOnly(false);
																table._get('harga',i).setReadOnly(false);
																table._get('del',i).enable();
															}
															table._getAddButton().enable();
															Ext.getCmp('INV_SALES.list').refresh();
															Ext.getCmp('INV_SALES.input.payment').hide();
															// Ext.getCmp('INV_SALES.input.btnSave').enable();
															Ext.getCmp('INV_SALES.input.btnPrintSJ').disable();
															Ext.getCmp('INV_SALES.input.btnPosting').setIconCls('fa fa-check fa-green');
															Ext.getCmp('INV_SALES.input.btnPosting').setText('Posting');
															Ext.getCmp('INV_SALES.input.f2').setReadOnly(false);
															Ext.getCmp('INV_SALES.input.f3').setReadOnly(false);
															Ext.getCmp('INV_SALES.input.f4').setReadOnly(false);
															Ext.getCmp('INV_SALES.input.f5').setReadOnly(false);
															Ext.getCmp('INV_SALES.input.f6').setReadOnly(false);
															Ext.getCmp('INV_SALES.input.f7').setReadOnly(false);
															
															Ext.getCmp('INV_SALES.input.f2').focus();
															Ext.getCmp('INV_SALES.input.payment').refresh();
															Ext.getCmp('INV_SALES.input.panel').qSetForm();
														}
													},
													failure : function(jqXHR, exception) {
														Ext.getCmp('INV_SALES.input').setLoading(false);
														ajaxError(jqXHR, exception,true);
													}
												});
											}
										});
									});
								}
							}
						},{
							text:'Bayar',
							id:'INV_SALES.input.btnPay',
							tooltip:'Posting/UnPosting <b>[F8]</b>',
							iconCls:'fa fa-money fa-red',
							handler:function(){
								_access('INV_SALES_bayar',function(){
									if(Ext.getCmp('INV_SALES.input.payment').lunas !=1){
										Ext.getCmp('INV_SALES.input.payment').payment_code=Ext.getCmp('INV_SALES.input.f1').getValue();
										Ext.getCmp('INV_SALES.input.payment').pay();
									}else{
										Ext.create('IToast').toast({msg : 'Penjualan Sudah Lunas.',type : 'warning'});
									}
								});
							}
						},{
							text:'Print',
							iconCls:'fa fa-print',
							menu:{
								xtype:'menu',
								items:[
									{
										text:'Surat Jalan',
										id:'INV_SALES.input.btnPrintSJ',
										handler:function(){
											_access('INV_SALES_print_sj',function(){
												Ext.getCmp('INV_SALES.confirm').confirm({
													msg :'Apakah akan cetak Surat Jalan?',
													allow : 'INV_SALES.close',
													onY : function() {
														Ext.Ajax.request({
															url : url + 'cmd?m=INV_SALES&f=printSj',
															method : 'POST',
															params:{i:Ext.getCmp('INV_SALES.input.i').getValue()},
															success : function(response) {
																var r = ajaxSuccess(response);
																if (r.r == 'S') {
																}
															},
															failure : function(jqXHR, exception) {
																ajaxError(jqXHR, exception,true);
															}
														});
													}
												});
											})
										}
									}
								]
							}
						}
					]
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_SALES.input.panel',
					submit:'INV_SALES.input.btnSave',
					paddingBottom:false,
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
									id:'INV_SALES.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'INV_SALES.input.c'
								},{
									xtype:'itextfield',
									id : 'INV_SALES.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Jual'
								},{
									xtype:'itextfield',
									id : 'INV_SALES.input.f8',
									labelAlign:'top',
									submit:'INV_SALES.input.panel',
									hidden:iif(_access('INV_SALES_sj')==true,true,false),
									width: 100,
									readOnly:true,
									name : 'f8',
									fieldLabel:'No. S.Jalan'
								},{
									xtype:'idatefield',
									id : 'INV_SALES.input.f2',
									value:new Date(),
									submit:'INV_SALES.input.panel',
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Jual'
								},{
									xtype:'idatefield',
									id : 'INV_SALES.input.f5',
									value:new Date(),
									submit:'INV_SALES.input.panel',
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f5',
									fieldLabel:'Jatuh Tempo'
								},{
									xtype:'idatefield',
									id : 'INV_SALES.input.f6',
									value:new Date(),
									submit:'INV_SALES.input.panel',
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f6',
									fieldLabel:'Tgl. SP'
								},,{
									xtype:'itextfield',
									id : 'INV_SALES.input.f7',
									width: 150,
									submit:'INV_SALES.input.panel',
									labelAlign:'top',
									allowBlank : false,
									name : 'f7',
									fieldLabel:'No. SP'
								},{
									xtype:'iselect',
									fieldLabel:'Partners',
									labelAlign:'top',
									width: 200,
									submit:'INV_SALES.input.panel',
									id:'INV_SALES.input.f3',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'f3',
									button:{
										urlData:url + 'cmd?m=INV_SALES&f=getListPartners',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Partner',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Partner',
											},{
												xtype:'idropdown',
												name : 'f3',
												fieldLabel:'Jenis Partner',
												query:"SELECT partners_type_id AS id,CONCAT(partners_type_code,' - ',partners_type_name) AS text FROM inv_partners_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY partners_type_code ASC",
											},{
												xtype:'itextfield',
												name:'f14',
												fieldLabel:'No. PAK',
											},{
												xtype:'itextfield',
												name:'f4',
												fieldLabel:'PIC',
											},{
												name:'f5',
												xtype:'itextfield',
												fieldLabel:'Email',
											},{
												name:'f15',
												xtype:'itextfield',
												fieldLabel:'Telepon',
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
											},{
												xtype:'itextfield',
												name:'f10',
												fieldLabel:'Kecamatan',
											},{
												xtype:'itextfield',
												name:'f11',
												fieldLabel:'Kelurahan',
											},{
												xtype:'idropdown',
												id : 'INV_SALES.input.f4.f12',
												parameter:'ACTIVE_FLAG',
												name : 'f12',
												fieldLabel:'Perizinan'
											},{
												xtype:'idropdown',
												parameter:'ACTIVE_FLAG',
												name : 'f13',
												width: 200,
												fieldLabel: 'Aktif'
											}
										],
										columns:[
											{ hidden:true,dataIndex: 'i'},
											{ text: 'Partner',width: 200, dataIndex: 'name'  },
											{ text: 'Jenis Partner',width: 200,dataIndex: 'type' },
											{ text: 'Email',width: 150, dataIndex:'email'},
											{ text: 'Alamat',flex:1, dataIndex: 'address' },
											{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
												renderer: function(value){
													if(value==true)
														return '<span class="fa fa-check"></span>';
													return '<span class="fa fa-close"></span>';
												}
											}
										]
									}
								},{
									xtype:'itextfield',
									id : 'INV_SALES.input.f4',
									labelAlign:'top',
									maxLength:128,
									submit:'INV_SALES.input.panel',
									name : 'f4',
									width: 150,
									fieldLabel:'Keterangan'
								},
								// {
									// xtype:'idropdown',
									// id : 'INV_SALES.input.f9',
									// labelAlign:'top',
									// allowBlank : false,
									// name : 'f9',
									// parameter:'STAT_SEND',
									// value:getSetting('INV_SALES','DEFAULT_STATUS'),
									// width: 100,
									// fieldLabel:'Status'
								// }	
							]
						},{
							xtype:'ilistinput',
							id:'INV_SALES.input.tableOption',
							name:'options',
							flex:3,
							bodyStyle:'margin-left: -1px;margin-right: -1px;',
							margin:false,
							loadQuery:true,
							onRemove:function(){
								var table=Ext.getCmp('INV_SALES.input.tableOption');
								table.count();
							},
							countLine:function(line){
								var table=Ext.getCmp('INV_SALES.input.tableOption');
								var jumlahQty=parseFloat(table._get('harga',line)._getValue())* parseFloat(table._get('qty',line)._getValue());
								table._get('jumlah',line)._setValue(jumlahQty);
							},
							count:function(){
								var table=Ext.getCmp('INV_SALES.input.tableOption');
								var jumlahHarga=0;
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									jumlahHarga+=parseFloat(table._get('jumlah',i)._getValue());
								}
								Ext.getCmp('INV_SALES.input.total')._setValue(jumlahHarga);
							},
							items:[
								{
									xtype:'iselect',
									width: 250,
									text:'Barang',
									emptyText:'Barang',
									submit:'INV_SALES.input.panel',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'barang',
									onReset:function(a){
										var table=Ext.getCmp('INV_SALES.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
										table.countLine(a.line);
										table.count();
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_SALES.input.tableOption');
										
										if(table.loadQuery==true){
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_SALES&f=getInitItem',
												method : 'GET',
												params : {
													i : a.i
												},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S'){
														var o=r.d.o,table=Ext.getCmp('INV_SALES.input.tableOption');
														if(a.harga==null){
															a.harga=0;
														}
														table._get('harga',b.line)._setValue(a.harga);
														table._get('qty',b.line)._setValue(1);
														table._get('qty_dist',b.line)._setValue(1);
														table._get('qty_sisa',b.line)._setValue(a.stock);
														table._get('gin',b.line).setValue(a.gin);
														table._get('fraction',b.line).setValue(a.frac);
														table._get('gin_id',b.line).setValue(a.gin_id);
														table._get('sat_kecil',b.line).setValue(o.f2);
														table._get('sat_kecil_id',b.line).setValue(o.f1);
														table.countLine(b.line);
														table.count();
													}
												},
												failure : function(jqXHR, exception) {
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									},onBeforeShow:function(){
										Ext.getCmp('INV_SALES.input.item.unit_id').setValue(getSetting('INV_SALES','UNIT_ID'));
										Ext.getCmp('INV_SALES.input.item.partners_id').setValue(Ext.getCmp('INV_SALES.input.f3').getValue());
									},
									button:{
										urlData : url + 'cmd?m=INV_SALES&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'ihiddenfield',
												name:'unit_id',
												id:'INV_SALES.input.item.unit_id',
											},{
												xtype:'ihiddenfield',
												name:'partners_id',
												id:'INV_SALES.input.item.partners_id',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Barang',
											},{
												xtype:'itextfield',
												name:'f3',
												fieldLabel:'Deskripsi',
											},{
												xtype:'itextfield',
												name:'f6',
												fieldLabel:'Gin Code',
											},{
												xtype:'itextfield',
												name:'f7',
												fieldLabel:'Bacth',
											},{
												xtype:'idropdown',
												fieldLabel:'Jenis Barang',
												parameter:'ITEM_TYPE',
												name : 'f4',
											},{
												xtype:'idropdown',
												parameter:'ACTIVE_FLAG',
												name : 'f5',
												width: 200,
												fieldLabel: 'Active'
											}
										],
										columns:[
											{ hidden:true,dataIndex: 'i'},
											{ hidden:true,dataIndex: 'gin_id'},
											{ hidden:true,dataIndex: 'frac'},
											{ text: 'Tgl. Expire',width: 80, dataIndex: 'expire'},
											{ text: 'Tgl. Terima',width: 80, dataIndex: 'tgl'},
											{ text: 'Kode Gin',width: 100, dataIndex: 'gin'},
											{ text: 'No. Terima',width: 100, dataIndex: 'terima'},
											{ text: 'Barang',flex:1, dataIndex: 'name'},
											{ text: 'Stok',width: 100, dataIndex:'stock',align:'right',
												renderer: function(value,a){
													return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_s;
												}
											},{ text: 'Harga',width: 100, dataIndex:'harga',align:'right',
												renderer: function(value){
													return Number(value).toLocaleString(window.navigator.language,{style: 'currency', currency: 'IDR',minimumFractionDigits:2 });;
												}
											},{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
												renderer: function(value){
													if(value==true)
														return '<span class="fa fa-check"></span>';
													return '<span class="fa fa-close"></span>';
												}
											}
										]
									}
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'ihiddenfield',
									name:'fraction',
									value:0,
								},{
									xtype:'itextfield',
									name:'gin',
									text:'Kode Gin',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:120,
									emptyText:'Gin',
								},{
									xtype:'ihiddenfield',
									name:'gin_id'
								},{
									xtype:'itextfield',
									name:'sat_kecil',
									text:'Satuan',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:100,
									emptyText:'Satuan',
								},{
									xtype:'inumberfield',
									name:'qty_sisa',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Sisa',
									allowBlank: false,
									emptyText:'Sisa',
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty',
									submit:'INV_SALES.input.panel',
									align:'right',
									text:'Qty',
									allowBlank: false,
									emptyText:'Qty',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_SALES.input.tableOption');
											if(table._get('qty_sisa',a.line)._getValue()<a._getValue()){
												Ext.create('IToast').toast({msg : 'Qty Tidak Boleh Lebih dari '+table._get('qty_sisa',a.line)._getValue()+'.',type : 'warning'});
												table._get('qty',a.line).focus();
											}else{
												table._get('qty_dist',a.line)._setValue(a._getValue());
												table.countLine(a.line);
												table.count();
											}
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty_dist',
									align:'right',
									submit:'INV_SALES.input.panel',
									text:'Dist',
									allowBlank: false,
									emptyText:'Dist',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_SALES.input.tableOption');
											if(table._get('qty',a.line)._getValue()<a._getValue()){
												Ext.create('IToast').toast({msg : 'Qty Distribusi Tidak Boleh Lebih dari '+table._get('qty',a.line)._getValue()+'.',type : 'warning'});
												table._get('qty_dist',a.line).focus();
											}else{
												table.countLine(a.line);
												table.count();
											}
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'ihiddenfield',
									name:'sat_kecil_id'
								},{
									xtype:'inumberfield',
									name:'harga',
									text:'Harga ',
									submit:'INV_SALES.input.panel',
									align:'right',
									app:{type:'CURRENCY',decimal:2},
									allowBlank: false,
									emptyText:'Harga Beli',
									width: 120,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_SALES.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
								},{
									xtype:'inumberfield',
									name:'jumlah',
									align:'right',
									tabIndex: -1,
									text:'Jumlah Rp',
									readOnly:true,
									app:{type:'CURRENCY',decimal:2},
									emptyText:'Jumlah Rp',
									width: 120,
								},{
									xtype:'itextfield',
									name:'note',
									submit:'INV_SALES.input.panel',
									text:'Catatan',
									width:200,
									emptyText:'Catatan',
								}
							]
						},{
							xtype:'form',
							layout:'column',
							border:false,
							style:'margin-bottom: 4px;',
							cls:'i-transparent',
							items:[
								{
									xtype:'inumberfield',
									id : 'INV_SALES.input.total',
									width: 170,
									fieldLabel:'Total',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'total',
									app:{type:'CURRENCY',decimal:2},
								}
							]
						},{
							xtype:'ipayment',
							id:'INV_SALES.input.payment',
							flex:2,
							cekPartners:function(id){
								if(id!==Ext.getCmp('INV_SALES.input.f3').getValue()){
									return false;
								}else{
									return true;
								}
							},
							paddingBottom:false,
							urlFaktur:eval(getSetting('INV_SALES','FAKTUR_URL')),
							urlFakturFile:eval(getSetting('INV_SALES','FAKTUR_URL_REPORT')),
							urlKwitansi:eval(getSetting('INV_SALES','KWITANSI_URL')),
							urlKwitansiFile:eval(getSetting('INV_SALES','KWITANSI_URL_REPORT')),
							kwitansiPreview:getSetting('INV_SALES','KWITANSI_PREVIEW'),
							fakturPreview:getSetting('INV_SALES','FAKTUR_PREVIEW'),
							paddingBottom:false,
							initStatus:function(s){
								if(s==1){
									Ext.getCmp('INV_SALES.input.btnPay').disable();
								}else if(s==0){
									Ext.getCmp('INV_SALES.input.btnPay').enable();
								}else{
									Ext.getCmp('INV_SALES.input.btnPay').disable();
								}
							},
							beforeDelete:function(){
								var boleh=false;
								_access('INV_SALES_delete_payment',function(){
									boleh=true;
								});
								return boleh;
							},
							beforeDetail:function(){
								var boleh=false;
								_access('INV_SALES_view_payment',function(){
									boleh=true;
								});
								return boleh;
							},
							beforeFaktur:function(){
								var boleh=false;
								_access('INV_SALES_faktur',function(){
									boleh=true;
								});
								return boleh;
							},
							beforeKwitansi:function(){
								var boleh=false;
								_access('INV_SALES_kwitansi',function(){
									boleh=true;
								});
								return boleh;
							},
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_SALES.input.panel').qGetForm() == false)
					Ext.getCmp('INV_SALES.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_SALES.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_SALES.confirm'}
	]
});