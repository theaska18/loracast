/*
	import cmp.ipanel
	import cmp.itable
	import cmp.iconfig
	import cmp.iinput
	import cmp.idatefield
	import cmp.inumberfield
	import cmp.icombobox
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_SET_PRC_ITM.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_SET_PRC_ITM.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_SET_PRC_ITM.btnShowSearch');
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_SET_PRC_ITM.main',
	layout:'fit',
	border:false,
	minWidth: 350,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_SET_PRC_ITM.search',
			modal:false,
			title:'Barang - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'ctrl+r',
								fn:function(){
									_click('INV_SET_PRC_ITM.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_SET_PRC_ITM.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_SET_PRC_ITM.search.f1').focus();
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
					id:'INV_SET_PRC_ITM.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_SET_PRC_ITM.list').refresh();
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_SET_PRC_ITM.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_SET_PRC_ITM.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'INV_SET_PRC_ITM.search.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'INV_SET_PRC_ITM.export',
							onY : function() {
								window.open(url+'cmd?m=INV_SET_PRC_ITM&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_SET_PRC_ITM.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_SET_PRC_ITM.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_SET_PRC_ITM.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_SET_PRC_ITM.search.btnSearch');
								}
							},
							id:'INV_SET_PRC_ITM.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_SET_PRC_ITM.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_SET_PRC_ITM.search2',
			modal:false,
			title:'Rekanan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'ctrl+r',
								fn:function(){
									_click('INV_SET_PRC_ITM.search2.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_SET_PRC_ITM.search2.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_SET_PRC_ITM.search2.f1').focus();
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
					id:'INV_SET_PRC_ITM.search2.btnSearch',
					handler: function() {
						Ext.getCmp('INV_SET_PRC_ITM.list2').refresh();
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_SET_PRC_ITM.search2.btnReset',
					handler: function() {
						Ext.getCmp('INV_SET_PRC_ITM.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'INV_SET_PRC_ITM.search2.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'INV_SET_PRC_ITM.export',
							onY : function() {
								window.open(url+'cmd?m=INV_SET_PRC_ITM&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_SET_PRC_ITM.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_SET_PRC_ITM.search2').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_SET_PRC_ITM.search2.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Rerkanan',
							press:{
								enter:function(){
									_click('INV_SET_PRC_ITM.search2.btnSearch');
								}
							},
							id:'INV_SET_PRC_ITM.search2.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Rekanan',
							press:{
								enter:function(){
									_click('INV_SET_PRC_ITM.search2.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'panel',
			border:false,
			autoScroll :true,
			layout:{
				type:'hbox',
				align:'stretch'
			},
			items:[
				{ 
					xtype:'panel',
					border:false,
					minWidth: 400,
					flex:2,
					layout:{
						type:'vbox',
						align:'stretch'
					},
					items:[
						{
							xtype:'itable',
							flex:3,
							id:'INV_SET_PRC_ITM.list',
							params:function(bo){
								if(bo==true){
									var arr=Ext.getCmp('INV_SET_PRC_ITM.search.panel').qParams();
									return arr;
								}else{
									var obj={};
									obj[Ext.getCmp('INV_SET_PRC_ITM.dropdown').getValue()]=Ext.getCmp('INV_SET_PRC_ITM.text').getValue();
									return obj;
								}
							},
							group:'f1',
							url:url + 'cmd?m=INV_SET_PRC_ITM&f=getList',
							result:function(response){
								return {list:response.d,total:response.t};
							},
							onClick:function(view, a, b, record, c, c, d){
								Ext.getCmp('INV_SET_PRC_ITM.pid').setValue(record.data.i);
								Ext.getCmp('INV_SET_PRC_ITM.measurement_id').setValue(record.data.f7);
								Ext.getCmp('INV_SET_PRC_ITM.textBarang').setValue(record.data.f1);
								Ext.getCmp('INV_SET_PRC_ITM.textSatuan').setValue(record.data.f3);
								if(_access('INV_SET_PRC_ITM_partners')==false){
									Ext.getCmp('INV_SET_PRC_ITM.list2').refresh();
								}
								if(_access('INV_SET_PRC_ITM_jadwal')==false){
									Ext.getCmp('INV_SET_PRC_ITM.list3').refresh();
								}
							},
							tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
									xtype:'iconfig',
									id:'INV_SET_PRC_ITM.config',
									code:[
										iif(_access('INV_SET_PRC_ITM_config_UNIT_ID')==false,'UNIT_ID',null),
									]
								},'->',{
									xtype:'buttongroup',
									id:'INV_SET_PRC_ITM.group.search',
									items:[
										{
											xtype:'icombobox',
											id : 'INV_SET_PRC_ITM.dropdown',
											emptyText:'Pencarian',
											margin:false,
											value:'f2',
											data:[
												{id:'f2',text:'Nama Barang'},
												{id:'f1',text:'Kode Barang'},
											],
											width: 150,
											press:{
												enter:function(){
													_click('INV_SET_PRC_ITM.btnSearch');
												}
											}
										},{
											xtype:'itextfield',
											width: 200,
											emptyText:'Pencarian',
											margin:false,
											tooltip:'Pencarian [Ctrl+f]',
											id:'INV_SET_PRC_ITM.text',
											press:{
												enter:function(){
													_click('INV_SET_PRC_ITM.btnSearch');
												}
											}
										},{
											iconCls: 'fa fa-search',
											tooltip:'Pencarian [F5]',
											id:'INV_SET_PRC_ITM.btnSearch',
											handler : function(a) {
												Ext.getCmp('INV_SET_PRC_ITM.list').refresh(false);
											}
										},{
											tooltip:'Export',
											iconCls: 'fa fa-file-excel-o',
											tooltip:'Export To Excel',
											id:'INV_SET_PRC_ITM.btnExport',
											handler:function(a){
												Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
													msg : "Apakah Akan Export Data ?",
													allow : 'INV_SET_PRC_ITM.export',
													onY : function() {
														window.open(url+'cmd?m=INV_SET_PRC_ITM&f=toExcel&session='+_session_id+'&'+Ext.getCmp('INV_SET_PRC_ITM.dropdown').getValue()+'='+Ext.getCmp('INV_SET_PRC_ITM.text').getValue());
													}
												})
											}
										}
									]
								},{
									tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
									id:'INV_SET_PRC_ITM.btnShowSearch',
									iconCls: 'fa fa-filter',
									handler:function(a){
										Ext.getCmp('INV_SET_PRC_ITM.search').show();
										Ext.getCmp('INV_SET_PRC_ITM.search.f1').focus();
									}
								}
							],
							columns:[
								{ hidden:true,dataIndex: 'i' },
								{ hidden:true,dataIndex: 'f7' },
								{ hidden:true,text: '<div></div>',width:300,dataIndex: 'f1'},
								{ text: 'Satuan',width:120,menuDisabled:true,sortable:false,dataIndex: 'f3'},
								{ text: 'Frac',width: 50,menuDisabled:true,sortable:false,dataIndex: 'f6',align:'right'},
								{ text: 'Harga Beli',width: 100,menuDisabled:true,sortable:false,dataIndex: 'f2',align:'right',
									renderer: function(value,a){
										if(value !=='Jasa'){
											value=lib.number.formatToNumber(value,_lang);
											return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2,style: 'currency', currency:'IDR'})
										}else{
											return value;
										}
									} 
								},
								{ text: 'Harga Jual',width: 120,menuDisabled:true,sortable:false,dataIndex: 'f4',align:'right',xtype:'numbercolumn',
									editor:iif(_access('INV_SET_PRC_ITM_update_price')==false,{
										xtype:'numberfield',
										app:{decimal:0},
										listeners:{
											focus:function(a){
												a.selectdata=Ext.getCmp('INV_SET_PRC_ITM.list').getDataSelect();
											},
											blur:function(a){
												var obj=a.selectdata;
												if(parseFloat(obj.f4)!==parseFloat(a.getValue())){
													_access('INV_SET_PRC_ITM_update_price',function(){
														Ext.Ajax.request({
															url : url + 'cmd?m=INV_SET_PRC_ITM&f=initUpdatePrice',
															params:{
																item:obj.i,
																measurement_id:obj.f7,
																price:a.getValue()
															},
															method : 'POST',
															success : function(response) {
																var r = ajaxSuccess(response);
																if (r.r == 'S') {
																}
															},
															failure : function(jqXHR, exception) {
																ajaxError(jqXHR, exception,true);
															}
														});
													});
												}
											}
										},
										margin:false,
									},false),
									renderer: function(value,a){
										if(_access('INV_SET_PRC_ITM_update_price')==false){
											a.style = "background-color:#ffffcc;";
										}
										value=lib.number.formatToNumber(value,_lang);
										return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2,style: 'currency', currency:'IDR'})
									} 
								},{ text: 'Harga Sekarang',width: 120, menuDisabled:true,sortable:false,dataIndex: 'f5',align:'right',
									renderer: function(value,a){
										if(a.record.data.f4 != a.record.data.f5){
											a.style = "background-color:#fdc0c0;";
										}
										value=lib.number.formatToNumber(value,_lang);
										return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2,style: 'currency', currency:'IDR'})
									}
								}
							]
						}
					]
				},{ 
					xtype:'panel',
					style:'margin-top:-1px;margin-right:-1px;margin-bottom:-1px',
					flex:2,
					layout:{
						type:'vbox',
						align:'stretch'
					},
					minWidth: 400,
					autoScroll :true,
					padding:false,
					items:[
						{
							border:false,
							layout:'form',
							padding:true,
							items:[
								{
									xtype:'itextfield',
									readOnly:true,
									fieldLabel:'Barang',
									margin:false,
									id:'INV_SET_PRC_ITM.textBarang',
								},{
									xtype:'itextfield',
									readOnly:true,
									fieldLabel:'Satuan',
									margin:false,
									id:'INV_SET_PRC_ITM.textSatuan',
								}
							]
						},{
							xtype:'itable',
							minHeight:250,
							flex:2,
							hidden:iif(_access('INV_SET_PRC_ITM_partners')==true,true,false),
							autoRefresh:false,
							id:'INV_SET_PRC_ITM.list2',
							params:function(bo){
								var arr=Ext.getCmp('INV_SET_PRC_ITM.search2.panel').qParams();
								arr['pid']=Ext.getCmp('INV_SET_PRC_ITM.pid').getValue();
								arr['measurement_id']=Ext.getCmp('INV_SET_PRC_ITM.measurement_id').getValue();
								return arr;
							},
							url:url + 'cmd?m=INV_SET_PRC_ITM&f=getListRekanan',
							result:function(response){
								return {list:response.d,total:response.t};
							},
							tbar:[{
									text:'Reset',
									tooltip:'Reset Harga Rekanan Ke Harga General.',
									iconCls:'fa fa-eraser',
									handler:function(){
										if(Ext.getCmp('INV_SET_PRC_ITM.pid').getValue()!=''){
											Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
												msg : "Apakah reset harga '"+Ext.getCmp('INV_SET_PRC_ITM.textBarang').getValue() +"' ke harga General?",
												allow : 'INV_SET_PRC_ITM.resetPrice',
												onY : function() {
													Ext.Ajax.request({
														url : url + 'cmd?m=INV_SET_PRC_ITM&f=resetHargaPartners',
														method : 'POST',
														params:{
															item:Ext.getCmp('INV_SET_PRC_ITM.pid').getValue(),
															measurement_id:Ext.getCmp('INV_SET_PRC_ITM.measurement_id').getValue()
														},
														before:function(){
															Ext.getCmp('INV_SET_PRC_ITM.list2').setLoading(true);
														},
														success : function(response) {
															Ext.getCmp('INV_SET_PRC_ITM.list2').setLoading(false);
															var r = ajaxSuccess(response);
															if (r.r == 'S') {
																Ext.getCmp('INV_SET_PRC_ITM.list2').refresh();
															}
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('INV_SET_PRC_ITM.list2').setLoading(false);
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											});
										}else{
											Ext.create('IToast').toast({msg : 'Tidak ada barang yang dipilih.',type : 'warning'});
										}
									}
								},'->','<b>Harga Per Partner</b>','->',{
									xtype:'ihiddenfield',
									id:'INV_SET_PRC_ITM.pid',
								},{
									xtype:'ihiddenfield',
									id:'INV_SET_PRC_ITM.measurement_id',
								},{
									tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
									id:'INV_SET_PRC_ITM.btnShowSearch2',
									iconCls: 'fa fa-filter',
									handler:function(a){
										Ext.getCmp('INV_SET_PRC_ITM.search2').show();
										Ext.getCmp('INV_SET_PRC_ITM.search2.f1').focus();
									}
								}
							],
							columns:[
								{ xtype: 'rownumberer'},
								{ hidden:true,dataIndex: 'i' },
								{ text: 'Rekanan',flex:1,dataIndex: 'f1' },
								{ text: 'Harga',width: 150,dataIndex: 'f4',align:'right',xtype:'numbercolumn',sortable :false,menuDisabled:true,
									editor:iif(_access('INV_SET_PRC_ITM_update_price_partners')==false,{
										xtype:'numberfield',
										listeners:{
											focus:function(a){
												a.selectdata=Ext.getCmp('INV_SET_PRC_ITM.list2').getDataSelect();
											},
											blur:function(a){
												var obj=a.selectdata;
												if(parseFloat(obj.f4)!==parseFloat(a.getValue())){
													_access('INV_SET_PRC_ITM_update_price_partners',function(){
														Ext.Ajax.request({
															url : url + 'cmd?m=INV_SET_PRC_ITM&f=initUpdatePricePartners',
															params:{
																partners:obj.i,
																price:a.getValue(),
																item:Ext.getCmp('INV_SET_PRC_ITM.pid').getValue(),
																measurement_id:Ext.getCmp('INV_SET_PRC_ITM.measurement_id').getValue()
															},
															method : 'POST',
															success : function(response) {
																var r = ajaxSuccess(response);
																if (r.r == 'S') {
																}
															},
															failure : function(jqXHR, exception) {
																ajaxError(jqXHR, exception,true);
															}
														});
													});
												}
											}
										},
										app:{decimal:0},
										margin:false,
									},false),
									renderer: function(value,a){
										if(_access('INV_SET_PRC_ITM_update_price_partners')==false){
											a.style = "background-color:#ffffcc;";
										}
										value=lib.number.formatToNumber(value,_lang);
										return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2,style: 'currency', currency:'IDR'})
									} 
								},{ text: 'KSO',width: 50,sortable :false,menuDisabled:true,dataIndex: 'f5',align:'center',
									renderer: function(value,meta){
										if(value==1)
											return '<span class="fa fa-check"></span>';
										return '<span class="fa fa-close"></span>';
									}
								},
							]
						},{
							xtype:'itable',
							height:150,
							hideBbar:true,
							hidden:iif(_access('INV_SET_PRC_ITM_jadwal')==true,true,false),
							autoRefresh:false,
							id:'INV_SET_PRC_ITM.list3',
							params:function(bo){
								var obj={};
								obj['item_id']=Ext.getCmp('INV_SET_PRC_ITM.pid').getValue();
								obj['measurement_id']=Ext.getCmp('INV_SET_PRC_ITM.measurement_id').getValue();
								return obj;
							},
							url:url + 'cmd?m=INV_SET_PRC_ITM&f=getListJadwal',
							result:function(response){
								return {list:response.d,total:response.t};
							},
							tbar:[
								{
									text:'Tambah',
									tooltip:'Tambah Jadwal',
									iconCls:'fa fa-plus',
									handler:function(){
										if(Ext.getCmp('INV_SET_PRC_ITM.pid').getValue()!=''){
											Ext.getCmp('INV_SET_PRC_ITM.input').show();
											Ext.getCmp('INV_SET_PRC_ITM.input.panel').qReset();
											Ext.getCmp('INV_SET_PRC_ITM.input').setTitle('Tambah Jadwal Periode Harga');
											Ext.getCmp('INV_SET_PRC_ITM.input.f1').focus();
											Ext.getCmp('INV_SET_PRC_ITM.input.panel').qSetForm();
										}else{
											Ext.create('IToast').toast({msg : 'Tidak ada barang yang dipilih.',type : 'warning'});
										}
									}
								},'->','<b>Periode Perubahan Harga Barang</b>','->'
							],
							columns:[
								{ hidden:true,dataIndex: 'i' },
								{ text: 'Tanggal Awal',width: 100,menuDisabled:true,sortable:false,align:'center', dataIndex: 'f1',xtype:'date'},
								{ text: 'Tanggal Akhir',width: 100,menuDisabled:true,sortable:false,align:'center',dataIndex: 'f2',xtype:'date'},
								{ text: 'Keterangan',flex:1,menuDisabled:true,sortable:false,dataIndex: 'f3'},
								{ text: 'Harga',width: 120,menuDisabled:true,sortable:false,dataIndex: 'f4',align:'right',xtype:'numbercolumn',
									renderer: function(value,a){
										value=lib.number.formatToNumber(value,_lang);
										return Number(value).toLocaleString(_lang_browser,{minimumFractionDigits:2,style: 'currency', currency:'IDR'})
									} 
								},{
									text: 'Hapus',
									xtype: 'actioncolumn',
									iconCls: 'fa fa-trash',
									handler: function(grid, rowIndex, colIndex, action, event, a, row) {
										_access('INV_SET_PRC_ITM_deleteJadwal',function(){
											Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
												msg : "Apakah akan menghapus Jadwal ini?",
												allow : 'INV_SET_PRC_ITM.delete',
												onY : function() {
													Ext.Ajax.request({
														url : url + 'cmd?m=INV_SET_PRC_ITM&f=deleteJadwal',
														method : 'POST',
														params : {
															i : a.data.i
														},
														before:function(){
															Ext.getCmp('INV_SET_PRC_ITM.list3').setLoading(true);
														},
														success : function(response) {
															Ext.getCmp('INV_SET_PRC_ITM.list3').setLoading(false);
															var r = ajaxSuccess(response);
															if (r.r == 'S')
																Ext.getCmp('INV_SET_PRC_ITM.list3').refresh();
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('INV_SET_PRC_ITM.list3').setLoading(false);
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											});
										});
									}
								}
							]
						}
					]
				}
			]
		},
		,{
			xtype:'iwindow',
			id:'INV_SET_PRC_ITM.input',
			modal : true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('INV_SET_PRC_ITM.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_SET_PRC_ITM.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			fbar: [{
				text: 'Simpan',
				tooltip:'Simpan <b>[Ctrl+s]</b>',
				id:'INV_SET_PRC_ITM.input.btnSave',
				iconCls:'fa fa-save',
				handler: function() {
					var req=Ext.getCmp('INV_SET_PRC_ITM.input.panel').qGetForm(true);
					if(req == false)
						Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
							msg : 'Apakah akan Simpan data ini?',
							allow : 'INV_SET_PRC_ITM.save',
							onY : function() {
								var param = Ext.getCmp('INV_SET_PRC_ITM.input.panel').qParams();
								param['item_id']=Ext.getCmp('INV_SET_PRC_ITM.pid').getValue();
								param['measurement_id']=Ext.getCmp('INV_SET_PRC_ITM.measurement_id').getValue();
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_SET_PRC_ITM&f=saveJadwal',
									method : 'POST',
									params:param,
									before:function(){
										Ext.getCmp('INV_SET_PRC_ITM.input').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_SET_PRC_ITM.input').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {
											Ext.getCmp('INV_SET_PRC_ITM.input').qClose();
											Ext.getCmp('INV_SET_PRC_ITM.list3').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_SET_PRC_ITM.input').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					else if(req==true)
						Ext.getCmp('INV_SET_PRC_ITM.input').qClose();
				}
			},{
				text:'Keluar',
				tooltip:'Keluar <b>[Esc]</b>',
				id:'INV_SET_PRC_ITM.input.btnClose',
				iconCls:'fa fa-close',
				handler: function() {
					Ext.getCmp('INV_SET_PRC_ITM.input').close();
				}
			}],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_SET_PRC_ITM.input.panel',
					width: 350,
					items:[
						{
							xtype:'iinput',
							label : 'Periode',
							items : [
								 {
									xtype:'idatefield',
									name : 'f1',
									margin:false,
									minValue:new Date(),
									emptyText: 'Awal',
									listeners:{
										blur:function(a){
											Ext.getCmp('INV_SET_PRC_ITM.input.f2').setMinValue(a.getValue());
											Ext.getCmp('INV_SET_PRC_ITM.input.f2').setValue(a.getValue());
										}
									},
									allowBlank : false,
									id : 'INV_SET_PRC_ITM.input.f1',
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									emptyText: 'Akhir',
									allowBlank : false,
									id : 'INV_SET_PRC_ITM.input.f2',
								}
							]
						},{
							xtype:'itextfield',
							fieldLabel:'Keterangan',
							name : 'f3',
							allowBlank : false,
							id : 'INV_SET_PRC_ITM.input.f3',
						},{
							xtype:'inumberfield',
							fieldLabel:'Harga',
							name : 'f4',
							width: 200,
							allowBlank : false,
							app:{type:'CURRENCY'},
							id : 'INV_SET_PRC_ITM.input.f4',
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_SET_PRC_ITM.input.panel').qGetForm() == false)
					Ext.getCmp('INV_SET_PRC_ITM.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah di ubah?',
						allow : 'INV_SET_PRC_ITM.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},
		{xtype:'iconfirm',id : 'INV_SET_PRC_ITM.confirm'}
	]
});