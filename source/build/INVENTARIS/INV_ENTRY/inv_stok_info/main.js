/*
	import cmp.ipanel
	import cmp.idatefield
	import cmp.ilistinput
	import cmp.iconfig
	import cmp.itable
	import cmp.inumberfield
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_STOK_INFO.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_STOK_INFO.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_STOK_INFO.btnShowSearch');
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_STOK_INFO.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_STOK_INFO.search',
			modal:false,
			title:'Barang - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_STOK_INFO.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_STOK_INFO.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_STOK_INFO.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_STOK_INFO.search.f1').focus();
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
					id:'INV_STOK_INFO.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_STOK_INFO.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'INV_STOK_INFO.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_STOK_INFO.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_STOK_INFO.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_STOK_INFO.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_STOK_INFO.search.btnSearch');
								}
							},
							id:'INV_STOK_INFO.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_STOK_INFO.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_STOK_INFO.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_STOK_INFO.search.panel').qParams();
					return arr; 
				}else{
					var obj={};
					obj[Ext.getCmp('INV_STOK_INFO.dropdown').getValue()]=Ext.getCmp('INV_STOK_INFO.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_STOK_INFO&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				update:function(a){
					_access('INV_STOK_INFO_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_STOK_INFO&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_STOK_INFO.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('INV_STOK_INFO.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_STOK_INFO.input.tableOption');
									Ext.getCmp('INV_STOK_INFO.input.panel').qReset();
									table.resetTable();
									table._get('del',0).disable();
									table._get('price',0).setReadOnly(false);
									for(var i=0, iLen=l.length+1; i<iLen;i++){
										if(i!==0){
											table._add();
										}
										if(i!==0){
											var obj=l[i-1];
											table._get('gin',i).setValue(obj.f1);
											table._get('id',i).setValue(obj.i);
											table._get('tgl_terima',i).setValue(obj.f2);
											table._get('qty_sisa',i)._setValue(obj.f3);
											table._get('qty',i)._setValue(obj.f3);
											table._get('qty_b',i)._setValue(obj.f3/o.f2);
											table._get('price',i)._setValue(obj.f4);
											table._get('expired',i).setValue(obj.f5);
											table._get('batch',i).setValue(obj.f6);
											table._get('qty_val',i).setValue(0);
											table._get('del',i).disable();
										}else{
											table._get('tgl_terima',i).setValue(new Date());
											table._get('batch',i).setReadOnly(false);
											if(parseFloat(o.f4)==1){
												table._get('expired',i).setReadOnly(false);
											}
										}
									}
									table._getAddButton().disable();
									Ext.getCmp('INV_STOK_INFO.input.i').setValue(a.i);
									Ext.getCmp('INV_STOK_INFO.input.frac')._setValue(o.f2);
									Ext.getCmp('INV_STOK_INFO.input.total').setFieldLabel(o.f1);
									Ext.getCmp('INV_STOK_INFO.input.totalMea').setFieldLabel(o.f3);
									table.count();
									Ext.getCmp('INV_STOK_INFO.list').hide();
									Ext.getCmp('INV_STOK_INFO.input').show();
									Ext.getCmp('INV_STOK_INFO.input.title').setValue('<b>'+a.f1+' - '+a.f2+' ('+o.f1+')'+'</b>');
									Ext.getCmp('INV_STOK_INFO.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_STOK_INFO.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			tbar:[iif(_mobile,'<b>Stok Barang</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'INV_STOK_INFO.config',
					code:[
						iif(_access('INV_STOK_INFO_config_UNIT_ID')==false,'UNIT_ID',null),
						iif(_access('INV_STOK_INFO_config_SEQUENCE_GIN')==false,'SEQUENCE_GIN',null),
						iif(_access('INV_STOK_INFO_config_SEQUENCE_ADJUSMENT')==false,'SEQUENCE_ADJUSMENT',null),
					]
				},'->',
				{
					xtype:'buttongroup',
					id:'INV_STOK_INFO.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'idropdown',
							id : 'INV_STOK_INFO.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Barang'},
								{id:'f1',text:'Kode Barang'},
								{id:'f3',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('INV_STOK_INFO.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'INV_STOK_INFO.text',
							press:{
								enter:function(){
									_click('INV_STOK_INFO.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'INV_STOK_INFO.btnSearch',
							handler : function(a) {
								Ext.getCmp('INV_STOK_INFO.list').refresh(false);
							}
						},
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_STOK_INFO.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('INV_STOK_INFO.search').show();
						Ext.getCmp('INV_STOK_INFO.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,hideable:false,dataIndex: 'i' },
				{ text: 'Kode Barang',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Barang',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',flex: true,dataIndex: 'f3' },
				{ text: 'Satuan Beli',width: 120, dataIndex: 'f7' },
				{ text: 'Stok',width:140,dataIndex: 'f4',align:'right',
					renderer: function(value,a){
						return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.f6;
					} 
				},{ text: 'Stok Gin',width:140,dataIndex: 'f8',align:'right',
					renderer: function(value,a){
						return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.f6;
					} 
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_STOK_INFO.list').fn.update(record.data);
					}
				},{
					text: 'History',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-clipboard',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_STOK_INFO.list').hide();
						Ext.getCmp('INV_STOK_INFO.history').show();
						Ext.getCmp('INV_STOK_INFO.history.i').setValue(record.data.i);
						Ext.getCmp('INV_STOK_INFO.history.list').refresh();
						Ext.getCmp('INV_STOK_INFO.history.list2').refresh();
					}
				}
			]
		},{
			id:'INV_STOK_INFO.input',
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
									_click('INV_STOK_INFO.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_STOK_INFO.input.btnClose');
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
					id:'INV_STOK_INFO.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('INV_STOK_INFO.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('INV_STOK_INFO.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'INV_STOK_INFO.close',
								onY : function() {
									Ext.getCmp('INV_STOK_INFO.input').hide();
									Ext.getCmp('INV_STOK_INFO.list').show();
								}
							});
						}else{
							Ext.getCmp('INV_STOK_INFO.input').hide();
							Ext.getCmp('INV_STOK_INFO.list').show();
						}
					}
				},'->',{ xtype:'displayfield',value:'',id:'INV_STOK_INFO.input.title'},'->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'INV_STOK_INFO.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('INV_STOK_INFO.input.panel').qGetForm(true);
						if(req == false){
							var error=false;
							var table=Ext.getCmp('INV_STOK_INFO.input.tableOption');
							var objCek={};
							var ada=false;
							for(var i=0,iLen=table._getTotal();i<iLen;i++){
								if(table._get('qty_val',i)._getValue()!==0){
									ada=true;
								}
								
								if(i==0 && (table._get('expired',i).getValue()==null || table._get('expired',i).getValue()=='') && table._get('expired',i).readOnly===false && table._get('qty_val',i)._getValue()!==0){
									Ext.create('IToast').toast({msg : 'Harap Isi Expired.',type : 'warning'});
									table._get('expired',i).focus();
									return false;
								}
								if(i==0 && table._get('qty_val',i)._getValue()!==0 && table._get('price',i)._getValue()==0){
									Ext.create('IToast').toast({msg : 'Harga Tidak Boleh 0.',type : 'warning'});
									table._get('price',i).focus();
									return false;
								}
							}
							if(ada==false){
								Ext.create('IToast').toast({msg : 'Tidak Ada Barang yang di Adjusment.',type : 'warning'});
								return false;
							}
							Ext.getCmp('INV_STOK_INFO.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'INV_STOK_INFO.save',
								onY : function() {
									var param = Ext.getCmp('INV_STOK_INFO.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=INV_STOK_INFO&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('INV_STOK_INFO.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('INV_STOK_INFO.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('INV_STOK_INFO.list').refresh();
												Ext.getCmp('INV_STOK_INFO.input').hide();
												Ext.getCmp('INV_STOK_INFO.list').show();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('INV_STOK_INFO.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						}else if(req==true)
							Ext.getCmp('INV_STOK_INFO.input').qClose();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_STOK_INFO.input.panel',
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
							layout:'column',
							items:[
								{
									xtype:'ihiddenfield',
									name:'i',
									id:'INV_STOK_INFO.input.i'
								}	
							]
						},{
							xtype:'ilistinput',
							id:'INV_STOK_INFO.input.tableOption',
							name:'options',
							flex:3,
							bodyStyle:'margin-left: -1px;margin-right: -1px;margin-top:-1px;',
							margin:false,
							count:function(){
								var table=Ext.getCmp('INV_STOK_INFO.input.tableOption');
								var jumlahHarga=0;
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									jumlahHarga+=parseFloat(table._get('qty',i)._getValue());
								}
								Ext.getCmp('INV_STOK_INFO.input.total')._setValue(jumlahHarga);
								Ext.getCmp('INV_STOK_INFO.input.totalMea')._setValue(jumlahHarga/Ext.getCmp('INV_STOK_INFO.input.frac')._getValue());
							},
							items:[
								{
									xtype:'itextfield',
									name:'gin',
									text:'Kode Gin',
									readOnly:true,
									tabIndex:-1,
									width:130,
									emptyText:'Gin',
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'idatefield',
									name:'tgl_terima',
									text:'Tgl. Terima',
									readOnly:true,
									tabIndex:-1,
									width:100,
								},{
									xtype:'itextfield',
									name:'batch',
									text:'Batch',
									readOnly:true,
									tabIndex:-1,
									width:130,
									emptyText:'Batch',
								},{
									xtype:'idatefield',
									name:'expired',
									text:'Expired',
									readOnly:true,
									tabIndex:-1,
									width:100,
								},{
									xtype:'inumberfield',
									name:'price',
									align:'right',
									tabIndex: -1,
									text:'Harga Beli(Sat. K)',
									readOnly:true,
									app:{type:'CURRENCY',decimal:2},
									width: 120,
								},{
									xtype:'inumberfield',
									name:'qty_sisa',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Sisa',
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty',
									align:'right',
									text:'Qty K',
									allowBlank: false,
									emptyText:'Qty K',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_STOK_INFO.input.tableOption');
											table._get('qty_val',a.line)._setValue(a._getValue()-table._get('qty_sisa',a.line)._getValue());
											table._get('qty_b',a.line)._setValue(a._getValue()/Ext.getCmp('INV_STOK_INFO.input.frac')._getValue());
											table.count();
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty_b',
									align:'right',
									text:'Qty B',
									allowBlank: false,
									emptyText:'Qty B',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_STOK_INFO.input.tableOption');
											table._get('qty',a.line)._setValue(a._getValue()*Ext.getCmp('INV_STOK_INFO.input.frac')._getValue());
											table._get('qty_val',a.line)._setValue(table._get('qty',a.line)._getValue()-table._get('qty_sisa',a.line)._getValue());
											table.count();
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty_val',
									align:'right',
									readOnly:true,
									text:'Value',
									app:{decimal:0},
									width: 40,
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
									id : 'INV_STOK_INFO.input.total',
									width: 170,
									fieldLabel:'Stok',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'total',
									app:{decimal:0},
								},{
									xtype:'inumberfield',
									id : 'INV_STOK_INFO.input.frac',
									width: 100,
									fieldLabel:'Frac',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'frac',
									app:{decimal:0},
								},{
									xtype:'inumberfield',
									id : 'INV_STOK_INFO.input.totalMea',
									width: 170,
									fieldLabel:'wd',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'total_mea',
									app:{decimal:0},
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_STOK_INFO.input.panel').qGetForm() == false)
					Ext.getCmp('INV_STOK_INFO.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_STOK_INFO.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{
			id:'INV_STOK_INFO.history',
			hidden:true,
			border:false,
			layout:'fit',
			tbar:[
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'INV_STOK_INFO.history.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('INV_STOK_INFO.history.panel').qGetForm();
						if(req == false){
							Ext.getCmp('INV_STOK_INFO.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'INV_STOK_INFO.close',
								onY : function() {
									Ext.getCmp('INV_STOK_INFO.history').hide();
									Ext.getCmp('INV_STOK_INFO.list').show();
								}
							});
						}else{
							Ext.getCmp('INV_STOK_INFO.history').hide();
							Ext.getCmp('INV_STOK_INFO.list').show();
						}
					}
				},'->','<b>History</b>','->'
			],
			listeners:{
				show:function(){
					shortcut.set({
						code:'history',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('INV_STOK_INFO.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_STOK_INFO.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('history');
				}
			},
			items:[
				{
					xtype:'ipanel',
					id : 'INV_STOK_INFO.history.panel',
					paddingBottom:false,
					layout:{
						type:'hbox',
						align:'stretch'
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'i',
							id:'INV_STOK_INFO.history.i'
						},{
							xtype:'itable',
							flex:1,
							autoRefresh:false,
							id:'INV_STOK_INFO.history.list',
							params:function(bo){
								var obj={};
								obj['item_id']=Ext.getCmp('INV_STOK_INFO.history.i').getValue();
								return obj;
							},
							url:url + 'cmd?m=INV_STOK_INFO&f=getListHistory',
							result:function(response){
								return {list:response.d,total:response.t};
							},
							onClick:function(view, a, b, record, c, c, d){
								Ext.getCmp('INV_STOK_INFO.history.list2').refresh();
							},
							columns:[
								{ xtype: 'rownumberer'},
								{ hidden:true,dataIndex: 'i' },
								{ text: 'Tgl. Adjustment',width: 150,align:'center', dataIndex: 'f1' },
								{ text: 'Oleh',width: 150, dataIndex: 'f2' },
								{
									text: 'Hapus',
									xtype: 'actioncolumn',
									iconCls: 'fa fa-trash',
									handler: function(grid, rowIndex, colIndex, action, event, a, row) {
										_access('INV_SET_PRC_ITM_delete_adjustment',function(){
											Ext.getCmp('INV_STOK_INFO.confirm').confirm({
												msg : "Apakah akan menghapus Adjutsment ini?",
												allow : 'INV_STOK_INFO.delete',
												onY : function() {
													Ext.Ajax.request({
														url : url + 'cmd?m=INV_STOK_INFO&f=delete',
														method : 'POST',
														params : {
															i : a.data.i
														},
														before:function(){
															Ext.getCmp('INV_STOK_INFO.history.list2').setLoading(true);
														},
														success : function(response) {
															Ext.getCmp('INV_STOK_INFO.history.list2').setLoading(false);
															var r = ajaxSuccess(response);
															if (r.r == 'S'){
																Ext.getCmp('INV_STOK_INFO.history.list').refresh();
																Ext.getCmp('INV_STOK_INFO.history.list2').refresh();
															}
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('INV_STOK_INFO.history.list2').setLoading(false);
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											});
										});
									}
								}
							]
						},{
							xtype:'itable',
							flex:2,
							autoRefresh:false,
							id:'INV_STOK_INFO.history.list2',
							params:function(bo){
								var obj={};
								if(Ext.getCmp('INV_STOK_INFO.history.list').dataRow != null){
									obj['adjusment_id']=Ext.getCmp('INV_STOK_INFO.history.list').dataRow.i;
								}else{
									obj['adjusment_id']='';
								}
								return obj;
							},
							url:url + 'cmd?m=INV_STOK_INFO&f=getListHistoryGin',
							result:function(response){
								return {list:response.d,total:response.t};
							},
							columns:[
								{ xtype: 'rownumberer'},
								{ hidden:true,dataIndex: 'i' },
								{ text: 'Kode GIN',width: 120,align:'center', dataIndex: 'f1', menuDisabled:true,sortable:false},
								{ text: 'Tgl. Terima',width: 150,align:'center', dataIndex: 'f2' ,xtype:'date' , menuDisabled:true,sortable:false},
								{ text: 'Batch',width: 100,align:'center', dataIndex: 'f3', menuDisabled:true,sortable:false },
								{ text: 'Expired',width: 100,align:'center', dataIndex: 'f4', menuDisabled:true,sortable:false },
								{ text: 'Harga Beli',width: 150, menuDisabled:true,sortable:false,dataIndex: 'f5',align:'right',xtype:'numbercolumn',
									renderer: function(value,a){
										value=lib.number.formatToNumber(value,_lang);
										return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
									} 
								},{ text: 'Nilai',width: 100, menuDisabled:true,sortable:false,align:'right',xtype:'numbercolumn', dataIndex: 'f6' ,renderer: function(value,a){
										value=lib.number.formatToNumber(value,_lang);
										return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2});
									}
								}
							]
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'INV_STOK_INFO.confirm'}
	]
});